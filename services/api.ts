
import {
    Transaction, ExpenseBreakdown, VatSummary, CashFlowPoint, Budget, AuditRiskFactor,
    MarketComparison, RealEstateProperty, StockAsset, BankAccount, CryptoWallet,
    TaxReturn, TaxFormType, TaxStatus, Invoice, RecurringInvoice, RecurringSuggestion,
    NbpTable, CostCategory, Asset, AssetCategory, Contractor, WhiteListStatus,
    FinancialReport, CalendarEvent, ExportFormat, SearchResult, Notification,
    CryptoTransaction, DeFiProtocol, GoldRushTx, NFTAsset, SubscriptionPlan,
    UserProfile, TaxOffice, AuditEntry, TeamMember, UserRole, ApiVaultStatus,
    CryptoExchange, DirectDebitMandate, FinancialHealthScore, AccountVerification,
    TransferRequest, BulkPaymentBatch, VrpConfig, ExchangeRate, FxPosition,
    LedgerEntry, Project, VirtualCard, Employee, PayrollEntry, Product,
    WarehouseDocument, Vehicle, Order, OssTransaction, OssCountryReport,
    IntrastatThreshold, AuditPackage, IndustryStat, MacroIndicator, EsgScore,
    Contract, MarketplaceItem, TaxEngineConfig, TaxEngineStatus, ForensicsSummary,
    TaxPrediction, LegislativeAlert, Loan, CountryTaxProfile, ForeignIncome,
    CrossBorderResult, TaxOptimizationOpportunity, Dividend, UnifiedLedgerItem,
    ClientProfile, UnclassifiedTransaction, MerchantStats, MerchantTx,
    AutomationRule, ImportJob, CsvMapping, RiskAssessment, TxAnalysisResult,
    TaxSnapshot, TimeEntry, EmailMessage, TokenSecurity, Subscription,
    WhaleWallet, WhaleTx, SimulationParams, SimulationResult, InvoiceItem,
    TaxationForm, CryptoTransactionType, ApiProvider, ViewState, GusData,
    DebtCase, Shareholder, BusinessTrip, CashDocument, DerivativePosition, BondPosition,
    UserApiKey, ApiUsageStats, WebhookConfig, SystemStatusData, SystemComponent, Incident,
    HelpArticle, HelpCategory, AgentMessage
} from '../types';
import { TaxSimulator } from '../utils/taxUtils';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const NuffiService = {
    // ... existing methods ...
    fetchRecentTransactions: async (): Promise<Transaction[]> => {
        await delay(500);
        return [
            { id: '1', date: '2023-10-25', description: 'Hosting AWS', amount: -450.00, category: 'IT', bankId: 'mbank' },
            { id: '2', date: '2023-10-24', description: 'Przychód z faktury 12/2023', amount: 12500.00, category: 'Sales', bankId: 'mbank' },
            { id: '3', date: '2023-10-23', description: 'Paliwo Orlen', amount: -230.50, category: 'Car', bankId: 'ing' },
        ];
    },

    fetchExpensesBreakdown: async (): Promise<ExpenseBreakdown[]> => {
        await delay(500);
        return [
            { category: 'Usługi obce', amount: 4500, percentage: 45 },
            { category: 'Paliwo', amount: 1200, percentage: 12 },
            { category: 'Biuro', amount: 800, percentage: 8 },
            { category: 'Inne', amount: 3500, percentage: 35 },
        ];
    },

    fetchVatSummary: async (): Promise<VatSummary> => {
        await delay(500);
        return { outputVat: 23000, inputVat: 12000, vatDue: 11000 };
    },

    fetchCashFlowProjection: async (): Promise<CashFlowPoint[]> => {
        await delay(500);
        return [
            { date: '2023-10', balance: 45000, type: 'ACTUAL' },
            { date: '2023-11', balance: 52000, type: 'PROJECTED' },
            { date: '2023-12', balance: 48000, type: 'PROJECTED' },
            { date: '2024-01', balance: 60000, type: 'PROJECTED' },
        ];
    },

    fetchBudgets: async (): Promise<Budget[]> => {
        await delay(500);
        return [
            { id: '1', category: 'Marketing', limit: 5000, spent: 3200, forecast: 4800, status: 'SAFE', percentUsed: 64 },
            { id: '2', category: 'Software', limit: 2000, spent: 1950, forecast: 2100, status: 'WARNING', percentUsed: 97.5 },
            { id: '3', category: 'Biuro', limit: 1000, spent: 400, forecast: 1000, status: 'SAFE', percentUsed: 40 },
        ];
    },

    runAuditRiskAnalysis: async (): Promise<AuditRiskFactor[]> => {
        await delay(1500);
        return [
            { id: '1', category: 'VAT', title: 'Nietypowa stawka VAT', description: 'Faktura 123/2023 ma stawkę 0% bez uzasadnienia w VIES.', severity: 'HIGH', detected: true },
            { id: '2', category: 'COSTS', title: 'Wydatki prywatne', description: 'Transakcja w kategorii "Rozrywka" w weekend.', severity: 'MEDIUM', detected: true },
        ];
    },

    fetchMarketComparison: async (): Promise<MarketComparison[]> => {
        await delay(600);
        return [
            { metric: 'Marża netto', myValue: 22, marketValue: 18, difference: 4, status: 'BETTER' },
            { metric: 'Koszt pracy', myValue: 45, marketValue: 40, difference: -5, status: 'WORSE' },
        ];
    },

    fetchRealEstate: async (): Promise<RealEstateProperty[]> => {
        await delay(600);
        return [
            { id: '1', name: 'Apartament Centrum', type: 'APARTMENT', address: 'Złota 44, Warszawa', purchaseValue: 1200000, currentValue: 1450000, rentalIncomeMonthly: 6500, occupancyStatus: 'RENTED', taxation: 'LUMP_SUM', roi: 5.4 },
            { id: '2', name: 'Biuro Mokotów', type: 'OFFICE', address: 'Domaniewska 34, Warszawa', purchaseValue: 800000, currentValue: 780000, rentalIncomeMonthly: 0, occupancyStatus: 'VACANT', taxation: 'LUMP_SUM', roi: 0 },
        ];
    },

    fetchStockPortfolio: async (): Promise<StockAsset[]> => {
        await delay(600);
        return [
            { symbol: 'AAPL', name: 'Apple Inc.', type: 'STOCK', quantity: 50, avgPrice: 145, currentPrice: 175, currency: 'USD', valuePln: 36750, pnl: 6300, pnlPercent: 20.6 },
            { symbol: 'VWRA', name: 'Vanguard FTSE All-World', type: 'ETF', quantity: 200, avgPrice: 98, currentPrice: 105, currency: 'USD', valuePln: 88200, pnl: 5880, pnlPercent: 7.1 },
            { symbol: 'XAU', name: 'Gold Spot', type: 'COMMODITY', quantity: 5, avgPrice: 1800, currentPrice: 1950, currency: 'USD', valuePln: 40950, pnl: 3150, pnlPercent: 8.3 },
        ];
    },

    fetchAccounts: async (): Promise<BankAccount[]> => {
        await delay(500);
        return [
            { id: '1', providerName: 'mBank', accountNumber: 'PL12345678901234567890123456', balance: 45230.50, currency: 'PLN', lastSync: '2023-10-25T10:00:00Z', type: 'BUSINESS', colorTheme: 'bg-gradient-to-br from-red-600 to-red-700', logo: 'M', aggregator: 'SALT_EDGE' },
            { id: '2', providerName: 'Revolut', accountNumber: 'LT1234567890', balance: 1250.00, currency: 'EUR', lastSync: '2023-10-25T10:00:00Z', type: 'MULTI_CURRENCY', colorTheme: 'bg-gradient-to-br from-blue-500 to-blue-600', logo: 'R', aggregator: 'TRUELAYER' },
        ];
    },

    fetchWallets: async (): Promise<CryptoWallet[]> => {
        await delay(500);
        return [
            { id: '1', provider: 'MetaMask', address: '0x71C...9A23', chain: 'ETH', assetCount: 12, riskScore: 15 },
            { id: '2', provider: 'Ledger', address: 'bc1q...8z4k', chain: 'BTC', assetCount: 1, riskScore: 5 },
        ];
    },

    calculateTax: async (form: TaxFormType): Promise<TaxReturn> => {
        await delay(1000);
        return {
            id: 'tax_123', year: 2023, type: form, income: 150000, taxDue: 18500, status: TaxStatus.CALCULATED,
            breakdown: {
                revenue: 200000, costs: 50000, income: 150000, taxBase: 145000, taxFreeAmount: 3600, taxRate: 0.12, healthInsurance: 13500, taxDue: 18500,
                zus: { socialTotal: 1600, healthInsurance: 450, laborFund: 0, totalDue: 2050, deductibleFromTaxBase: 1600, deductibleFromTax: 0 },
                details: { thresholdExceeded: true, firstBracketAmount: 120000, secondBracketAmount: 25000 }
            }
        };
    },

    explainTaxWithAI: async (breakdown: any): Promise<string> => {
        await delay(1500);
        return "Na podstawie analizy Twoich przychodów (200k) i kosztów (50k), dochód wynosi 150k PLN. Przekroczyłeś pierwszy próg podatkowy (120k), co oznacza, że nadwyżka 30k jest opodatkowana stawką 32%. Twoja efektywna stawka podatkowa to ok. 14%. Zastosowano ulgę dla klasy średniej (jeśli dotyczy) oraz odliczono składki społeczne.";
    },

    signDocument: async (id: string): Promise<void> => {
        await delay(1000);
    },

    submitToMF: async (id: string): Promise<string> => {
        await delay(1500);
        return "UPO_2023_ABC123XYZ";
    },

    processPayment: async (amount: number, method: string): Promise<void> => {
        await delay(1000);
    },

    trackEvent: (name: string, data: any) => {
        console.log('Analytics:', name, data);
    },

    fetchHistory: async (): Promise<TaxReturn[]> => {
        await delay(500);
        return [
            { id: 'tax_2022', year: 2022, type: TaxFormType.PIT_36, income: 120000, taxDue: 14000, status: TaxStatus.PAID, submissionDate: '2023-04-20', upoId: 'UPO_22_OLD' },
            { id: 'tax_2021', year: 2021, type: TaxFormType.PIT_36, income: 90000, taxDue: 8500, status: TaxStatus.PAID, submissionDate: '2022-04-25', upoId: 'UPO_21_OLD' },
        ];
    },

    fetchInvoices: async (): Promise<Invoice[]> => {
        await delay(500);
        return [
            { id: '1', ksefNumber: '1234567890-20231025-ABCD-12', contractor: 'Google Ireland Ltd', nip: 'IE6388047V', date: '2023-10-25', amountNet: 100, amountVat: 0, amountGross: 100, type: 'PURCHASE', status: 'PROCESSED', currency: 'EUR', costCategory: CostCategory.OPERATIONAL_100, aiAuditScore: 98, docuSignStatus: 'NONE' },
            { id: '2', ksefNumber: 'PL9876543210-20231024-XYZ-01', contractor: 'Client X Sp. z o.o.', nip: '5252341234', date: '2023-10-24', amountNet: 5000, amountVat: 1150, amountGross: 6150, type: 'SALES', status: 'PROCESSED', currency: 'PLN', aiAuditScore: 100, docuSignStatus: 'SIGNED' },
        ];
    },

    fetchRecurringInvoices: async (): Promise<RecurringInvoice[]> => {
        await delay(500);
        return [
            { id: 'rec_1', templateName: 'Obsługa IT - Stała', contractor: { id: 'c1', name: 'Client X', nip: '5252341234', totalSales: 0, totalPurchases: 0, invoiceCount: 0, lastInteraction: '', isNuffiUser: false, risk: { whiteListStatus: 'VERIFIED', dependency: 'LOW' } }, frequency: 'MONTHLY', nextIssueDate: '2023-11-01', amountNet: 5000, active: true }
        ];
    },

    getSmartRecurringSuggestions: async (): Promise<RecurringSuggestion[]> => {
        await delay(500);
        return [
            { contractorName: 'Client Y Sp. z o.o.', nip: '1234567890', detectedFrequency: 'MONTHLY', confidence: 95, potentialSavingsTime: '15 min/msc' }
        ];
    },

    updateInvoiceCategory: async (id: string, category: CostCategory): Promise<void> => {
        await delay(300);
    },

    uploadDocument: async (file: File): Promise<Invoice> => {
        await delay(1500);
        return {
            id: `ocr_${Date.now()}`,
            ksefNumber: 'N/A',
            contractor: 'OCR Detected Ltd',
            nip: '0000000000',
            date: new Date().toISOString().split('T')[0],
            amountNet: 1000,
            amountVat: 230,
            amountGross: 1230,
            type: 'PURCHASE',
            status: 'DRAFT_XML',
            currency: 'PLN',
            aiAuditScore: 85,
            aiAuditNotes: 'OCR confidence 85%. Verify VAT rate.'
        };
    },

    bulkUpdateCategory: async (ids: string[], category: CostCategory): Promise<void> => {
        await delay(500);
    },

    fetchNbpTable: async (currency: string, date: string): Promise<NbpTable> => {
        await delay(300);
        return { tableNo: '205/A/NBP/2023', effectiveDate: date, rate: 4.45, currency };
    },

    generateKsefInvoice: async (nip: string, items: InvoiceItem[]): Promise<string> => {
        await delay(1500);
        return "KSEF_ID_GENERATED_" + Date.now();
    },

    runSimulation: async (params: SimulationParams): Promise<SimulationResult> => {
        await delay(800);
        return TaxSimulator.simulateExpense(params);
    },

    fetchAssets: async (): Promise<Asset[]> => {
        await delay(500);
        return [
            { id: 'a1', name: 'MacBook Pro M2', category: AssetCategory.COMPUTER, purchaseDate: '2023-01-15', initialValue: 12000, currentValue: 9600, amortizationRate: 0.30, schedule: [] },
            { id: 'a2', name: 'Samochód Volvo XC60', category: AssetCategory.CAR, purchaseDate: '2022-05-10', initialValue: 240000, currentValue: 180000, amortizationRate: 0.20, schedule: [] },
        ].map(a => ({ ...a, schedule: a.schedule.length === 0 ? [{ year: 2023, month: 1, writeOffAmount: 300, remainingValue: 11700, accumulated: 300 }] : a.schedule }));
    },

    addAsset: async (name: string, category: AssetCategory, value: number, date: string): Promise<void> => {
        await delay(500);
    },

    sendAIChatMessage: async (msg: string, history: any[]): Promise<string> => {
        await delay(1000);
        return "To jest przykładowa odpowiedź od Gemini AI na Twoje pytanie o podatki. W pełnej wersji model przeanalizuje kontekst Twojej firmy.";
    },

    fetchContractors: async (): Promise<Contractor[]> => {
        await delay(500);
        return [
            { id: 'c1', name: 'Design Studio Creative', nip: '5213214567', totalSales: 5535, totalPurchases: 0, invoiceCount: 5, lastInteraction: '2023-10-20', isNuffiUser: true, risk: { whiteListStatus: 'VERIFIED', dependency: 'LOW' } },
            { id: 'c2', name: 'Hosting Solutions Sp. z o.o.', nip: '1231231234', totalSales: 0, totalPurchases: 123, invoiceCount: 12, lastInteraction: '2023-10-01', isNuffiUser: false, risk: { whiteListStatus: 'UNKNOWN', dependency: 'HIGH' } },
        ];
    },

    verifyWhiteList: async (nip: string, iban: string): Promise<WhiteListStatus> => {
        await delay(1000);
        return { status: 'VALID', requestId: 'WL-123456' };
    },

    fetchFinancialReport: async (period: string): Promise<FinancialReport> => {
        await delay(800);
        return {
            period,
            lines: [
                { label: 'Przychody netto ze sprzedaży', value: 150000, type: 'REVENUE', indent: 0, isBold: true },
                { label: 'Koszty działalności operacyjnej', value: -85000, type: 'COST', indent: 0, isBold: true },
                { label: 'Amortyzacja', value: -5000, type: 'COST', indent: 1 },
                { label: 'Zużycie materiałów i energii', value: -12000, type: 'COST', indent: 1 },
                { label: 'Usługi obce', value: -45000, type: 'COST', indent: 1 },
                { label: 'Wynagrodzenia', value: -23000, type: 'COST', indent: 1 },
                { label: 'Zysk (strata) ze sprzedaży', value: 65000, type: 'PROFIT', indent: 0, isBold: true, highlight: true },
                { label: 'EBITDA', value: 70000, type: 'PROFIT', indent: 0, isBold: true },
                { label: 'Podatek dochodowy', value: -12350, type: 'TAX', indent: 0 },
                { label: 'Zysk Netto', value: 52650, type: 'PROFIT', indent: 0, isBold: true, highlight: true },
            ]
        };
    },

    fetchFiscalCalendar: async (): Promise<CalendarEvent[]> => {
        await delay(500);
        return [
            { id: 'e1', date: '2023-11-20', title: 'Podatek PIT-5 (Zaliczka)', amount: 2450, type: 'PIT', status: 'PENDING' },
            { id: 'e2', date: '2023-11-25', title: 'VAT-7 (Październik)', amount: 4800, type: 'VAT', status: 'PENDING' },
            { id: 'e3', date: '2023-11-15', title: 'ZUS (Składki)', amount: 1600.32, type: 'ZUS', status: 'PAID' },
        ];
    },

    generateExport: async (format: ExportFormat, period: string): Promise<void> => {
        await delay(2000);
    },

    sendPackageToAccountant: async (email: string): Promise<void> => {
        await delay(1500);
    },

    fetchCryptoTransactions: async (): Promise<CryptoTransaction[]> => {
        await delay(800);
        return [
            { id: 'tx1', exchange: CryptoExchange.MEXC, timestamp: '2023-10-25T14:30:00Z', type: CryptoTransactionType.SPOT_BUY, pair: 'BTC/USDT', amount: 0.1, price: 34000, totalFiat: 14280, feeFiat: 14 },
            { id: 'tx2', exchange: CryptoExchange.BYBIT, timestamp: '2023-10-24T10:15:00Z', type: CryptoTransactionType.FUTURES_PNL, pair: 'ETHUSDT', amount: 0, price: 0, totalFiat: 0, feeFiat: 5, realizedPnL: 450 },
        ];
    },

    fetchDeFiProtocols: async (): Promise<DeFiProtocol[]> => {
        await delay(800);
        return [
            { name: 'Aave V3', chain: 'Ethereum', type: 'LENDING', tvl: 5000000000, userBalanceUsd: 12500, unclaimedRewardsUsd: 45 },
            { name: 'Uniswap V3', chain: 'Arbitrum', type: 'DEX', tvl: 3000000000, userBalanceUsd: 5400, unclaimedRewardsUsd: 0 },
            { name: 'Curve', chain: 'Ethereum', type: 'YIELD', tvl: 2500000000, userBalanceUsd: 8900, unclaimedRewardsUsd: 120 },
        ];
    },

    fetchGoldRushData: async (address: string): Promise<GoldRushTx[]> => {
        await delay(800);
        return [];
    },

    fetchNFTs: async (): Promise<NFTAsset[]> => {
        await delay(800);
        return [
            { id: 'nft1', collection: 'Bored Ape Yacht Club', tokenId: '1234', name: 'BAYC #1234', imageUrl: 'https://via.placeholder.com/150', floorPrice: 30.5, purchasePrice: 25.0, gasFee: 0.05, purchaseDate: '2022-05-01', status: 'HELD' },
            { id: 'nft2', collection: 'Azuki', tokenId: '555', name: 'Azuki #555', imageUrl: 'https://via.placeholder.com/150', floorPrice: 5.2, purchasePrice: 12.5, gasFee: 0.08, purchaseDate: '2022-01-10', status: 'SOLD', soldPrice: 6.0, realizedPnL: -6.58 },
        ];
    },

    getExchangeConnectionStatus: async (): Promise<Record<string, boolean>> => {
        await delay(300);
        return { [CryptoExchange.MEXC]: true, [CryptoExchange.BYBIT]: true, [CryptoExchange.BINANCE]: false };
    },

    fetchDirectDebits: async (): Promise<DirectDebitMandate[]> => {
        await delay(500);
        return [];
    },

    fetchFinancialHealth: async (): Promise<FinancialHealthScore> => {
        await delay(800);
        return { score: 850, riskLevel: 'LOW', affordabilityRating: 'EXCELLENT', monthlyDisposableIncome: 12500, debtToIncomeRatio: 0.15 };
    },

    executeTransfer: async (req: TransferRequest): Promise<void> => {
        await delay(1500);
    },

    executeBulkPayment: async (recipients: string[], totalAmount: number): Promise<BulkPaymentBatch> => {
        await delay(2000);
        return { id: 'batch_123', totalAmount, count: recipients.length, status: 'AUTHORIZED' };
    },

    setupVrp: async (config: VrpConfig): Promise<void> => {
        await delay(1000);
    },

    verifyAccountOwnership: async (iban: string, name: string): Promise<AccountVerification> => {
        await delay(1500);
        return { matchStatus: 'MATCH', confidenceScore: 98 };
    },

    login: async (e: string, p: string): Promise<{ token: string, plan: SubscriptionPlan, user: UserProfile }> => {
        await delay(1000);
        return {
            token: 'mock_token',
            plan: SubscriptionPlan.PRO,
            user: {
                firstName: 'Jan', lastName: 'Kowalski', email: e, nip: '5213214567', pesel: '85010112345',
                taxOfficeCode: '1435', taxationForm: TaxationForm.GENERAL_SCALE, cryptoStrategy: 'FIFO',
                kycStatus: 'VERIFIED', companyName: 'Jan Kowalski IT Services', companyAddress: 'Prosta 20, 00-850 Warszawa'
            }
        };
    },

    verifyNftAccess: async (wallet: string): Promise<boolean> => {
        await delay(1000);
        return true;
    },

    fetchGusData: async (nip: string): Promise<GusData | null> => {
        await delay(1500);
        return {
            name: 'Jan Kowalski IT Services',
            address: 'Prosta 20, 00-850 Warszawa',
            street: 'Prosta', propertyNumber: '20', city: 'Warszawa', zipCode: '00-850',
            nip, regon: '142345678', startDate: '2015-05-01',
            pkd: '62.01.Z', pkdDesc: 'Działalność związana z oprogramowaniem',
            vatStatus: 'ACTIVE', legalForm: 'JDG', history: []
        };
    },

    register: async (nip: string, email: string): Promise<void> => {
        await delay(2000);
    },

    createStripeCheckout: async (plan: SubscriptionPlan): Promise<string> => {
        await delay(1000);
        return 'https://checkout.stripe.com/mock';
    },

    searchGlobal: async (q: string): Promise<SearchResult[]> => {
        await delay(300);
        return [
            { id: '1', type: 'INVOICE', title: 'Faktura FV/2023/10/01', subtitle: 'Google Ireland Ltd - 100 EUR', targetView: ViewState.DOCUMENTS },
            { id: '2', type: 'CONTRACTOR', title: 'Design Studio Creative', subtitle: 'NIP: 5213214567', targetView: ViewState.CONTRACTORS },
            { id: '3', type: 'VIEW', title: 'Raporty Finansowe', subtitle: 'Przejdź do sekcji Raporty', targetView: ViewState.REPORTS },
        ];
    },

    fetchNotifications: async (): Promise<Notification[]> => {
        // await delay(200); // Fast
        return [
            { id: '1', type: 'INFO', title: 'Nowa Faktura', message: 'Otrzymano nową fakturę od Google.', read: false, timestamp: '10 min temu' },
            { id: '2', type: 'WARNING', title: 'Limit Budżetu', message: 'Kategoria Marketing przekroczyła 80%.', read: false, timestamp: '1h temu' },
        ];
    },

    searchCeidgAndWhiteList: async (q: string): Promise<any[]> => { // CeidgCompany[]
        await delay(1000);
        return [
            { name: 'Software House X Sp. z o.o.', nip: '5213000000', regon: '140000000', address: 'Warszawa, Złota 44', status: 'ACTIVE', verifiedIban: 'PL1234...', isNuffiUser: true },
            { name: 'Janusz Budowlany', nip: '1234567890', regon: '987654321', address: 'Kraków, Rynek 1', status: 'ACTIVE', verifiedIban: '', isNuffiUser: false },
        ];
    },

    fetchExchangeRates: async (): Promise<ExchangeRate[]> => {
        // await delay(200);
        const base = [
            { pair: 'EUR/PLN', mid: 4.45, bid: 4.42, ask: 4.48, changePercent: 0.15 },
            { pair: 'USD/PLN', mid: 4.20, bid: 4.18, ask: 4.22, changePercent: -0.05 },
            { pair: 'CHF/PLN', mid: 4.65, bid: 4.62, ask: 4.68, changePercent: 0.25 },
            { pair: 'GBP/PLN', mid: 5.15, bid: 5.12, ask: 5.18, changePercent: 0.02 },
        ];
        return base.map(r => ({ ...r, timestamp: new Date().toISOString() }));
    },

    fetchFxPositions: async (): Promise<FxPosition[]> => {
        await delay(500);
        return [
            { id: 'fx1', pair: 'EUR/PLN', type: 'LONG', amount: 10000, avgRate: 4.40, valuePln: 44500, unrealizedPnL: 500 },
            { id: 'fx2', pair: 'USD/PLN', type: 'SHORT', amount: 5000, avgRate: 4.25, valuePln: 21000, unrealizedPnL: 250 },
        ];
    },

    fetchLedgerEntries: async (): Promise<LedgerEntry[]> => {
        await delay(500);
        return [
            { id: 'l1', date: '2023-10-25', provider: 'mBank', amount: 12500, currency: 'PLN', status: 'POSTED', direction: 'CREDIT', metadata: { type: 'INCOMING_WIRE' } },
            { id: 'l2', date: '2023-10-25', provider: 'Stripe', amount: 450, currency: 'USD', status: 'POSTED', direction: 'CREDIT', metadata: { type: 'CARD_PAYMENT' } },
        ];
    },

    executeFxSwap: async (pair: string, amount: number, side: string): Promise<void> => {
        await delay(1500);
    },

    fetchProjects: async (): Promise<Project[]> => {
        await delay(500);
        return [
            { id: 'p1', name: 'Website Redesign', client: 'Client A', status: 'ACTIVE', budget: 50000, spent: 12500, revenue: 25000, startDate: '2023-09-01', tags: ['Web', 'Design'], profitMargin: 0.5 },
            { id: 'p2', name: 'Mobile App MVP', client: 'Startup B', status: 'ACTIVE', budget: 80000, spent: 75000, revenue: 85000, startDate: '2023-06-01', tags: ['Mobile', 'React Native'], profitMargin: 0.12 },
        ];
    },

    fetchVirtualCards: async (): Promise<VirtualCard[]> => {
        await delay(500);
        return [
            { id: 'c1', last4: '4242', holderName: 'Jan Kowalski', expiry: '12/25', type: 'VIRTUAL', status: 'ACTIVE', limitMonthly: 5000, spentMonthly: 1250, brand: 'VISA', color: 'bg-gradient-to-r from-purple-500 to-indigo-600' },
            { id: 'c2', last4: '8888', holderName: 'Marketing Team', expiry: '11/24', type: 'VIRTUAL', status: 'ACTIVE', limitMonthly: 10000, spentMonthly: 8500, brand: 'MASTERCARD', color: 'bg-gradient-to-r from-orange-400 to-rose-500' },
        ];
    },

    toggleCardFreeze: async (id: string, freeze: boolean): Promise<void> => {
        await delay(500);
    },

    fetchEmployees: async (): Promise<Employee[]> => {
        await delay(500);
        return [
            { id: 'e1', firstName: 'Adam', lastName: 'Nowak', position: 'Senior Developer', salaryAmount: 15000, contractType: 'B2B', status: 'ACTIVE', joinDate: '2022-01-01' },
            { id: 'e2', firstName: 'Ewa', lastName: 'Kowalska', position: 'Office Manager', salaryAmount: 6000, contractType: 'UOP', status: 'ACTIVE', joinDate: '2023-03-01' },
        ];
    },

    runPayroll: async (period: string): Promise<PayrollEntry[]> => {
        await delay(2000);
        return [
            { employeeId: 'e1', employeeName: 'Adam Nowak', contractType: 'B2B', salaryGross: 15000, employerCostTotal: 15000, salaryNet: 15000, zusEmployer: 0, zusEmployee: 0, healthInsurance: 0, pitAdvance: 0 },
            { employeeId: 'e2', employeeName: 'Ewa Kowalska', contractType: 'UOP', salaryGross: 6000, employerCostTotal: 7228.80, salaryNet: 4350.25, zusEmployer: 1228.80, zusEmployee: 822.60, healthInsurance: 466.00, pitAdvance: 361.00 },
        ];
    },

    fetchInventory: async (): Promise<Product[]> => {
        await delay(500);
        return [
            { id: 'prod1', sku: 'SKU-001', name: 'Laptop Dell XPS 15', category: 'Elektronika', quantity: 5, unit: 'szt.', priceNet: 8500, priceSell: 10500, vatRate: 0.23, minLevel: 3, lastMoved: '2023-10-20' },
            { id: 'prod2', sku: 'SKU-002', name: 'Monitor LG 27"', category: 'Elektronika', quantity: 12, unit: 'szt.', priceNet: 1200, priceSell: 1600, vatRate: 0.23, minLevel: 10, lastMoved: '2023-10-22' },
        ];
    },

    fetchWarehouseDocuments: async (): Promise<WarehouseDocument[]> => {
        await delay(500);
        return [
            { id: 'd1', number: 'PZ/2023/10/01', date: '2023-10-01', type: 'PZ', contractorName: 'Dell Polska', totalValueNet: 42500 },
            { id: 'd2', number: 'WZ/2023/10/05', date: '2023-10-05', type: 'WZ', contractorName: 'Klient Detaliczny', totalValueNet: 1200 },
        ];
    },

    fetchVehicles: async (): Promise<Vehicle[]> => {
        await delay(500);
        return [
            { id: 'v1', name: 'Volvo XC60', licensePlate: 'WA 12345', type: 'CAR', vatDeduction: 'MIXED_50', mileageCurrent: 45200, insuranceExpiry: '2024-05-10', inspectionExpiry: '2024-05-10' },
            { id: 'v2', name: 'Ford Transit', licensePlate: 'WA 98765', type: 'TRUCK', vatDeduction: 'FULL_100', mileageCurrent: 120500, insuranceExpiry: '2024-02-15', inspectionExpiry: '2024-02-15' },
        ];
    },

    fetchEcommerceOrders: async (): Promise<Order[]> => {
        await delay(800);
        return [
            { id: 'o1', platformId: 'allegro', platformOrderId: 'ALL-123456', date: '2023-10-25 10:30', customer: 'Janusz Nosacz', totalGross: 150.00, commissionFee: 12.50, status: 'SHIPPED', fiscalized: true },
            { id: 'o2', platformId: 'shopify', platformOrderId: '#1024', date: '2023-10-25 11:15', customer: 'Anna Nowak', totalGross: 320.00, commissionFee: 6.40, status: 'PAID', fiscalized: false },
        ];
    },

    fetchOssData: async (): Promise<OssTransaction[]> => {
        await delay(500);
        return [
            { id: 'oss1', date: '2023-10-20', countryCode: 'DE', amountEur: 120, source: 'SHOPIFY', vatRate: 0.19, vatAmountEur: 22.8 },
            { id: 'oss2', date: '2023-10-21', countryCode: 'FR', amountEur: 85, source: 'ALLEGRO', vatRate: 0.20, vatAmountEur: 17.0 },
        ];
    },

    calculateOssTax: async (): Promise<OssCountryReport[]> => {
        await delay(500);
        return [
            { countryCode: 'DE', countryName: 'Niemcy', standardRate: 0.19, totalNetEur: 1200, totalVatEur: 228 },
            { countryCode: 'FR', countryName: 'Francja', standardRate: 0.20, totalNetEur: 850, totalVatEur: 170 },
        ];
    },

    fetchIntrastatStatus: async (): Promise<IntrastatThreshold[]> => {
        await delay(500);
        return [
            { type: 'IMPORT', limit: 2000000, currentValue: 450000, status: 'SAFE' },
            { type: 'EXPORT', limit: 2000000, currentValue: 1800000, status: 'WARNING' },
        ];
    },

    generateDefensePackage: async (year: number): Promise<AuditPackage> => {
        await delay(3000);
        return { id: 'pkg_' + year, hash: 'sha256-abc123def456', status: 'READY' };
    },

    fetchIndustryStats: async (): Promise<IndustryStat[]> => {
        await delay(500);
        return [
            { sector: 'IT Services', avgRevenue: 45000, avgCost: 12000 },
            { sector: 'E-commerce', avgRevenue: 85000, avgCost: 65000 },
            { sector: 'Construction', avgRevenue: 120000, avgCost: 95000 },
        ];
    },

    fetchMacroIndicators: async (): Promise<MacroIndicator[]> => {
        await delay(500);
        return [
            { name: 'PKB (GDP)', value: 1.5, unit: '% r/r', trend: 'UP', date: 'Q3 2023' },
            { name: 'Inflacja (CPI)', value: 8.2, unit: '% r/r', trend: 'DOWN', date: 'Sep 2023' },
            { name: 'Stopa Bezrobocia', value: 5.0, unit: '%', trend: 'STABLE', date: 'Sep 2023' },
            { name: 'WIBOR 3M', value: 5.85, unit: '%', trend: 'DOWN', date: 'Oct 2023' },
        ];
    },

    fetchGovTechData: async (): Promise<any> => {
        await delay(500);
        return { smupRequests: 1240, dbwKbArticles: 8500, sdpTaxStatus: 'Online' };
    },

    fetchEsgData: async (): Promise<EsgScore> => {
        await delay(800);
        return {
            totalCo2Tons: 12.5,
            breakdown: { transport: 6.5, energy: 4.0, servers: 1.5, other: 0.5 },
            treesNeeded: 625,
            trend: 'DOWN'
        };
    },

    fetchContracts: async (): Promise<Contract[]> => {
        await delay(600);
        return [
            { id: 'c1', name: 'Umowa B2B - Google', party: 'Google Ireland', type: 'B2B', startDate: '2022-01-01', value: 15000, currency: 'EUR', status: 'ACTIVE', noticePeriod: '1 miesiąc', autoRenewal: true, tags: ['IT', 'Service'] },
            { id: 'c2', name: 'Najem Biura', party: 'WeWork', type: 'LEASE', startDate: '2023-01-01', endDate: '2023-12-31', value: 2500, currency: 'PLN', status: 'EXPIRING', noticePeriod: '3 miesiące', autoRenewal: false, tags: ['Office'] },
        ];
    },

    fetchMarketplaceItems: async (): Promise<MarketplaceItem[]> => {
        await delay(600);
        return [
            { id: 'm1', category: 'FINANCE', title: 'Faktoring Szybki', provider: 'Faktoria', description: 'Finansowanie faktur w 15 minut.', price: '1.5%', icon: 'Banknote', recommended: true },
            { id: 'm2', category: 'INSURANCE', title: 'OC Zawodowe IT', provider: 'PZU', description: 'Ochrona przed błędami w kodzie.', price: '500 PLN/rok', icon: 'Shield' },
            { id: 'm3', category: 'SERVICES', title: 'Wirtualne Biuro', provider: 'Biuro24', description: 'Adres w centrum Warszawy + skanowanie poczty.', price: '99 PLN/msc', icon: 'Building' },
        ];
    },

    fetchUserProfile: async (): Promise<UserProfile> => {
        await delay(500);
        return {
            firstName: 'Jan', lastName: 'Kowalski', email: 'demo@nuffi.com', nip: '5213214567', pesel: '85010112345',
            taxOfficeCode: '1435', taxationForm: TaxationForm.GENERAL_SCALE, cryptoStrategy: 'FIFO',
            kycStatus: 'VERIFIED', companyName: 'Jan Kowalski IT Services', companyAddress: 'Prosta 20, 00-850 Warszawa'
        };
    },

    fetchTaxOffices: async (): Promise<TaxOffice[]> => {
        await delay(500);
        return [{ code: '1435', name: 'Urząd Skarbowy Warszawa-Mokotów' }];
    },

    fetchAuditLogs: async (): Promise<AuditEntry[]> => {
        await delay(500);
        return [
            { id: 'log1', action: 'LOGIN', date: '2023-10-26 09:00:00', ip: '192.168.1.1', device: 'Chrome / Mac', status: 'SUCCESS' },
            { id: 'log2', action: 'EXPORT_JPK', date: '2023-10-25 14:30:00', ip: '192.168.1.1', device: 'Chrome / Mac', status: 'SUCCESS' },
        ];
    },

    fetchTeamMembers: async (): Promise<TeamMember[]> => {
        await delay(500);
        return [
            { id: 't1', firstName: 'Anna', lastName: 'Księgowa', email: 'anna@kancelaria.pl', role: 'ACCOUNTANT', status: 'ACTIVE', lastActive: '2023-10-26 10:00' },
            { id: 't2', firstName: 'Piotr', lastName: 'Analityk', email: 'piotr@firma.pl', role: 'ANALYST', status: 'PENDING', lastActive: '-' },
        ];
    },

    fetchApiVaultStatus: async (): Promise<ApiVaultStatus[]> => {
        await delay(500);
        return [
            { provider: ApiProvider.SALT_EDGE, isConnected: true, lastChecked: '2023-10-26', featuresUnlocked: ['Banking', 'Transactions'] },
            { provider: ApiProvider.COINAPI, isConnected: false, lastChecked: '-', featuresUnlocked: [] },
        ];
    },

    updateUserProfile: async (profile: UserProfile): Promise<void> => {
        await delay(1000);
    },

    inviteTeamMember: async (email: string, role: string): Promise<void> => {
        await delay(1000);
    },

    saveExchangeKeys: async (exchange: string, key: string, secret: string): Promise<void> => {
        await delay(1000);
    },

    disconnectExchange: async (exchange: string): Promise<void> => {
        await delay(500);
    },

    getTaxEngineStatus: async (): Promise<TaxEngineStatus> => {
        await delay(300);
        return { status: 'ONLINE', lastSync: new Date().toISOString(), transactionsProcessed: 12500, processingSpeed: 450, uptime: 99.98 };
    },

    updateTaxEngineConfig: async (config: TaxEngineConfig): Promise<void> => {
        await delay(1000);
    },

    fetchForensics: async (): Promise<ForensicsSummary> => {
        await delay(1500);
        return {
            totalIssues: 2,
            riskScore: 35,
            issues: [
                { id: 'i1', type: 'WASH_SALE', severity: 'MEDIUM', description: 'Sprzedaż i odkupienie BTC w ciągu 30 dni.', affectedAssets: ['BTC'], confidence: 0.95, date: '2023-09-15' },
                { id: 'i2', type: 'MISSING_COST_BASIS', severity: 'HIGH', description: 'Brak ceny nabycia dla 1000 USDT (Deposit).', affectedAssets: ['USDT'], confidence: 1.0, date: '2023-08-20' },
            ],
            confidenceDistribution: { high: 85, medium: 10, low: 5 }
        };
    },

    fetchTaxPredictions: async (): Promise<TaxPrediction[]> => {
        await delay(1000);
        return [
            { month: 'Aug', estimatedRevenue: 42000, estimatedCost: 12000, estimatedTax: 5700, type: 'ACTUAL' },
            { month: 'Sep', estimatedRevenue: 45000, estimatedCost: 15000, estimatedTax: 5700, type: 'ACTUAL' },
            { month: 'Oct', estimatedRevenue: 48000, estimatedCost: 14000, estimatedTax: 6460, type: 'ACTUAL' },
            { month: 'Nov', estimatedRevenue: 52000, estimatedCost: 16000, estimatedTax: 6840, type: 'PREDICTED' },
            { month: 'Dec', estimatedRevenue: 58000, estimatedCost: 20000, estimatedTax: 7220, type: 'PREDICTED' },
            { month: 'Jan', estimatedRevenue: 50000, estimatedCost: 15000, estimatedTax: 6650, type: 'PREDICTED' },
        ];
    },

    fetchLegislativeAlerts: async (): Promise<LegislativeAlert[]> => {
        await delay(500);
        return [
            { id: 'leg1', title: 'Zmiana stawek ryczałtu dla IT', impact: 'HIGH', description: 'Projekt ustawy zakłada podniesienie stawki z 12% na 15% dla programistów od 2024.', effectiveDate: '2024-01-01', source: 'sejm.gov.pl' },
            { id: 'leg2', title: 'KSeF obowiązkowy przesunięty', impact: 'MEDIUM', description: 'Obowiązek KSeF dla wszystkich podatników przesunięty na lipiec 2024.', effectiveDate: '2024-07-01', source: 'mf.gov.pl' },
        ];
    },

    fetchLoans: async (): Promise<Loan[]> => {
        await delay(500);
        return [
            { id: 'l1', name: 'Leasing Volvo', type: 'LEASING', bank: 'PKO Leasing', totalAmount: 240000, remainingAmount: 180000, nextInstallmentDate: '2023-11-10', nextInstallmentAmount: 3500, interestRate: 108, currency: 'PLN', endDate: '2027-05-10' },
            { id: 'l2', name: 'Kredyt Obrotowy', type: 'CASH_LOAN', bank: 'mBank', totalAmount: 50000, remainingAmount: 12000, nextInstallmentDate: '2023-11-05', nextInstallmentAmount: 2100, interestRate: 8.5, currency: 'PLN', endDate: '2024-04-05' },
        ];
    },

    fetchCountryTaxRules: async (): Promise<CountryTaxProfile[]> => {
        await delay(500);
        return [
            { countryCode: 'DE', name: 'Niemcy', flag: '🇩🇪', taxRateCorporate: 15, taxRatePersonal: [14, 42, 45], hasDttWithPl: true, dttMethod: 'EXEMPTION_WITH_PROGRESSION' },
            { countryCode: 'UK', name: 'Wielka Brytania', flag: '🇬🇧', taxRateCorporate: 25, taxRatePersonal: [20, 40, 45], hasDttWithPl: true, dttMethod: 'PROPORTIONAL_DEDUCTION' },
            { countryCode: 'US', name: 'Stany Zjednoczone', flag: '🇺🇸', taxRateCorporate: 21, taxRatePersonal: [10, 37], hasDttWithPl: true, dttMethod: 'PROPORTIONAL_DEDUCTION' },
        ];
    },

    calculateCrossBorderTax: async (incomes: ForeignIncome[]): Promise<CrossBorderResult> => {
        await delay(1000);
        return {
            plTaxBase: 0,
            foreignTaxBasePln: 220000,
            plTaxDue: 41800, // Theoretical
            foreignTaxPaidPln: 52000,
            effectiveRate: 0.236,
            taxCreditUsed: 41800,
            additionalPaymentPl: 0,
            methodUsed: 'Unikanie z Progresją (Domyślne)'
        };
    },

    fetchTaxOptimizationOpportunities: async (): Promise<TaxOptimizationOpportunity[]> => {
        await delay(800);
        return [
            { id: 'opt1', asset: 'TSLA', currentPrice: 210, purchasePrice: 250, unrealizedLoss: 4000, quantity: 100, type: 'STOCK', strategy: 'HARVEST_LOSS', potentialTaxSavings: 760 },
            { id: 'opt2', asset: 'SOL', currentPrice: 32, purchasePrice: 140, unrealizedLoss: 10800, quantity: 100, type: 'CRYPTO', strategy: 'WASH_SALE_AVOIDANCE', potentialTaxSavings: 2052 },
        ];
    },

    fetchDividends: async (): Promise<Dividend[]> => {
        await delay(600);
        return [
            { id: 'div1', ticker: 'MSFT', companyName: 'Microsoft Corp', paymentDate: '2023-09-14', amountGross: 150, currency: 'USD', whtRate: 0.15, taxPaidForeign: 22.5, taxDuePl: 6.0, status: 'RECEIVED', country: 'US' },
            { id: 'div2', ticker: 'KO', companyName: 'Coca-Cola', paymentDate: '2023-10-02', amountGross: 80, currency: 'USD', whtRate: 0.15, taxPaidForeign: 12, taxDuePl: 3.2, status: 'RECEIVED', country: 'US' },
        ];
    },

    fetchUnifiedLedger: async (): Promise<UnifiedLedgerItem[]> => {
        await delay(800);
        return [
            { id: 'ul1', date: '2023-10-25', source: 'BANK', provider: 'mBank', description: 'Opłata za serwer', amountPln: 450, direction: 'OUTGOING', taxCategory: 'COST', reconciled: true, tags: ['IT', 'Infra'] },
            { id: 'ul2', date: '2023-10-24', source: 'INVOICE', provider: 'KSeF', description: 'Sprzedaż usług programistycznych', amountPln: 15000, direction: 'INCOMING', taxCategory: 'REVENUE', reconciled: false, tags: ['B2B'] },
            { id: 'ul3', date: '2023-10-23', source: 'CRYPTO', provider: 'Binance', description: 'Zakup USDT', amountPln: 5000, direction: 'OUTGOING', taxCategory: 'NEUTRAL', reconciled: true, tags: ['Investment'] },
        ];
    },

    fetchClients: async (): Promise<ClientProfile[]> => {
        await delay(500);
        return [
            { id: 'cl1', name: 'Software House X Sp. z o.o.', nip: '5213000000', status: 'ACTIVE', documentsToProcess: 5, vatStatus: 'OK', pitStatus: 'DUE', lastActivity: '2023-10-26', monthProgress: 80 },
            { id: 'cl2', name: 'Janusz Budowlany JDG', nip: '1234567890', status: 'ACTIVE', documentsToProcess: 12, vatStatus: 'OVERDUE', pitStatus: 'OK', lastActivity: '2023-10-10', monthProgress: 20 },
        ];
    },

    sendClientReminder: async (clientId: string, type: string): Promise<void> => {
        await delay(1000);
    },

    fetchUnclassifiedTransactions: async (): Promise<UnclassifiedTransaction[]> => {
        await delay(500);
        return [
            { id: 'ut1', date: '2023-10-26', description: 'UBER *TRIP 2842', amount: 45.20, currency: 'PLN', confidence: 0.65, aiSuggestion: { category: 'Transport', reasoning: 'Wykryto słowo kluczowe UBER oraz kwotę typową dla przejazdu.' }, source: 'mBank' },
            { id: 'ut2', date: '2023-10-25', description: 'RESTAURACJA POD ZLOTYM', amount: 120.00, currency: 'PLN', confidence: 0.45, aiSuggestion: { category: 'Reprezentacja (NKUP)', reasoning: 'Słowo Restauracja sugeruje gastronomię.' }, source: 'Revolut' },
        ];
    },

    classifyTransaction: async (id: string, category: string): Promise<void> => {
        await delay(500);
    },

    fetchMerchantStats: async (): Promise<MerchantStats> => {
        await delay(500);
        return { totalVolume: 125000, txCount: 450, activeLinks: 12, cryptoVolume: 15000 };
    },

    fetchMerchantTransactions: async (): Promise<MerchantTx[]> => {
        await delay(500);
        return [
            { id: 'mt1', amount: 250, currency: 'PLN', method: 'BLIK', status: 'COMPLETED', customerEmail: 'klient@gmail.com', date: '2023-10-26 12:30', description: 'Zamówienie #1234' },
            { id: 'mt2', amount: 0.05, currency: 'ETH', method: 'CRYPTO', status: 'PENDING', customerEmail: 'crypto@fan.com', date: '2023-10-26 11:15', description: 'NFT Mint' },
        ];
    },

    createPaymentLink: async (amount: number, currency: string, desc: string): Promise<string> => {
        await delay(1000);
        return `https://pay.nuffi.io/${Math.random().toString(36).substring(7)}`;
    },

    fetchAutomationRules: async (): Promise<AutomationRule[]> => {
        await delay(500);
        return [
            { id: 'r1', name: 'Auto-Vat Transfer', trigger: 'Incoming Payment > 1000 PLN', condition: 'ALWAYS', conditionValue: '', action: 'Transfer 23% to VAT Account', active: true, lastTriggered: '2023-10-25' },
            { id: 'r2', name: 'Low Balance Alert', trigger: 'Balance < 1000 PLN', condition: 'ONCE_PER_DAY', conditionValue: '', action: 'Send Push Notification', active: true, lastTriggered: '2023-10-20' },
        ];
    },

    toggleAutomationRule: async (id: string, active: boolean): Promise<void> => {
        await delay(300);
    },

    analyzeImportFile: async (file: File): Promise<ImportJob> => {
        await delay(2000);
        return {
            id: 'job_123', fileName: file.name, totalRows: 150, headers: ['Data', 'Opis operacji', 'Kwota', 'Waluta', 'Nadawca'], preview: [
                ['2023-10-01', 'Przelew przychodzący', '1200.00', 'PLN', 'Klient A'],
                ['2023-10-02', 'Opłata za serwer', '-50.00', 'PLN', 'OVH'],
                ['2023-10-03', 'Paliwo', '-250.00', 'PLN', 'Orlen']
            ]
        };
    },

    getAiMappingSuggestions: async (headers: string[]): Promise<CsvMapping[]> => {
        await delay(1000);
        return [
            { fileHeader: 'Data', systemField: 'DATE', confidence: 0.99 },
            { fileHeader: 'Kwota', systemField: 'AMOUNT', confidence: 0.95 },
            { fileHeader: 'Waluta', systemField: 'CURRENCY', confidence: 0.90 },
            { fileHeader: 'Opis operacji', systemField: 'DESCRIPTION', confidence: 0.85 },
            { fileHeader: 'Nadawca', systemField: 'CONTRACTOR', confidence: 0.70 },
        ];
    },

    submitImport: async (jobId: string, mappings: CsvMapping[]): Promise<void> => {
        await delay(2000);
    },

    fetchRiskProfile: async (): Promise<RiskAssessment> => {
        await delay(1500);
        return {
            globalScore: 78,
            categories: [
                { name: 'Podatki (VAT/CIT)', score: 85, status: 'SAFE', issuesFound: 0 },
                { name: 'Płynność (Cashflow)', score: 65, status: 'WARNING', issuesFound: 2 },
                { name: 'AML / Sankcje', score: 95, status: 'SAFE', issuesFound: 0 },
                { name: 'Cyberbezpieczeństwo', score: 70, status: 'WARNING', issuesFound: 1 },
            ],
            criticalAlerts: ['Niski poziom gotówki na pokrycie ZUS w przyszłym miesiącu.']
        };
    },

    analyzeTxGraph: async (hash: string): Promise<TxAnalysisResult> => {
        await delay(3000);
        return {
            hash,
            timestamp: new Date().toISOString(),
            nodes: [
                { id: 'n1', type: 'WALLET', label: 'User (0x7a...)', x: 100, y: 300, color: '#10B981' },
                { id: 'n2', type: 'CONTRACT', label: 'Uniswap V3 Router', x: 400, y: 300, color: '#3B82F6' },
                { id: 'n3', type: 'POOL', label: 'USDC/ETH Pool', x: 700, y: 300, color: '#8B5CF6' },
                { id: 'n4', type: 'TOKEN', label: 'USDC', x: 700, y: 150, color: '#2775CA' },
                { id: 'n5', type: 'TOKEN', label: 'WETH', x: 700, y: 450, color: '#627EEA' },
            ],
            links: [
                { source: 'n1', target: 'n2', label: 'Call: ExactInputSingle' },
                { source: 'n1', target: 'n2', label: 'Transfer 1000 USDC', color: '#2775CA', dashed: true },
                { source: 'n2', target: 'n3', label: 'Swap' },
                { source: 'n3', target: 'n1', label: 'Transfer 0.5 ETH', color: '#627EEA', dashed: true },
            ],
            taxVerdict: 'TAXABLE_EVENT (SWAP)',
            complexityScore: 65,
            gasUsedEth: 0.0045
        };
    },

    fetchSnapshots: async (): Promise<TaxSnapshot[]> => {
        await delay(500);
        return [
            { id: 's1', name: 'Zamknięcie Wrzesień 2023', createdAt: '2023-10-05 12:00', createdBy: 'System', period: '2023-09', hash: 'sha256-abc...', dataSize: '15 MB', status: 'LOCKED', tags: ['Monthly', 'Auto'] },
            { id: 's2', name: 'Przed korektą VAT', createdAt: '2023-10-15 14:30', createdBy: 'Jan Kowalski', period: '2023-08', hash: 'sha256-xyz...', dataSize: '12 MB', status: 'DRAFT', tags: ['Manual'] },
        ];
    },

    createSnapshot: async (name: string): Promise<void> => {
        await delay(2000);
    },

    fetchTimeEntries: async (): Promise<TimeEntry[]> => {
        await delay(500);
        return [
            { id: 't1', projectId: 'p1', projectName: 'Website Redesign', description: 'Frontend Development - Homepage', startTime: '2023-10-26T09:00:00Z', endTime: '2023-10-26T12:00:00Z', durationSeconds: 10800, billable: true, hourlyRate: 150, status: 'COMPLETED' },
            { id: 't2', projectId: 'p1', projectName: 'Website Redesign', description: 'Meeting with Client', startTime: '2023-10-26T13:00:00Z', endTime: '2023-10-26T14:30:00Z', durationSeconds: 5400, billable: true, hourlyRate: 150, status: 'COMPLETED' },
        ];
    },

    fetchInbox: async (): Promise<EmailMessage[]> => {
        await delay(800);
        return [
            { id: 'e1', sender: 'Google Cloud EMEA', subject: 'Invoice INV-2023-10-001', date: '2023-10-26 08:30', preview: 'Please find attached invoice for October 2023 services...', hasAttachment: true, isRead: false, aiTags: ['INVOICE', 'URGENT'] },
            { id: 'e2', sender: 'Marketing Agency', subject: 'Propozycja współpracy', date: '2023-10-25 15:45', preview: 'Dzień dobry, przesyłam ofertę kampanii reklamowej...', hasAttachment: true, isRead: true, aiTags: ['OFFER'] },
            { id: 'e3', sender: 'Nieznany Nadawca', subject: 'Wygrałeś iPhone!', date: '2023-10-25 10:00', preview: 'Kliknij tutaj aby odebrać nagrodę...', hasAttachment: false, isRead: true, aiTags: ['SPAM'] },
        ];
    },

    scanTokenContract: async (address: string): Promise<TokenSecurity> => {
        await delay(2500);
        return {
            address, name: 'SafeMoon 3.0', symbol: 'SFM3', riskScore: 25, isHoneypot: true, ownershipRenounced: false, liquidityLocked: false,
            issues: [
                { type: 'HONEYPOT', severity: 'HIGH', description: 'Sell tax is 100%. Cannot sell token.' },
                { type: 'OWNERSHIP', severity: 'MEDIUM', description: 'Owner can mint new tokens.' },
                { type: 'LIQUIDITY', severity: 'HIGH', description: 'Liquidity is not locked (Rugpull risk).' }
            ]
        };
    },

    // --- SUBSCRIPTIONS ---
    fetchSubscriptions: async (): Promise<Subscription[]> => {
        await delay(800);
        return [
            { id: 'sub1', name: 'Adobe Creative Cloud', cost: 250, currency: 'PLN', billingCycle: 'MONTHLY', nextPayment: '2023-11-05', status: 'GHOST', logo: 'A', usageScore: 5 },
            { id: 'sub2', name: 'LinkedIn Premium', cost: 180, currency: 'PLN', billingCycle: 'MONTHLY', nextPayment: '2023-11-10', status: 'ACTIVE', logo: 'L', usageScore: 85 },
            { id: 'sub3', name: 'AWS Cloud', cost: 450, currency: 'USD', billingCycle: 'MONTHLY', nextPayment: '2023-11-01', status: 'ACTIVE', logo: 'A', usageScore: 99 },
            { id: 'sub4', name: 'Notion', cost: 10, currency: 'USD', billingCycle: 'MONTHLY', nextPayment: '2023-11-15', status: 'GHOST', logo: 'N', usageScore: 12 }
        ];
    },

    // --- WHALE WATCHER ---
    fetchWhaleWallets: async (): Promise<WhaleWallet[]> => {
        await delay(600);
        return [
            { address: '0x7a...d8', label: 'Alameda (Legacy)', balanceUsd: 12500000, chain: 'ETH', tags: ['VC', 'High Risk'] },
            { address: '0xab...12', label: 'Vitalik Buterin', balanceUsd: 4500000, chain: 'ETH', tags: ['Founder', 'Whale'] },
            { address: '0x99...aa', label: 'Binance Hot Wallet 6', balanceUsd: 250000000, chain: 'ETH', tags: ['Exchange'] }
        ];
    },

    fetchWhaleTransactions: async (): Promise<WhaleTx[]> => {
        await delay(800);
        return [
            { id: 'wtx1', hash: '0x123...abc', timestamp: '2023-10-26T10:30:00Z', fromAddress: '0xUnknown', toAddress: '0xBinance', toLabel: 'Binance', amount: 5000, token: 'ETH', valueUsd: 8500000, type: 'INFLOW' },
            { id: 'wtx2', hash: '0x456...def', timestamp: '2023-10-26T09:15:00Z', fromAddress: '0xAlameda', fromLabel: 'Alameda', toAddress: '0xUniswap', toLabel: 'Uniswap V3', amount: 250000, token: 'USDT', valueUsd: 250000, type: 'TRANSFER' },
            { id: 'wtx3', hash: '0x789...ghi', timestamp: '2023-10-26T08:00:00Z', fromAddress: '0xCoinbase', fromLabel: 'Coinbase', toAddress: '0xWhale1', amount: 120, token: 'BTC', valueUsd: 4100000, type: 'OUTFLOW' }
        ];
    },

    // --- DEBT COLLECTOR ---
    fetchDebtCases: async (): Promise<DebtCase[]> => {
        await delay(800);
        return [
            { id: 'd1', debtorName: 'Niepłacący Klient Sp. z o.o.', nip: '1234567890', invoiceNumber: 'FV/2023/08/15', amount: 15000, dueDate: '2023-09-15', daysOverdue: 45, status: 'REMINDER_SENT', statutoryInterest: 235.50, lastActionDate: '2023-10-20' },
            { id: 'd2', debtorName: 'Jan Kowalski JDG', nip: '9876543210', invoiceNumber: 'FV/2023/09/01', amount: 2500, dueDate: '2023-09-15', daysOverdue: 45, status: 'NEW', statutoryInterest: 35.20 }
        ];
    },

    sendDebtReminder: async (id: string, type: 'EMAIL' | 'SMS' | 'CALL_TO_PAY'): Promise<void> => {
        await delay(1500);
    },

    // --- CAP TABLE ---
    fetchCapTable: async (): Promise<Shareholder[]> => {
        await delay(600);
        return [
            { id: 's1', name: 'Jan Founder', role: 'FOUNDER', shares: 6000, percentage: 60, joinedDate: '2020-01-01' },
            { id: 's2', name: 'Piotr Co-Founder', role: 'FOUNDER', shares: 3000, percentage: 30, joinedDate: '2020-01-01' },
            { id: 's3', name: 'VC Fund One', role: 'INVESTOR', shares: 1000, percentage: 10, investedAmount: 1000000, joinedDate: '2022-05-15' },
        ];
    },

    // --- BUSINESS TRAVEL ---
    fetchBusinessTrips: async (): Promise<BusinessTrip[]> => {
        await delay(600);
        return [
            { id: 't1', employeeName: 'Adam Nowak', destination: 'Berlin', startDate: '2023-10-10', endDate: '2023-10-12', purpose: 'Konferencja Tech', status: 'SETTLED', totalCost: 2450, perDiem: 450, transportCost: 1200, accommodationCost: 800, currency: 'PLN' },
            { id: 't2', employeeName: 'Jan Kowalski', destination: 'Gdańsk', startDate: '2023-10-20', endDate: '2023-10-21', purpose: 'Spotkanie z klientem', status: 'APPROVED', totalCost: 800, perDiem: 90, transportCost: 400, accommodationCost: 310, currency: 'PLN' }
        ];
    },

    // --- CASH REGISTER ---
    fetchCashDocuments: async (): Promise<CashDocument[]> => {
        await delay(600);
        return [
            { id: 'c1', number: 'KP/10/2023/01', date: '2023-10-25', type: 'KP', contractor: 'Klient Detaliczny', description: 'Sprzedaż gotówkowa', amount: 1500, currency: 'PLN', balanceAfter: 5500 },
            { id: 'c2', number: 'KW/10/2023/02', date: '2023-10-26', type: 'KW', contractor: 'Poczta Polska', description: 'Znaczki', amount: 50, currency: 'PLN', balanceAfter: 5450 }
        ];
    },

    // --- DERIVATIVES ---
    fetchDerivatives: async (): Promise<DerivativePosition[]> => {
        await delay(600);
        return [
            { id: 'opt1', symbol: 'SPY', type: 'CALL', side: 'LONG', strike: 450, expiration: '2023-12-15', quantity: 10, avgPrice: 12.50, currentPrice: 15.20, underlyingPrice: 455.50, pnl: 2700, greeks: { delta: 0.65, gamma: 0.02, theta: -0.15, vega: 0.45 } },
            { id: 'opt2', symbol: 'NVDA', type: 'PUT', side: 'LONG', strike: 400, expiration: '2023-11-17', quantity: 5, avgPrice: 8.00, currentPrice: 4.50, underlyingPrice: 420.00, pnl: -1750, greeks: { delta: -0.30, gamma: 0.01, theta: -0.25, vega: 0.30 } }
        ];
    },

    // --- BONDS ---
    fetchBonds: async (): Promise<BondPosition[]> => {
        await delay(600);
        return [
            { id: 'b1', isin: 'PL0000105305', name: 'Skarbowe EDO0530 (10Y)', type: 'TREASURY', faceValue: 100, quantity: 500, couponRate: 7.25, inflationIndexed: true, maturityDate: '2030-05-25', nextCouponDate: '2024-05-25', nextCouponAmount: 3625, yieldToMaturity: 6.8, currentValue: 52500 },
            { id: 'b2', isin: 'PLKGHM000017', name: 'KGHM 2026', type: 'CORPORATE', faceValue: 1000, quantity: 50, couponRate: 8.5, inflationIndexed: false, maturityDate: '2026-06-15', nextCouponDate: '2024-06-15', nextCouponAmount: 4250, yieldToMaturity: 7.9, currentValue: 50800 }
        ];
    },

    // --- DEVELOPER PORTAL ---
    fetchUserApiKeys: async (): Promise<UserApiKey[]> => {
        await delay(500);
        return [
            { id: 'k1', prefix: 'pk_live_...', name: 'Production Key', created: '2023-01-15', lastUsed: '2023-10-26', type: 'LIVE', permissions: ['READ', 'WRITE'] },
            { id: 'k2', prefix: 'sk_test_...', name: 'Test Environment', created: '2023-05-20', lastUsed: '2023-10-25', type: 'TEST', permissions: ['READ', 'WRITE'] }
        ];
    },

    generateUserApiKey: async (name: string, type: 'LIVE' | 'TEST'): Promise<string> => {
        await delay(1000);
        return `${type === 'LIVE' ? 'sk_live_' : 'sk_test_'}${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
    },

    fetchApiUsage: async (): Promise<ApiUsageStats> => {
        await delay(800);
        return {
            totalRequests: 145200,
            errorRate: 0.05,
            avgLatency: 125,
            history: Array.from({length: 30}, (_, i) => ({
                date: `2023-10-${i+1}`,
                requests: Math.floor(Math.random() * 5000 + 1000),
                errors: Math.floor(Math.random() * 50)
            }))
        };
    },

    // --- SYSTEM STATUS ---
    fetchSystemStatus: async (): Promise<SystemStatusData> => {
        await delay(600);
        return {
            globalStatus: 'OPERATIONAL',
            components: [
                { name: 'API Gateway', status: 'OPERATIONAL', uptime: 99.99, description: 'Main REST API' },
                { name: 'Tax Engine (Rust)', status: 'OPERATIONAL', uptime: 99.95, description: 'Calculation Core' },
                { name: 'Banking Integrations', status: 'OPERATIONAL', uptime: 99.80, description: 'Salt Edge / Yapily' },
                { name: 'Blockchain Nodes', status: 'DEGRADED', uptime: 98.50, description: 'ETH Mainnet Latency High' },
                { name: 'KSeF Gateway', status: 'OPERATIONAL', uptime: 99.90, description: 'Ministerstwo Finansów Bridge' }
            ],
            incidents: [
                { 
                    id: 'inc1', title: 'ETH Node Latency', status: 'MONITORING', impact: 'MINOR', 
                    createdAt: '2023-10-26T10:00:00Z', updatedAt: '2023-10-26T10:30:00Z',
                    updates: [{ timestamp: '2023-10-26T10:30:00Z', message: 'Syncing backup nodes. Service is operational but slow.' }]
                }
            ]
        };
    },

    // --- HELP CENTER & N8N AGENT ---
    fetchHelpCategories: async (): Promise<HelpCategory[]> => {
        await delay(300);
        return [
            { id: '1', name: 'Start & Onboarding', description: 'Konfiguracja konta, import danych i pierwsze kroki.', icon: 'Flag' },
            { id: '2', name: 'Kryptowaluty & Web3', description: 'Rozliczanie DeFi, stakingu, NFT i podłączanie giełd.', icon: 'Bitcoin' },
            { id: '3', name: 'Podatki & KSeF', description: 'Generowanie JPK, faktury KSeF, ZUS i PIT.', icon: 'FileText' },
            { id: '4', name: 'Inwestycje & Giełda', description: 'Akcje, ETF, obligacje i dywidendy zagraniczne.', icon: 'TrendingUp' },
            { id: '5', name: 'Operacje & Kadry', description: 'Magazyn, flota, delegacje i lista płac.', icon: 'Briefcase' }
        ];
    },

    fetchHelpArticles: async (categoryId?: string): Promise<HelpArticle[]> => {
        await delay(500);
        const allArticles: HelpArticle[] = [
            // CRYPTO
            { id: 'c1', categoryId: '2', title: 'Jak podłączyć giełdę (API)?', description: 'Instrukcja generowania kluczy Read-Only dla Binance, Bybit i MEXC.', readTime: '3 min', icon: 'Key', content: '1. Zaloguj się na giełdę.\n2. Przejdź do API Management.\n3. Utwórz klucz z uprawnieniami "Read-Only".\n4. Skopiuj Key i Secret do Nuffi w Ustawienia > Giełdy.' },
            { id: 'c2', categoryId: '2', title: 'Rozliczanie Stakingu', description: 'Jak Nuffi klasyfikuje nagrody ze stakingu ETH i DOT.', readTime: '5 min', icon: 'Layers', content: 'Nagrody są traktowane jako przychód w momencie otrzymania (według kursu z dnia wejścia na portfel).' },
            // TAX
            { id: 't1', categoryId: '3', title: 'Wysyłka JPK_V7', description: 'Krok po kroku: Generowanie i podpisywanie pliku XML.', readTime: '4 min', icon: 'FileCode', content: 'Przejdź do Eksport Danych -> Wybierz JPK_V7 -> Generuj. Następnie podpisz Profilem Zaufanym lub Podpisem Kwalifikowanym.' },
            { id: 't2', categoryId: '3', title: 'Konfiguracja KSeF', description: 'Autoryzacja tokenem w systemie Ministerstwa Finansów.', readTime: '6 min', icon: 'ShieldCheck', content: 'Wymagane wygenerowanie tokenu autoryzacyjnego w aplikacji KSeF MF i wklejenie go w ustawieniach Nuffi.' },
            // WEALTH
            { id: 'w1', categoryId: '4', title: 'Import z XTB/Interactive Brokers', description: 'Jak wgrać raporty CSV od brokera.', readTime: '3 min', icon: 'UploadCloud', content: 'Pobierz raport roczny (Activity Statement) w formacie CSV i użyj Import Wizard w Nuffi.' },
            // OPS
            { id: 'o1', categoryId: '5', title: 'Dodawanie pracownika', description: 'Konfiguracja umowy B2B/UoP i naliczanie płac.', readTime: '4 min', icon: 'UserPlus', content: 'Wejdź w Kadry -> Dodaj pracownika. Uzupełnij stawkę brutto i typ umowy. System sam wyliczy ZUS pracodawcy.' },
        ];
        return categoryId ? allArticles.filter(a => a.categoryId === categoryId) : allArticles;
    },

    sendN8nMessage: async (text: string): Promise<string> => {
        // Mocking n8n webhook response
        await delay(2000); // Simulate thinking
        if (text.toLowerCase().includes('podatek') || text.toLowerCase().includes('pit')) {
            return "Na podstawie Twoich danych, estymowany podatek PIT za ten miesiąc to 12,450 PLN. Czy chcesz, abym przygotował symulację optymalizacji?";
        }
        if (text.toLowerCase().includes('faktura') || text.toLowerCase().includes('ksef')) {
            return "Wystawienie faktury w KSeF wymaga podania NIP kontrahenta. Czy chcesz, abym sprawdził go na Białej Liście VAT?";
        }
        return "Jestem Twoim opiekunem AI (n8n). Mogę pomóc Ci w analizie podatkowej, sprawdzaniu kontrahentów lub wyjaśnieniu przepisów. O co chcesz zapytać?";
    }
};
