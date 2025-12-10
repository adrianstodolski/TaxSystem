
import { AmortizationSchedule, Asset, AssetCategory, CostCategory, SimulationParams, SimulationResult, TaxBreakdown, TaxationForm, TaxFormType, ZusBreakdown } from "../types";

// Constants for Polish Tax System (Simplified 2023/2024 rules)
const TAX_THRESHOLD = 120000;
const TAX_RATE_1 = 0.12;
const TAX_RATE_2 = 0.32;
const TAX_FREE_REDUCTION = 3600; // 30,000 * 12%

// Constants for ZUS (Simplified 2024 bases)
const ZUS_SOCIAL_BASE = 1600.32; // Duży ZUS (Emerytalne, Rentowe, Chorobowe, Wypadkowe)
const HEALTH_INSURANCE_MIN = 381.78; // Minimalna zdrowotna

export const ZusEngine = {
    calculate: (taxationForm: TaxationForm, revenue: number, income: number): ZusBreakdown => {
        // 1. Social Contributions (Duży ZUS - Fixed for simplicity)
        // Emerytalne (19.52%), Rentowe (8%), Chorobowe (2.45%), Wypadkowe (~1.67%)
        // Total approx: ~31.64% of base. Using fixed amounts for 2024 (excluding Health).
        const socialTotal = 1600.32; 

        // 2. Health Insurance (Changes by form)
        let healthInsurance = 0;
        let deductibleFromTax = 0; // Zdrowotna odliczana od podatku
        const deductibleFromTaxBase = socialTotal; // Społeczne always deductible from income

        if (taxationForm === TaxationForm.GENERAL_SCALE) {
            // Skala: 9% of Income, not deductible
            healthInsurance = Math.max(income * 0.09, HEALTH_INSURANCE_MIN);
        } 
        else if (taxationForm === TaxationForm.FLAT_RATE) {
            // Liniowy: 4.9% of Income
            healthInsurance = Math.max(income * 0.049, HEALTH_INSURANCE_MIN);
            // Deductible up to limit (approx 11,600 PLN/year -> ~966/month)
            deductibleFromTax = Math.min(healthInsurance, 966); 
        }
        else if (taxationForm === TaxationForm.LUMP_SUM) {
            // Ryczałt: Fixed tiers based on revenue (approx 60k / 300k limits)
            // Simplified: Assuming middle tier
            healthInsurance = 626.93; 
            deductibleFromTax = healthInsurance * 0.5; // 50% deductible
        }

        const laborFund = 0; // FP often 0 if you have other titles or age, simplified to 0

        return {
            socialTotal,
            healthInsurance,
            laborFund,
            totalDue: socialTotal + healthInsurance + laborFund,
            deductibleFromTaxBase,
            deductibleFromTax
        };
    }
};

/**
 * Calculates tax based on the General Scale (Skala Podatkowa)
 * Used for PIT-36 (General principles) and PIT-37 (Employment)
 */
export const calculateGeneralScaleTax = (revenue: number, costs: number, zus?: ZusBreakdown): TaxBreakdown => {
  // Deduct ZUS Social from Income base
  const socialDeduction = zus ? zus.deductibleFromTaxBase : 0;
  
  const income = Math.max(0, revenue - costs);
  const taxBase = Math.round(Math.max(0, income - socialDeduction));
  
  let taxDue = 0;
  let firstBracketAmount = 0;
  let secondBracketAmount = 0;
  let thresholdExceeded = false;

  if (taxBase <= TAX_THRESHOLD) {
    // Under 120k
    firstBracketAmount = taxBase;
    taxDue = (taxBase * TAX_RATE_1) - TAX_FREE_REDUCTION;
  } else {
    // Over 120k
    thresholdExceeded = true;
    firstBracketAmount = TAX_THRESHOLD;
    secondBracketAmount = taxBase - TAX_THRESHOLD;
    
    const taxOnFirstBracket = 10800; // (120,000 * 12%) - 3600
    const taxOnSecondBracket = secondBracketAmount * TAX_RATE_2;
    
    taxDue = taxOnFirstBracket + taxOnSecondBracket;
  }

  // Deduct Health Insurance if applicable (Liniowy/Ryczałt logic handled in TaxEngine wrapper, 
  // but for Scale it's 0 deductible from tax in New Deal)
  // However, if we passed 'deductibleFromTax' in ZUS, we use it here (mostly for Linear logic reuse)
  if (zus && zus.deductibleFromTax > 0) {
      // NOTE: For Liniowy, it is usually deducted from Income, not Tax. 
      // Ryczałt deducts 50% of health from Revenue.
      // This function handles Scale mainly.
  }

  // Tax cannot be negative
  taxDue = Math.max(0, Math.round(taxDue));

  return {
    revenue,
    costs,
    income,
    taxBase,
    taxFreeAmount: TAX_FREE_REDUCTION,
    taxRate: thresholdExceeded ? 0.32 : 0.12,
    healthInsurance: zus ? zus.healthInsurance : 0,
    taxDue,
    zus,
    details: {
      thresholdExceeded,
      firstBracketAmount,
      secondBracketAmount
    }
  };
};

/**
 * Calculates tax for Capital Gains (PIT-38)
 * Flat rate 19%
 */
export const calculateCapitalGainsTax = (revenue: number, costs: number): TaxBreakdown => {
  const income = Math.max(0, revenue - costs);
  const taxBase = Math.round(income);
  const RATE = 0.19;
  
  const taxDue = Math.round(taxBase * RATE);

  return {
    revenue,
    costs,
    income,
    taxBase,
    taxFreeAmount: 0,
    taxRate: RATE,
    healthInsurance: 0,
    taxDue,
    details: {
      thresholdExceeded: false,
      firstBracketAmount: taxBase,
      secondBracketAmount: 0
    }
  };
};

export const TaxEngine = {
  calculate: (type: TaxFormType, revenue: number, costs: number, taxationForm: TaxationForm): TaxBreakdown => {
    
    // 1. Calculate ZUS first
    const incomeForZus = Math.max(0, revenue - costs);
    const zus = ZusEngine.calculate(taxationForm, revenue, incomeForZus);

    switch (type) {
      case TaxFormType.PIT_37:
      case TaxFormType.PIT_36:
        // Pass ZUS to calculation
        return calculateGeneralScaleTax(revenue, costs, zus);
      case TaxFormType.PIT_38:
        return calculateCapitalGainsTax(revenue, costs); // No ZUS on Capital Gains typically
      default:
        return calculateGeneralScaleTax(revenue, costs, zus);
    }
  }
};

/**
 * VAT Engine & Scenario Simulator
 */
export const TaxSimulator = {
    simulateExpense: (params: SimulationParams): SimulationResult => {
        const { amountGross, vatRate, category, taxationForm } = params;
        
        // 1. Calculate VAT Basics
        // Gross = Net * (1 + rate) => Net = Gross / (1 + rate)
        const amountNet = amountGross / (1 + vatRate);
        const vatTotal = amountGross - amountNet;
        
        // 2. Determine Deductible VAT
        let vatDeductiblePct = 1.0;
        if (category === CostCategory.FUEL_75) vatDeductiblePct = 0.5; // Mixed car usage: 50% VAT
        if (category === CostCategory.REPRESENTATION_0) vatDeductiblePct = 0;

        const vatDeductible = vatTotal * vatDeductiblePct;
        const vatNonDeductible = vatTotal - vatDeductible;

        // 3. Calculate PIT/CIT Cost Basis
        // Cost Basis = Net + Non-Deductible VAT
        const pitCostBasis = amountNet + vatNonDeductible;

        // 4. Determine PIT Deductibility (NKUP)
        let pitDeductiblePct = 1.0;
        if (category === CostCategory.FUEL_75) pitDeductiblePct = 0.75; // 75% for mixed car usage
        if (category === CostCategory.REPRESENTATION_0) pitDeductiblePct = 0;
        
        const pitDeductibleAmount = pitCostBasis * pitDeductiblePct;

        // 5. Calculate Tax Shield (Income Tax Savings)
        // Assume effective tax rate based on form
        let effectiveTaxRate = 0.12; // Default Scale 1st bracket
        if (taxationForm === TaxationForm.FLAT_RATE) effectiveTaxRate = 0.19;
        if (taxationForm === TaxationForm.LUMP_SUM) effectiveTaxRate = 0; // No cost deduction on Ryczałt!

        const pitTaxShield = pitDeductibleAmount * effectiveTaxRate;

        // 6. Total Savings & Real Cost
        const totalSavings = vatDeductible + pitTaxShield;
        const realCost = amountGross - totalSavings;

        return {
            amountNet,
            vatTotal,
            vatDeductible,
            vatNonDeductible,
            pitCostBasis,
            pitDeductibleAmount,
            pitTaxShield,
            totalSavings,
            realCost,
            percentSaved: totalSavings / amountGross
        };
    }
};

/**
 * Amortization Engine (Środki Trwałe)
 */
export const AmortizationEngine = {
    getRateForCategory: (cat: AssetCategory): number => {
        switch(cat) {
            case AssetCategory.COMPUTER: return 0.30;
            case AssetCategory.PHONE: return 0.20;
            case AssetCategory.CAR: return 0.20;
            case AssetCategory.FURNITURE: return 0.20;
            case AssetCategory.SOFTWARE: return 0.50;
            case AssetCategory.OTHER: return 0.10;
            default: return 0.20;
        }
    },

    calculateSchedule: (initialValue: number, rate: number, startDateStr: string): AmortizationSchedule[] => {
        const schedule: AmortizationSchedule[] = [];
        const monthlyRate = rate / 12;
        const monthlyAmount = initialValue * monthlyRate;
        
        // Start from next month after purchase
        const startDate = new Date(startDateStr);
        let currentYear = startDate.getFullYear();
        let currentMonth = startDate.getMonth() + 1; // 0-indexed in JS, need 1-indexed for logic, but wait, usually amort starts next month
        
        currentMonth++; 
        if(currentMonth > 12) { currentMonth = 1; currentYear++; }

        let remaining = initialValue;
        let accumulated = 0;
        
        // Safety break for loop
        let months = 0;
        while(remaining > 0 && months < 120) { // Max 10 years
            let writeOff = monthlyAmount;
            if (remaining < writeOff) writeOff = remaining;
            
            remaining -= writeOff;
            accumulated += writeOff;
            
            schedule.push({
                year: currentYear,
                month: currentMonth,
                writeOffAmount: writeOff,
                remainingValue: Math.max(0, remaining),
                accumulated: accumulated
            });

            currentMonth++;
            if(currentMonth > 12) {
                currentMonth = 1;
                currentYear++;
            }
            months++;
        }

        return schedule;
    }
};
