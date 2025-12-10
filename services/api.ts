import {
    ForensicsSummary, UserProfile, TaxReturn, Invoice, RecurringInvoice, RecurringSuggestion,
    NbpTable, Asset, Contractor, WhiteListStatus, FinancialReport, CalendarEvent, Budget,
    ExportFormat, CryptoTransaction, BankAccount, CryptoWallet, Contract, MarketplaceItem,
    StockAsset, EsgScore, IndustryStat, MacroIndicator, MarketComparison,
    TaxEngineConfig, TaxEngineStatus, TaxPrediction, LegislativeAlert, RealEstateProperty,
    Loan, CountryTaxProfile, ForeignIncome, CrossBorderResult, TaxOptimizationOpportunity,
    Dividend, UnifiedLedgerItem, ClientProfile, UnclassifiedTransaction, MerchantStats, MerchantTx,
    AutomationRule, ImportJob, CsvMapping, RiskAssessment, TxAnalysisResult, TaxSnapshot,
    TimeEntry, EmailMessage, TokenSecurity, Subscription, WhaleWallet, WhaleTx, DebtCase,
    Shareholder, BusinessTrip, CashDocument, DerivativePosition, BondPosition, UserApiKey,
    ApiUsageStats, SystemStatusData, HelpCategory, HelpArticle, SimulationParams, SimulationResult,
    TaxFormType, CostCategory, TaxStatus, TaxationForm, ApiVaultStatus, TeamMember, AuditEntry,
    AuditRiskFactor, AuditPackage, TransferRequest, BulkPaymentBatch, VrpConfig, FinancialHealthScore,
    AccountVerification, Transaction, DirectDebitMandate, OssTransaction, OssCountryReport,
    IntrastatThreshold, TaxBreakdown, CryptoTaxReport, InvoiceItem, CryptoExchange,
    DeFiProtocol, GoldRushTx, NFTAsset, ExchangeRate, FxPosition, LedgerEntry
} from '../types';
import { TaxEngine, TaxSimulator } from '../utils/taxUtils';

// Mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const NuffiService = {
    fetchForensics: async (): Promise<ForensicsSummary> => {
        await delay(1500);
        return {
            totalIssues: 3,
            riskScore: 35,
            issues: [
                { id: 'i1', type: 'WASH_SALE', severity: 'MEDIUM', description: 'Sprzedaż i odkupienie BTC w ciągu 30 dni.', affectedAssets: ['BTC'], confidence: 0.95, date: '2023-09-15' },
                { id: 'i2', type: 'MISSING_COST_BASIS', severity: 'HIGH', description: 'Brak ceny nabycia dla 1000 USDT (Deposit).', affectedAssets: ['USDT'], confidence: 1.0, date: '2023-08-20' },
                { id: 'i3', type: 'PANIC_SELL', severity: 'LOW', description: 'Sprzedaż ETH po spadku -15% w 24h (Potencjalna strata emocjonalna).', affectedAssets: ['ETH'], confidence: 0.85, date: '2023-05-12' },
            ],
            confidenceDistribution: { high: 85, medium: 10, low: 5 },
            dna: {
                fomoScore: 65,
                panicSellRate: 12,
                diamondHandsScore: 40,
                riskTolerance: 'MODERATE',
                topBadHabit: 'Chasing Pumps (Kupowanie na górce)'
            }
        };
    },
    login: async (email: string, pass: string) => { await delay(500); return { token: 'mock-token', plan: 'PRO', user: { firstName: 'Jan', lastName: 'Kowalski', email, companyName: 'Software House SP. Z O.O.', nip: '5213123123', taxationForm: 'FLAT_RATE', kycStatus: 'VERIFIED' } as UserProfile }; },
    register: async (nip: string, email: string) => { await delay(1000); return { status: 'OK' }; },
    fetchUserProfile: async () => ({ firstName: 'Jan', lastName: 'Kowalski', email: 'jan@example.com', nip: '5213123123', pesel: '90010112345', taxOfficeCode: '1431', taxationForm: 'FLAT_RATE', cryptoStrategy: 'FIFO', kycStatus: 'VERIFIED', companyName: 'Software House SP. Z O.O.', companyAddress: 'Prosta 20, 00-850 Warszawa' } as UserProfile),
    updateUserProfile: async (profile: UserProfile) => { await delay(500); return profile; },
    
    fetchRecentTransactions: async () => ([
        { id: 't1', date: '2023-10-25', description: 'Hosting AWS', amount: -150.20, category: 'IT', bankId: 'mbank' },
        { id: 't2', date: '2023-10-24', description: 'Przelew od kontrahenta', amount: 4500.00, category: 'SALES', bankId: 'mbank' },
        { id: 't3', date: '2023-10-23', description: 'Stacja Paliw Orlen', amount: -250.00, category: 'FUEL', bankId: 'mbank' },
    ] as Transaction[]),
    fetchExpensesBreakdown: async () => ([]),
    fetchVatSummary: async () => ({ outputVat: 2500, inputVat: 1200, vatDue: 1300 }),
    fetchCashFlowProjection: async () => ([
        { date: '2023-10', balance: 15000, type: 'ACTUAL' },
        { date: '2023-11', balance: 18000, type: 'PROJECTED' },
        { date: '2023-12', balance: 22000, type: 'PROJECTED' },
        { date: '2024-01', balance: 20000, type: 'PROJECTED' },
    ]),
    fetchBudgets: async () => ([
        { id: 'b1', category: 'Marketing', limit: 2000, spent: 1200, forecast: 1800, status: 'SAFE', percentUsed: 60 },
        { id: 'b2', category: 'IT/Software', limit: 1000, spent: 950, forecast: 1100, status: 'WARNING', percentUsed: 95 },
    ] as Budget[]),
    runAuditRiskAnalysis: async () => ([
        { id: 'r1', category: 'VAT', title: 'Wysokie koszty reprezentacji', description: 'Wykryto faktury za alkohol/gastro.', severity: 'MEDIUM', detected: true },
    ] as AuditRiskFactor[]),
    fetchMarketComparison: async () => ([
        { metric: 'Rentowność', myValue: 25, marketValue: 18, difference: 7, status: 'BETTER' },
        { metric: 'Koszty IT', myValue: 12, marketValue: 8, difference: -4, status: 'WORSE' },
    ] as MarketComparison[]),
    
    fetchRealEstate: async () => ([
        { id: 're1', name: 'Kawalerka Mokotów', type: 'APARTMENT', address: 'Domaniewska 12', purchaseValue: 450000, currentValue: 520000, rentalIncomeMonthly: 3200, occupancyStatus: 'RENTED', taxation: 'LUMP_SUM', roi: 7.2 }
    ] as RealEstateProperty[]),
    fetchStockPortfolio: async () => ([
        { symbol: 'AAPL', name: 'Apple Inc.', type: 'STOCK', quantity: 50, avgPrice: 150, currentPrice: 175, currency: 'USD', valuePln: 35000, pnl: 5000, pnlPercent: 16.6 }
    ] as StockAsset[]),
    
    fetchInvoices: async () => ([
        { id: 'inv1', ksefNumber: '1234567890-20231025-123456-12', contractor: 'Design Studio', nip: '5251234567', date: '2023-10-25', amountNet: 1000, amountVat: 230, amountGross: 1230, type: 'PURCHASE', status: 'PROCESSED', currency: 'PLN', costCategory: 'OPERATIONAL_100', aiAuditScore: 98, aiAuditNotes: 'OK' },
        { id: 'inv2', ksefNumber: '1234567890-20231024-123456-13', contractor: 'Client Corp', nip: '5257654321', date: '2023-10-24', amountNet: 5000, amountVat: 1150, amountGross: 6150, type: 'SALES', status: 'PROCESSED', currency: 'PLN', aiAuditScore: 100 },
    ] as Invoice[]),
    fetchRecurringInvoices: async () => ([
        { id: 'rec1', templateName: 'Stała obsługa IT', contractor: { name: 'Client Corp' } as Contractor, frequency: 'MONTHLY', nextIssueDate: '2023-11-01', amountNet: 5000, active: true }
    ] as RecurringInvoice[]),
    getSmartRecurringSuggestions: async () => ([
        { contractorName: 'Client Corp', nip: '5257654321', detectedFrequency: 'MONTHLY', confidence: 0.95, potentialSavingsTime: '15 min' }
    ] as RecurringSuggestion[]),
    updateInvoiceCategory: async (id: string, cat: string) => { await delay(200); },
    bulkUpdateCategory: async (ids: string[], cat: string) => { await delay(500); },
    uploadDocument: async (file: File) => { await delay(1000); return {} as Invoice; },
    generateKsefInvoice: async (nip: string, items: InvoiceItem[]) => { await delay(1000); return 'KSEF-ID-MOCK'; },
    fetchNbpTable: async (curr: string, date: string) => ({ tableNo: '123/A/NBP/2023', effectiveDate: date, rate: 4.5, currency: curr } as NbpTable),
    
    calculateTax: async (form: TaxFormType) => { 
        await delay(1000);
        return { 
            id: 'calc_1', 
            year: 2023, 
            type: form, 
            income: 150000, 
            taxDue: 18000, 
            status: 'CALCULATED',
            breakdown: {
                revenue: 200000,
                costs: 50000,
                income: 150000,
                taxBase: 145000,
                taxFreeAmount: 3600,
                taxRate: 0.19,
                healthInsurance: 12000,
                taxDue: 18000,
                zus: { socialTotal: 12000, healthInsurance: 5000, laborFund: 500, totalDue: 17500, deductibleFromTaxBase: 12000, deductibleFromTax: 0 },
                details: { thresholdExceeded: true, firstBracketAmount: 120000, secondBracketAmount: 30000 }
            }
        } as TaxReturn; 
    },
    explainTaxWithAI: async (breakdown: any) => { await delay(1000); return "Na podstawie Twoich dochodów, wpadłeś w drugi próg podatkowy..."; },
    signDocument: async (id: string) => { await delay(1000); },
    submitToMF: async (id: string) => { await delay(1500); return 'UPO-1234-5678'; },
    processPayment: async (amount: number, method: string) => { await delay(1000); },
    
    fetchAccounts: async () => ([
        { id: 'acc1', providerName: 'mBank', accountNumber: 'PL12...3456', balance: 24500.00, currency: 'PLN', type: 'BUSINESS', colorTheme: 'bg-red-600', logo: 'M', aggregator: 'Salt Edge' }
    ] as BankAccount[]),
    fetchWallets: async () => ([
        { id: 'w1', provider: 'MetaMask', address: '0x123...abc', chain: 'ETH', assetCount: 12, riskScore: 10 }
    ] as CryptoWallet[]),
    
    fetchCryptoTransactions: async () => ([
        { id: 'ctx1', exchange: 'BINANCE', timestamp: '2023-10-20T10:00:00Z', type: 'SPOT_BUY', pair: 'BTC/USDT', amount: 0.1, price: 30000, totalFiat: 12000, feeFiat: 12, realizedPnL: 0 }
    ] as CryptoTransaction[]),
    fetchDeFiProtocols: async () => ([
        { name: 'Aave V3', chain: 'Ethereum', type: 'LENDING', tvl: 1000000, userBalanceUsd: 5000, unclaimedRewardsUsd: 120 }
    ] as DeFiProtocol[]),
    fetchGoldRushData: async (address: string) => ([] as GoldRushTx[]),
    fetchNFTs: async () => ([
        { id: 'nft1', collection: 'Bored Ape', tokenId: '1234', name: 'BAYC #1234', imageUrl: 'https://via.placeholder.com/150', floorPrice: 30, purchasePrice: 20, gasFee: 0.05, purchaseDate: '2022-05-01', status: 'HELD' }
    ] as NFTAsset[]),
    getExchangeConnectionStatus: async () => ({ 'BINANCE': true, 'MEXC': false }),
    disconnectExchange: async (ex: string) => { await delay(500); },
    saveExchangeKeys: async (ex: string, key: string, secret: string) => { await delay(500); },
    
    fetchHistory: async () => ([] as TaxReturn[]),
    runSimulation: (params: SimulationParams) => TaxSimulator.simulateExpense(params),
    fetchAssets: async () => ([
        { id: 'a1', name: 'MacBook Pro', category: 'Komputery i elektronika', purchaseDate: '2023-01-15', initialValue: 12000, currentValue: 9000, amortizationRate: 0.30, schedule: [] }
    ] as Asset[]),
    addAsset: async (name: string, cat: string, val: number, date: string) => { await delay(500); },
    fetchContractors: async () => ([
        { id: 'c1', name: 'Design Studio Creative', nip: '5213334455', totalSales: 15000, totalPurchases: 0, invoiceCount: 5, lastInteraction: '2023-10-20', isNuffiUser: true, risk: { whiteListStatus: 'VERIFIED', dependency: 'LOW' } }
    ] as Contractor[]),
    verifyWhiteList: async (nip: string, iban: string) => { await delay(800); return { status: 'VALID', requestId: 'req_123' } as WhiteListStatus; },
    
    fetchFinancialReport: async (period: string) => ({
        period,
        lines: [
            { label: 'Przychody netto ze sprzedaży', value: 150000, type: 'REVENUE', indent: 0, isBold: true },
            { label: 'Koszty operacyjne', value: -45000, type: 'COST', indent: 0, isBold: true },
            { label: 'EBITDA', value: 105000, type: 'PROFIT', indent: 0, isBold: true },
            { label: 'Zysk Netto', value: 85000, type: 'PROFIT', indent: 0, isBold: true, highlight: true }
        ]
    } as FinancialReport),
    fetchFiscalCalendar: async () => ([
        { id: 'ev1', date: '2023-11-20', title: 'Podatek PIT-5', amount: 1500, type: 'PIT', status: 'PENDING' },
        { id: 'ev2', date: '2023-11-25', title: 'Podatek VAT-7', amount: 3200, type: 'VAT', status: 'PENDING' }
    ] as CalendarEvent[]),
    
    generateExport: async (fmt: ExportFormat, period: string) => { await delay(1000); },
    sendPackageToAccountant: async (email: string) => { await delay(1000); },
    
    searchGlobal: async (q: string) => ([
        { id: 'res1', type: 'CONTRACTOR', title: 'Design Studio', subtitle: 'NIP: 5213334455' }
    ] as any[]),
    
    fetchNotifications: async () => ([
        { id: 'n1', type: 'INFO', title: 'Nowa faktura', message: 'Otrzymano fakturę kosztową od Google.', read: false, timestamp: '10:30' }
    ] as any[]),
    
    fetchTaxOffices: async () => ([]),
    fetchAuditLogs: async () => ([] as AuditEntry[]),
    fetchTeamMembers: async () => ([] as TeamMember[]),
    fetchApiVaultStatus: async () => ([
        { provider: 'Salt Edge', isConnected: true, lastChecked: '2023-10-26', featuresUnlocked: ['Banking'] }
    ] as ApiVaultStatus[]),
    inviteTeamMember: async (email: string, role: string) => { await delay(500); },
    
    sendAIChatMessage: async (msg: string, history: any[]) => { await delay(1000); return "Oto odpowiedź AI na Twoje pytanie o podatki."; },
    
    fetchDirectDebits: async () => ([] as DirectDebitMandate[]),
    fetchFinancialHealth: async () => ({ score: 750, riskLevel: 'LOW', affordabilityRating: 'A', monthlyDisposableIncome: 5000, debtToIncomeRatio: 0.2 } as FinancialHealthScore),
    executeTransfer: async (req: TransferRequest) => { await delay(1000); },
    executeBulkPayment: async (recipients: string[], amount: number) => { await delay(1500); return { id: 'batch_1', totalAmount: amount, count: recipients.length, status: 'AUTHORIZED' } as BulkPaymentBatch; },
    setupVrp: async (cfg: VrpConfig) => { await delay(500); },
    verifyAccountOwnership: async (iban: string, name: string) => { await delay(1000); return { matchStatus: 'MATCH', confidenceScore: 99 } as AccountVerification; },
    
    verifyNftAccess: async (wallet: string) => { await delay(1000); return true; },
    fetchGusData: async (nip: string) => { await delay(1000); return { name: 'Test Company', street: 'Testowa', propertyNumber: '1', city: 'Warszawa', zipCode: '00-001', vatStatus: 'ACTIVE', regon: '123456789' }; },
    createStripeCheckout: async (plan: string) => { await delay(1000); return 'https://stripe.com'; },
    
    searchCeidgAndWhiteList: async (q: string) => ([
        { name: 'Example Company', nip: '5213214567', regon: '123456789', address: 'Warszawa', status: 'ACTIVE', verifiedIban: 'PL1234567890', isNuffiUser: true }
    ] as any[]),
    
    fetchExchangeRates: async () => ([
        { pair: 'EUR/PLN', mid: 4.5, bid: 4.48, ask: 4.52, changePercent: 0.5, timestamp: '' },
        { pair: 'USD/PLN', mid: 4.2, bid: 4.18, ask: 4.22, changePercent: -0.2, timestamp: '' }
    ] as ExchangeRate[]),
    fetchFxPositions: async () => ([
        { id: 'fx1', pair: 'EUR/PLN', type: 'LONG', amount: 10000, avgRate: 4.45, valuePln: 45000, unrealizedPnL: 500 }
    ] as FxPosition[]),
    fetchLedgerEntries: async () => ([
        { id: 'l1', date: '2023-10-25', provider: 'Modern Treasury', amount: 1000, currency: 'PLN', status: 'POSTED', direction: 'CREDIT', metadata: {} }
    ] as LedgerEntry[]),
    executeFxSwap: async (pair: string, amount: number, side: string) => { await delay(500); },
    
    fetchProjects: async () => ([]),
    fetchVirtualCards: async () => ([]),
    toggleCardFreeze: async (id: string, freeze: boolean) => { await delay(200); },
    fetchEmployees: async () => ([]),
    runPayroll: async (month: string) => ([
        { employeeId: 'e1', employeeName: 'Jan Kowalski', contractType: 'UOP', salaryGross: 8000, employerCostTotal: 9600, salaryNet: 5600, zusEmployer: 1600, zusEmployee: 1200, healthInsurance: 600, pitAdvance: 600 }
    ] as any[]),
    
    fetchInventory: async () => ([]),
    fetchWarehouseDocuments: async () => ([]),
    fetchVehicles: async () => ([]),
    fetchEcommerceOrders: async () => ([]),
    
    fetchOssData: async () => ([] as OssTransaction[]),
    calculateOssTax: async () => ([{ countryCode: 'DE', countryName: 'Niemcy', standardRate: 0.19, totalNetEur: 5000, totalVatEur: 950 }] as OssCountryReport[]),
    fetchIntrastatStatus: async () => ([{ type: 'IMPORT', limit: 2000000, currentValue: 150000, status: 'SAFE' }] as IntrastatThreshold[]),
    generateDefensePackage: async (year: number) => { await delay(2000); return { id: 'pkg_1', hash: 'abc123hash', status: 'READY' } as AuditPackage; },
    
    fetchIndustryStats: async () => ([] as IndustryStat[]),
    fetchMacroIndicators: async () => ([] as MacroIndicator[]),
    fetchGovTechData: async () => ({ smupRequests: 120, dbwKbArticles: 50, sdpTaxStatus: 'OK' }),
    fetchEsgData: async () => ({ totalCo2Tons: 12.5, breakdown: { transport: 5, energy: 4, servers: 2, other: 1.5 }, treesNeeded: 250, trend: 'DOWN' } as EsgScore),
    
    fetchContracts: async () => ([] as Contract[]),
    fetchMarketplaceItems: async () => ([
        { id: 'm1', category: 'FINANCE', title: 'Faktoring Online', provider: 'SMEO', description: 'Finansowanie faktur w 15 minut.', price: 'od 1.5%', icon: 'Banknote' }
    ] as MarketplaceItem[]),
    
    getTaxEngineStatus: async () => ({ status: 'ONLINE', lastSync: 'now', transactionsProcessed: 15000, processingSpeed: 500, uptime: 99.9 } as TaxEngineStatus),
    updateTaxEngineConfig: async (cfg: TaxEngineConfig) => { await delay(500); },
    fetchTaxPredictions: async () => ([
        { month: 'Oct', estimatedRevenue: 50000, estimatedCost: 10000, estimatedTax: 7600, type: 'ACTUAL' },
        { month: 'Nov', estimatedRevenue: 55000, estimatedCost: 12000, estimatedTax: 8170, type: 'PREDICTED' }
    ] as TaxPrediction[]),
    fetchLegislativeAlerts: async () => ([] as LegislativeAlert[]),
    fetchCountryTaxRules: async () => ([{ countryCode: 'DE', name: 'Niemcy', flag: '🇩🇪', taxRateCorporate: 15, taxRatePersonal: [14, 42, 45], hasDttWithPl: true, dttMethod: 'EXEMPTION_WITH_PROGRESSION' }] as CountryTaxProfile[]),
    calculateCrossBorderTax: async (incomes: ForeignIncome[]) => { await delay(1000); return { plTaxBase: 0, foreignTaxBasePln: 200000, plTaxDue: 0, foreignTaxPaidPln: 40000, effectiveRate: 0.20, taxCreditUsed: 0, additionalPaymentPl: 0, methodUsed: 'Exemption' } as CrossBorderResult; },
    
    fetchTaxOptimizationOpportunities: async () => ([
        { id: 'opt1', asset: 'BTC', currentPrice: 28000, purchasePrice: 35000, unrealizedLoss: 7000, quantity: 1, type: 'CRYPTO', strategy: 'HARVEST_LOSS', potentialTaxSavings: 1330 }
    ] as TaxOptimizationOpportunity[]),
    
    fetchDividends: async () => ([
        { id: 'div1', ticker: 'AAPL', companyName: 'Apple Inc.', paymentDate: '2023-08-15', amountGross: 100, currency: 'USD', whtRate: 0.15, taxPaidForeign: 15, taxDuePl: 4, status: 'RECEIVED', country: 'US' }
    ] as Dividend[]),
    
    fetchUnifiedLedger: async () => ([] as UnifiedLedgerItem[]),
    fetchClients: async () => ([{ id: 'cl1', name: 'Firma Testowa', nip: '1234567890', status: 'ACTIVE', documentsToProcess: 5, vatStatus: 'OK', pitStatus: 'DUE', lastActivity: '2023-10-25', monthProgress: 80 }] as ClientProfile[]),
    sendClientReminder: async (id: string, type: string) => { await delay(500); },
    fetchUnclassifiedTransactions: async () => ([
        { id: 'ut1', date: '2023-10-25', description: 'Nieznany przelew', amount: -200, currency: 'PLN', confidence: 0.4, aiSuggestion: { category: 'Other', reasoning: 'Niejasny opis' }, source: 'Bank' }
    ] as UnclassifiedTransaction[]),
    classifyTransaction: async (id: string, cat: string) => { await delay(500); },
    
    fetchMerchantStats: async () => ({ totalVolume: 150000, txCount: 450, activeLinks: 12, cryptoVolume: 5000 } as MerchantStats),
    fetchMerchantTransactions: async () => ([] as MerchantTx[]),
    createPaymentLink: async (amount: number, curr: string, desc: string) => { await delay(1000); return `https://pay.nuffi.io/${Math.random().toString(36).substr(2, 9)}`; },
    
    fetchAutomationRules: async () => ([
        { id: 'ar1', name: 'Auto-VAT Transfer', trigger: 'Invoice Paid', condition: 'Amount > 0', conditionValue: 0, action: 'Transfer VAT to Subaccount', active: true, lastTriggered: '2023-10-25' }
    ] as AutomationRule[]),
    toggleAutomationRule: async (id: string, active: boolean) => { await delay(200); },
    
    analyzeImportFile: async (file: File) => { await delay(1500); return { id: 'job_1', fileName: file.name, totalRows: 150, headers: ['Data', 'Opis', 'Kwota', 'Waluta'], preview: [['2023-10-01', 'Usługa', '100', 'PLN'], ['2023-10-02', 'Zakup', '-50', 'PLN']] } as ImportJob; },
    getAiMappingSuggestions: async (headers: string[]) => { await delay(500); return headers.map(h => ({ fileHeader: h, systemField: 'IGNORE', confidence: 0.5 })) as CsvMapping[]; },
    submitImport: async (id: string, map: CsvMapping[]) => { await delay(1000); },
    
    fetchRiskProfile: async () => ({
        globalScore: 85,
        categories: [
            { name: 'VAT Compliance', score: 90, status: 'SAFE', issuesFound: 0 },
            { name: 'Liquidity', score: 70, status: 'WARNING', issuesFound: 2 },
            { name: 'AML/KYC', score: 95, status: 'SAFE', issuesFound: 0 }
        ],
        criticalAlerts: []
    } as RiskAssessment),
    
    analyzeTxGraph: async (hash: string) => {
        await delay(2000);
        return {
            hash,
            timestamp: new Date().toISOString(),
            nodes: [
                { id: 'n1', type: 'WALLET', label: 'Sender', x: 100, y: 100, color: '#4F46E5' },
                { id: 'n2', type: 'CONTRACT', label: 'Uniswap V3', x: 300, y: 100, color: '#EC4899' },
                { id: 'n3', type: 'WALLET', label: 'Receiver', x: 500, y: 100, color: '#10B981' }
            ],
            links: [
                { source: 'n1', target: 'n2', label: 'Swap 1000 USDC' },
                { source: 'n2', target: 'n3', label: 'Receive 0.5 ETH' }
            ],
            taxVerdict: 'TAXABLE_EVENT',
            complexityScore: 45,
            gasUsedEth: 0.005
        } as TxAnalysisResult;
    },
    
    fetchSnapshots: async () => ([
        { id: 'snap1', name: 'Zamknięcie Wrzesień 2023', createdAt: '2023-10-05', createdBy: 'System', period: '2023-09', hash: 'sha256...', dataSize: '15MB', status: 'LOCKED', tags: ['VAT', 'PIT'] }
    ] as TaxSnapshot[]),
    createSnapshot: async (name: string) => { await delay(1000); },
    
    fetchTimeEntries: async () => ([] as TimeEntry[]),
    
    fetchInbox: async () => ([
        { id: 'em1', sender: 'Google Ireland', subject: 'Invoice 12345', date: '2023-10-25 10:00', preview: 'Attached is your invoice...', hasAttachment: true, isRead: false, aiTags: ['INVOICE', 'URGENT'] }
    ] as EmailMessage[]),
    
    scanTokenContract: async (address: string) => {
        await delay(2000);
        return {
            address,
            name: 'SafeMoon 2.0',
            symbol: 'SFM2',
            riskScore: 30,
            issues: [
                { type: 'HONEYPOT', severity: 'HIGH', description: 'Sell tax is 99%.' },
                { type: 'OWNERSHIP', severity: 'MEDIUM', description: 'Ownership not renounced.' }
            ],
            isHoneypot: true,
            ownershipRenounced: false,
            liquidityLocked: false
        } as TokenSecurity;
    },
    
    fetchSubscriptions: async () => ([
        { id: 'sub1', name: 'Adobe Creative Cloud', cost: 60, currency: 'EUR', billingCycle: 'MONTHLY', nextPayment: '2023-11-01', status: 'ACTIVE', logo: 'A', usageScore: 90 }
    ] as Subscription[]),
    
    fetchWhaleWallets: async () => ([
        { address: '0xabc...123', label: 'Alameda (Tagged)', balanceUsd: 5000000, chain: 'ETH', tags: ['VC', 'Whale'] }
    ] as WhaleWallet[]),
    fetchWhaleTransactions: async () => ([
        { id: 'wt1', hash: '0x...', timestamp: new Date().toISOString(), fromAddress: '0xabc...123', fromLabel: 'Alameda', toAddress: '0xbin...ance', toLabel: 'Binance Hot Wallet', amount: 5000, token: 'ETH', valueUsd: 10000000, type: 'INFLOW' }
    ] as WhaleTx[]),
    
    fetchDebtCases: async () => ([
        { id: 'dc1', debtorName: 'Zaległy Klient sp. z o.o.', nip: '123123123', invoiceNumber: 'FV/2023/01', amount: 5000, dueDate: '2023-09-01', daysOverdue: 55, status: 'REMINDER_SENT', statutoryInterest: 120 }
    ] as DebtCase[]),
    sendDebtReminder: async (id: string, type: string) => { await delay(500); },
    
    fetchCapTable: async () => ([
        { id: 'sh1', name: 'Founder 1', role: 'FOUNDER', shares: 6000000, percentage: 66.6, joinedDate: '2020-01-01' },
        { id: 'sh2', name: 'Investor A', role: 'INVESTOR', shares: 3000000, percentage: 33.3, joinedDate: '2021-01-01', investedAmount: 1000000 }
    ] as Shareholder[]),
    
    fetchBusinessTrips: async () => ([] as BusinessTrip[]),
    fetchCashDocuments: async () => ([] as CashDocument[]),
    
    fetchDerivatives: async () => ([
        { id: 'der1', symbol: 'SPY', type: 'CALL', side: 'LONG', strike: 450, expiration: '2023-12-15', quantity: 10, avgPrice: 5.5, currentPrice: 7.2, underlyingPrice: 445, pnl: 1700, greeks: { delta: 0.6, gamma: 0.02, theta: -0.1, vega: 0.15 } }
    ] as DerivativePosition[]),
    
    fetchBonds: async () => ([
        { id: 'bnd1', isin: 'PL0000105305', name: 'EDO0530', type: 'TREASURY', faceValue: 100, quantity: 100, couponRate: 7.25, inflationIndexed: true, maturityDate: '2030-05-01', nextCouponDate: '2024-05-01', nextCouponAmount: 725, yieldToMaturity: 7.5, currentValue: 10200 }
    ] as BondPosition[]),
    
    fetchUserApiKeys: async () => ([] as UserApiKey[]),
    fetchApiUsage: async () => ({ totalRequests: 15000, errorRate: 0.1, avgLatency: 120, history: [] } as ApiUsageStats),
    generateUserApiKey: async (name: string, type: string) => { await delay(500); return 'sk_test_1234567890abcdef'; },
    
    fetchSystemStatus: async () => ({
        globalStatus: 'OPERATIONAL',
        components: [
            { name: 'API Core', status: 'OPERATIONAL', uptime: 99.99, description: 'Main REST API' },
            { name: 'KSeF Gateway', status: 'OPERATIONAL', uptime: 99.95, description: 'Ministry of Finance Connector' }
        ],
        incidents: []
    } as SystemStatusData),
    
    fetchHelpCategories: async () => ([
        { id: 'cat1', name: 'Podatki', description: 'PIT, CIT, VAT', icon: 'Book' }
    ] as HelpCategory[]),
    fetchHelpArticles: async () => ([
        { id: 'art1', categoryId: 'cat1', title: 'Jak rozliczyć kryptowaluty?', description: 'Poradnik krok po kroku.', content: 'Lorem ipsum...', readTime: '5 min', icon: 'FileText' }
    ] as HelpArticle[]),
    
    sendN8nMessage: async (text: string) => { await delay(1500); return `Agent n8n otrzymał wiadomość: "${text}". Przetwarzam zapytanie w workflow...`; },
    
    trackEvent: (event: string, data: any) => { console.log('Analytics:', event, data); },
    fetchLoans: async () => ([] as Loan[]),
};
