
export enum ApiProvider {
    SALT_EDGE = 'Salt Edge',
    TINK = 'Tink',
    TRUELAYER = 'TrueLayer',
    GOCARDLESS = 'GoCardless',
    RAILSR = 'Railsr',
    MODERN_TREASURY = 'Modern Treasury',
    BYBIT = 'Bybit',
    MEXC = 'MEXC',
    MORALIS = 'Moralis',
    NANSEN = 'Nansen',
    COINAPI = 'CoinAPI',
    GOLDRUSH = 'GoldRush',
    ALCHEMY = 'Alchemy',
    QUICKNODE = 'QuickNode',
    SUMSUB = 'SumSub',
    CIVIC = 'Civic',
    DOCUSIGN = 'DocuSign',
    CEIDG = 'CEIDG (Gov)',
    STRATEG = 'STRATEG (GUS)',
    TRANSTAT = 'TRANSTAT (Intrastat)',
    SMUP = 'SMUP (Usługi Publiczne)',
    DBW = 'DBW (Wspólna Baza)',
    SDP = 'SDP (System Danych Podatkowych)',
    SEGMENT = 'Segment',
    XTB = 'XTB (xStation)',
    INTERACTIVE_BROKERS = 'IBKR'
}

export interface ApiVaultStatus {
    provider: ApiProvider | string;
    isConnected: boolean;
    lastChecked: string;
    featuresUnlocked: string[];
}

export interface OssTransaction {
    id: string;
    date: string;
    countryCode: string;
    amountEur: number;
    vatRate?: number;
    vatAmountEur?: number;
    source: 'SHOPIFY' | 'ALLEGRO' | 'MANUAL';
}

export enum SubscriptionPlan {
    FREE = 'FREE',
    PRO = 'PRO',
    ENTERPRISE = 'ENTERPRISE'
}

export enum TaxationForm {
    GENERAL_SCALE = 'GENERAL_SCALE',
    FLAT_RATE = 'FLAT_RATE',
    LUMP_SUM = 'LUMP_SUM'
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    nip: string;
    pesel: string;
    taxOfficeCode: string;
    taxationForm: TaxationForm;
    cryptoStrategy: 'FIFO' | 'LIFO' | 'HIFO';
    kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
    companyName: string;
    companyAddress: string;
}

export interface TaxOffice {
    code: string;
    name: string;
}

export interface AuditEntry {
    id: string;
    action: string;
    date: string;
    ip: string;
    device: string;
    status: 'SUCCESS' | 'FAILURE';
}

export type UserRole = 'ADMIN' | 'ACCOUNTANT' | 'ANALYST' | 'VIEWER';

export interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    status: 'ACTIVE' | 'PENDING' | 'LOCKED';
    lastActive: string;
}

export enum CryptoExchange {
    BINANCE = 'BINANCE',
    KRAKEN = 'KRAKEN',
    COINBASE = 'COINBASE',
    KUCOIN = 'KUCOIN',
    BYBIT = 'BYBIT',
    MEXC = 'MEXC',
    OKX = 'OKX',
    BITGET = 'BITGET'
}

export enum CryptoTransactionType {
    SPOT_BUY = 'SPOT_BUY',
    SPOT_SELL = 'SPOT_SELL',
    FUTURES_PNL = 'FUTURES_PNL',
    FUNDING_FEE = 'FUNDING_FEE',
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    STAKING_REWARD = 'STAKING_REWARD',
    DEFI_SWAP = 'DEFI_SWAP',
    LIQUIDITY_ADD = 'LIQUIDITY_ADD',
    LIQUIDITY_REMOVE = 'LIQUIDITY_REMOVE',
    BRIDGE_SEND = 'BRIDGE_SEND',
    BRIDGE_RECEIVE = 'BRIDGE_RECEIVE'
}

export interface CryptoTransaction {
    id: string;
    exchange: CryptoExchange;
    timestamp: string;
    type: CryptoTransactionType;
    pair: string;
    amount: number;
    price: number;
    totalFiat: number;
    feeFiat: number;
    realizedPnL?: number;
    txHash?: string;
    protocol?: string;
    confidenceScore?: number;
}

export interface BankAccount {
    id: string;
    providerName: string;
    accountNumber: string;
    balance: number;
    currency: string;
    lastSync: string;
    type: 'BUSINESS' | 'PERSONAL' | 'SAVINGS' | 'MULTI_CURRENCY';
    colorTheme: string;
    logo: string;
    aggregator: string;
    isVirtual?: boolean;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    bankId: string;
}

export interface DirectDebitMandate {
    id: string;
    creditorName: string;
    status: 'ACTIVE' | 'INACTIVE';
    lastPaymentDate: string;
    lastPaymentAmount: number;
}

export interface TransferRequest {
    fromAccountId: string;
    amount: number;
    recipientName: string;
    recipientIban: string;
    title: string;
    type: 'DOMESTIC' | 'SEPA' | 'SWIFT';
    currency: string;
}

export interface BulkPaymentBatch {
    id: string;
    totalAmount: number;
    count: number;
    status: 'AUTHORIZED' | 'PENDING' | 'REJECTED';
}

export interface VrpConfig {
    id?: string;
    beneficiary: string;
    maxAmountPerPeriod: number;
    period: 'MONTHLY' | 'WEEKLY';
    active: boolean;
}

export interface FinancialHealthScore {
    score: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    affordabilityRating: string;
    monthlyDisposableIncome: number;
    debtToIncomeRatio: number;
}

export interface AccountVerification {
    matchStatus: 'MATCH' | 'NO_MATCH' | 'CLOSE_MATCH';
    confidenceScore: number;
}

export interface PaymentLink {
    id: string;
    amount: number;
    currency: string;
    url: string;
    status: 'PENDING' | 'PAID';
}

export interface WatchlistAddress {
    address: string;
    label: string;
    chain: string;
}

export interface NftCollectionStat {
    name: string;
    floorPrice: number;
    volume24h: number;
    change24h: number;
}

export interface TokenGodMode {
    symbol: string;
    smartMoneyHoldings: number;
    exchangeInflow: number;
    exchangeOutflow: number;
}

export interface TokenAllowance {
    token: string;
    spender: string;
    allowance: string; 
    risk: 'HIGH' | 'LOW';
}

export interface StreamEvent {
    id: string;
    type: string;
    data: any;
}

export interface WalletDna {
    tags: string[];
    ageDays: number;
    activityScore: number;
}

export interface IndustryStat {
    sector: string;
    avgRevenue: number;
    avgCost: number;
}

export interface MacroIndicator {
    name: string;
    value: number;
    unit: string;
    trend: 'UP' | 'DOWN' | 'STABLE';
    date: string;
}

export interface LedgerEntry {
    id: string;
    date: string;
    provider: string;
    amount: number;
    currency: string;
    status: string;
    direction: 'DEBIT' | 'CREDIT';
    metadata: any;
}

export interface GoldRushTx {
    hash: string;
    from: string;
    to: string;
    value: string;
    blockNumber: number;
}

export interface ExpenseBreakdown {
    category: string;
    amount: number;
    percentage: number;
}

export interface CashFlowPoint {
    date: string;
    balance: number;
    type: 'ACTUAL' | 'PROJECTED';
}

export enum AssetCategory {
    COMPUTER = 'Komputery i elektronika',
    PHONE = 'Telefony',
    CAR = 'Samochody',
    FURNITURE = 'Meble i wyposażenie',
    SOFTWARE = 'Wartości niematerialne i prawne',
    OTHER = 'Inne'
}

export interface AmortizationSchedule {
    year: number;
    month: number;
    writeOffAmount: number;
    remainingValue: number;
    accumulated: number;
}

export interface Asset {
    id: string;
    name: string;
    category: AssetCategory;
    purchaseDate: string;
    initialValue: number;
    currentValue: number;
    amortizationRate: number;
    schedule: AmortizationSchedule[];
}

export interface Contractor {
    id: string;
    name: string;
    nip: string;
    totalSales: number;
    totalPurchases: number;
    invoiceCount: number;
    lastInteraction: string;
    isNuffiUser: boolean;
    risk: {
        whiteListStatus: 'VERIFIED' | 'UNKNOWN' | 'FAILED';
        dependency: 'LOW' | 'MEDIUM' | 'HIGH';
    }
}

export interface FinancialReport {
    period: string;
    lines: {
        label: string;
        value: number;
        type: 'REVENUE' | 'COST' | 'PROFIT' | 'TAX';
        indent: number;
        isBold?: boolean;
        highlight?: boolean;
    }[];
}

export interface CalendarEvent {
    id: string;
    date: string;
    title: string;
    amount: number;
    type: 'ZUS' | 'VAT' | 'PIT' | 'OTHER';
    status: 'PENDING' | 'PAID';
}

export interface Budget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    forecast: number;
    status: 'SAFE' | 'WARNING' | 'EXCEEDED';
    percentUsed: number;
}

export enum ExportFormat {
    JPK_V7 = 'JPK_V7',
    JPK_FA = 'JPK_FA',
    KPIR_PDF = 'KPIR_PDF',
    KPIR_CSV = 'KPIR_CSV',
    XML = 'XML'
}

export enum ViewState {
    DASHBOARD = 'DASHBOARD',
    INTEGRATIONS = 'INTEGRATIONS',
    TAX_WIZARD = 'TAX_WIZARD',
    DOCUMENTS = 'DOCUMENTS',
    HISTORY = 'HISTORY',
    SETTINGS = 'SETTINGS',
    SCENARIOS = 'SCENARIOS',
    ASSETS = 'ASSETS',
    CONTRACTORS = 'CONTRACTORS',
    REPORTS = 'REPORTS',
    BUDGETS = 'BUDGETS',
    EXPORT = 'EXPORT',
    CRYPTO_HUB = 'CRYPTO_HUB',
    YAPILY_CONNECT = 'YAPILY_CONNECT',
    B2B_NETWORK = 'B2B_NETWORK',
    TREASURY = 'TREASURY',
    PROJECTS = 'PROJECTS',
    CARDS = 'CARDS',
    PAYROLL = 'PAYROLL',
    WAREHOUSE = 'WAREHOUSE',
    VEHICLES = 'VEHICLES',
    ECOMMERCE = 'ECOMMERCE',
    INTERNATIONAL = 'INTERNATIONAL',
    AUDIT_DEFENDER = 'AUDIT_DEFENDER',
    MARKET_INTEL = 'MARKET_INTEL',
    PRICING = 'PRICING',
    ESG = 'ESG',
    WEALTH = 'WEALTH',
    CONTRACTS = 'CONTRACTS',
    MARKETPLACE = 'MARKETPLACE',
    FORENSICS = 'FORENSICS',
    TAX_ENGINE = 'TAX_ENGINE',
    PREDICTIVE_TAX = 'PREDICTIVE_TAX',
    REAL_ESTATE = 'REAL_ESTATE',
    LOANS = 'LOANS',
    GLOBAL_TAX = 'GLOBAL_TAX',
    TAX_OPTIMIZER = 'TAX_OPTIMIZER'
}

export interface SearchResult {
    id: string;
    type: 'INVOICE' | 'CONTRACTOR' | 'ASSET' | 'VIEW' | 'OTHER';
    title: string;
    subtitle: string;
    targetView?: ViewState;
}

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
    action?: {
        label: string;
        actionType: 'NAVIGATE' | 'LINK';
        target: any;
    };
}

export interface CryptoWallet {
    id: string;
    provider: string;
    address: string;
    chain: string;
    assetCount: number;
    riskScore: number;
}

export interface DeFiReward {
    protocol: string;
    amount: number;
    asset: string;
    valueUsd: number;
}

export interface TaxHarvestingOpp {
    asset: string;
    lossAmount: number;
    currentPrice: number;
    purchasePrice: number;
}

export interface NFTAsset {
    collection: string;
    tokenId: string;
    name: string;
    imageUrl?: string;
    floorPrice: number;
}

export interface CryptoAnalytics {
    totalPnl: number;
    winRate: number;
    volume: number;
    tradesCount: number;
    
}

export interface WalletRiskProfile {
    score: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface OssCountryReport {
    countryCode: string;
    countryName: string;
    standardRate: number;
    totalNetEur: number;
    totalVatEur: number;
}

export interface IntrastatThreshold {
    type: 'IMPORT' | 'EXPORT';
    limit: number;
    currentValue: number;
    status: 'SAFE' | 'WARNING' | 'EXCEEDED';
}

export interface AuditRiskFactor {
    id: string;
    category: 'VAT' | 'COSTS' | 'INCOME' | 'OTHER';
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    detected: boolean;
}

export interface AuditPackage {
    id: string;
    hash: string;
    status: 'READY' | 'PROCESSING';
}

export interface MarketComparison {
    metric: string;
    myValue: number;
    marketValue: number;
    difference: number;
    status: 'BETTER' | 'WORSE' | 'EQUAL';
}

export interface InvoiceItem {
    name: string;
    quantity: number;
    unitPriceNet: number;
    totalNet: number;
    vatRate: number;
    minLevel?: number;
    lastMoved?: string;
}

export enum CostCategory {
    OPERATIONAL_100 = 'OPERATIONAL_100',
    FUEL_75 = 'FUEL_75',
    REPRESENTATION_0 = 'REPRESENTATION_0',
    OTHER = 'OTHER'
}

export interface Invoice {
    id: string;
    ksefNumber: string;
    contractor: string;
    nip: string;
    date: string;
    amountNet: number;
    amountVat: number;
    amountGross: number;
    type: 'SALES' | 'PURCHASE';
    status: 'PROCESSED' | 'PENDING' | 'DRAFT_XML';
    currency: string;
    exchangeRate?: number;
    costCategory?: CostCategory;
    aiAuditScore?: number;
    aiAuditNotes?: string;
    items?: InvoiceItem[];
    docuSignStatus?: 'SENT' | 'SIGNED' | 'NONE';
}

export interface RecurringInvoice {
    id: string;
    templateName: string;
    contractor: Contractor;
    frequency: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
    nextIssueDate: string;
    amountNet: number;
    active: boolean;
}

export interface RecurringSuggestion {
    contractorName: string;
    nip: string;
    detectedFrequency: string;
    confidence: number;
    potentialSavingsTime: string;
}

export interface NbpTable {
    tableNo: string;
    effectiveDate: string;
    rate: number;
    currency: string;
}

export interface Project {
    id: string;
    name: string;
    client: string;
    status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
    budget: number;
    spent: number;
    revenue: number;
    startDate: string;
    tags: string[];
    profitMargin: number;
}

export interface VirtualCard {
    id: string;
    last4: string;
    holderName: string;
    expiry: string;
    type: 'VIRTUAL' | 'PHYSICAL';
    status: 'ACTIVE' | 'FROZEN' | 'CANCELLED';
    limitMonthly: number;
    spentMonthly: number;
    brand: 'VISA' | 'MASTERCARD';
    color: string;
}

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    salaryAmount: number;
    contractType: 'UOP' | 'B2B' | 'UZ' | 'UOD';
    status: 'ACTIVE' | 'INACTIVE';
    joinDate: string;
}

export interface PayrollEntry {
    employeeId: string;
    employeeName: string;
    contractType: string;
    salaryGross: number;
    employerCostTotal: number;
    salaryNet: number;
    zusEmployer: number;
    zusEmployee: number;
    healthInsurance: number;
    pitAdvance: number;
}

export interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    priceNet: number;
    priceSell: number;
    vatRate: number;
    minLevel: number;
    lastMoved: string;
}

export interface WarehouseDocument {
    id: string;
    number: string;
    date: string;
    type: 'PZ' | 'WZ' | 'MM' | 'INW';
    contractorName?: string;
    totalValueNet: number;
}

export interface Vehicle {
    id: string;
    name: string;
    licensePlate: string;
    type: 'CAR' | 'TRUCK' | 'VAN';
    vatDeduction: 'FULL_100' | 'MIXED_50';
    mileageCurrent: number;
    insuranceExpiry: string;
    inspectionExpiry: string;
}

export interface Order {
    id: string;
    platformId: 'allegro' | 'shopify' | 'other';
    platformOrderId: string;
    date: string;
    customer: string;
    totalGross: number;
    commissionFee: number;
    status: 'PAID' | 'SHIPPED' | 'CANCELLED' | 'PENDING';
    fiscalized: boolean;
}

export interface GusData {
    name: string;
    address?: string;
    street?: string;
    propertyNumber?: string;
    apartmentNumber?: string;
    city: string;
    zipCode: string;
    nip: string;
    regon: string;
    startDate?: string;
    pkd?: string;
    pkdDesc?: string;
    vatStatus?: string;
    legalForm?: string;
    representatives?: string[];
    shareCapital?: number;
    krs?: string;
    history?: { date: string; description: string }[];
}

export interface WhiteListStatus {
    status: 'VALID' | 'INVALID' | 'UNKNOWN';
    requestId: string;
}

export interface CeidgCompany {
    name: string;
    nip: string;
    regon: string;
    address: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
    verifiedIban?: string;
    isNuffiUser: boolean;
}

export interface ExchangeRate {
    pair: string;
    mid: number;
    bid: number;
    ask: number;
    changePercent: number;
    timestamp: string;
}

export interface FxPosition {
    id: string;
    pair: string;
    type: 'LONG' | 'SHORT';
    amount: number;
    avgRate: number;
    valuePln: number;
    unrealizedPnL: number;
}

export enum TaxFormType {
    PIT_37 = 'PIT-37',
    PIT_36 = 'PIT-36',
    PIT_38 = 'PIT-38',
    CIT_8 = 'CIT-8'
}

export enum TaxStatus {
    CALCULATED = 'CALCULATED',
    SIGNED = 'SIGNED',
    SUBMITTED = 'SUBMITTED',
    PAID = 'PAID'
}

export interface ZusBreakdown {
    socialTotal: number;
    healthInsurance: number;
    laborFund: number;
    totalDue: number;
    deductibleFromTaxBase: number;
    deductibleFromTax: number;
}

export interface TaxBreakdown {
    revenue: number;
    costs: number;
    income: number;
    taxBase: number;
    taxFreeAmount: number;
    taxRate: number;
    healthInsurance: number;
    taxDue: number;
    zus?: ZusBreakdown;
    details: {
        thresholdExceeded: boolean;
        firstBracketAmount: number;
        secondBracketAmount: number;
    };
}

export interface TaxReturn {
    id: string;
    year: number;
    type: TaxFormType;
    income: number;
    taxDue: number;
    status: TaxStatus;
    submissionDate?: string;
    upoId?: string;
    breakdown?: TaxBreakdown;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    text: string;
    timestamp: Date;
}

export interface SimulationParams {
    amountGross: number;
    vatRate: number;
    category: CostCategory;
    taxationForm: TaxationForm;
}

export interface SimulationResult {
    amountNet: number;
    vatTotal: number;
    vatDeductible: number;
    vatNonDeductible: number;
    pitCostBasis: number;
    pitDeductibleAmount: number;
    pitTaxShield: number;
    totalSavings: number;
    realCost: number;
    percentSaved: number;
}

export type IntegrationStatus = 'IDLE' | 'CONNECTING' | 'AUTHENTICATING' | 'FETCHING' | 'SUCCESS' | 'FAILURE';

export interface VatSummary {
    outputVat: number;
    inputVat: number;
    vatDue: number;
}

export interface ImpermanentLossResult {
    initialValue: number;
    holdValue: number;
    poolValue: number;
    impermanentLoss: number;
    impermanentLossPercent: number;
}

export interface CryptoTaxReport {
    year: number;
    strategy: string;
    spotIncome: number;
    spotCost: number;
    spotIncomeTaxBase: number;
    futuresIncome: number;
    futuresCost: number;
    futuresIncomeTaxBase: number;
    totalTaxDue: number;
    transactionsProcessed: number;
}

// ESG & Wealth Types
export interface EsgScore {
    totalCo2Tons: number;
    breakdown: {
        transport: number;
        energy: number;
        servers: number;
        other: number;
    };
    treesNeeded: number;
    trend: 'UP' | 'DOWN';
}

export interface StockAsset {
    symbol: string;
    name: string;
    type: 'STOCK' | 'ETF' | 'COMMODITY';
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    currency: string;
    valuePln: number;
    pnl: number;
    pnlPercent: number;
}

// Contract & Marketplace Types
export interface Contract {
    id: string;
    name: string;
    party: string;
    type: 'B2B' | 'NDA' | 'EMPLOYMENT' | 'LEASE' | 'OTHER';
    startDate: string;
    endDate?: string;
    value?: number;
    currency: string;
    status: 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'TERMINATED';
    noticePeriod: string;
    autoRenewal: boolean;
    tags: string[];
}

export interface MarketplaceItem {
    id: string;
    category: 'FINANCE' | 'INSURANCE' | 'OFFICE' | 'SERVICES';
    title: string;
    provider: string;
    description: string;
    price: string;
    icon: string;
    recommended?: boolean;
}

// FORENSICS & TAX ENGINE TYPES
export interface ForensicIssue {
    id: string;
    type: 'WASH_SALE' | 'MISSING_COST_BASIS' | 'SCAM_TOKEN' | 'DANGLING_TX' | 'UNMATCHED_TRANSFER';
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    affectedAssets: string[];
    confidence: number;
    date: string;
}

export interface ForensicsSummary {
    totalIssues: number;
    riskScore: number; // 0-100 (100 = very risky)
    issues: ForensicIssue[];
    confidenceDistribution: {
        high: number; // >90% sure
        medium: number; // >70% sure
        low: number; // <70% sure
    };
}

export interface TaxEngineConfig {
    strategy: 'FIFO' | 'LIFO' | 'HIFO' | 'SPEC_ID' | 'AVG_COST';
    isRealTime: boolean;
    includeDeFi: boolean;
    includeNFTs: boolean;
    country: string;
    engineVersion: string; // e.g. "Rust v1.4.2"
}

export interface TaxEngineStatus {
    status: 'ONLINE' | 'OFFLINE' | 'SYNCING';
    lastSync: string;
    transactionsProcessed: number;
    processingSpeed: number; // tx/sec
    uptime: number;
}

export interface DeFiProtocol {
    name: string;
    chain: string;
    type: 'DEX' | 'LENDING' | 'YIELD';
    tvl: number;
    userBalanceUsd: number;
    unclaimedRewardsUsd: number;
}

// PREDICTIVE AI TYPES
export interface TaxPrediction {
    month: string;
    estimatedRevenue: number;
    estimatedCost: number;
    estimatedTax: number;
    type: 'ACTUAL' | 'PREDICTED';
    confidenceInterval?: [number, number]; // Low, High
}

export interface LegislativeAlert {
    id: string;
    title: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    effectiveDate: string;
    source: string;
}

export interface ScenarioConfig {
    revenueGrowth: number; // %
    costIncrease: number; // %
    inflation: number; // %
}

// REAL ESTATE & LOANS TYPES
export interface RealEstateProperty {
    id: string;
    name: string;
    type: 'APARTMENT' | 'OFFICE' | 'LAND';
    address: string;
    purchaseValue: number;
    currentValue: number;
    rentalIncomeMonthly: number;
    occupancyStatus: 'RENTED' | 'VACANT';
    taxation: 'LUMP_SUM' | 'SCALE';
    roi: number;
    image?: string;
}

export interface Loan {
    id: string;
    name: string;
    type: 'MORTGAGE' | 'LEASING' | 'CASH_LOAN';
    bank: string;
    totalAmount: number;
    remainingAmount: number;
    nextInstallmentDate: string;
    nextInstallmentAmount: number;
    interestRate: number;
    currency: string;
    endDate: string;
}

// GLOBAL / CROSS BORDER TAX TYPES
export interface CountryTaxProfile {
    countryCode: string; // ISO 2-char
    name: string;
    flag: string; // emoji or url
    taxRateCorporate: number;
    taxRatePersonal: number[]; // Brackets
    hasDttWithPl: boolean; // Double Tax Treaty
    dttMethod: 'EXEMPTION_WITH_PROGRESSION' | 'PROPORTIONAL_DEDUCTION' | 'NONE'; // Metoda unikania
}

export interface ForeignIncome {
    country: string;
    amountForeignCurrency: number;
    currency: string;
    taxPaidForeignCurrency: number;
    type: 'EMPLOYMENT' | 'DIVIDENDS' | 'CAPITAL_GAINS';
}

export interface CrossBorderResult {
    plTaxBase: number;
    foreignTaxBasePln: number;
    plTaxDue: number;
    foreignTaxPaidPln: number;
    effectiveRate: number;
    taxCreditUsed: number;
    additionalPaymentPl: number; // Dopłata w Polsce
    methodUsed: string;
}

// TAX OPTIMIZER (AUTO-HEDGING) TYPES
export interface TaxOptimizationOpportunity {
    id: string;
    asset: string;
    currentPrice: number;
    purchasePrice: number;
    unrealizedLoss: number;
    quantity: number;
    type: 'CRYPTO' | 'STOCK';
    strategy: 'HARVEST_LOSS' | 'WASH_SALE_AVOIDANCE' | 'DONATION';
    potentialTaxSavings: number;
}
