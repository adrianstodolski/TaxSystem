
import { LucideIcon } from 'lucide-react';

// --- WORKSPACES ---
export enum Workspace {
    BUSINESS = 'BUSINESS', // Firma, VAT, CIT, Kadry
    INVESTOR = 'INVESTOR', // Krypto, Giełda, Majątek (Wealth)
    WALLET = 'WALLET'      // Hardware & Web Wallet Control Center
}

// --- ENUMS & CORE TYPES ---

export enum ViewState {
    // === SHARED / GLOBAL ===
    DASHBOARD = 'DASHBOARD',
    SETTINGS = 'SETTINGS',
    NOTIFICATIONS = 'NOTIFICATIONS',
    HELP_CENTER = 'HELP_CENTER',
    SYSTEM_STATUS = 'SYSTEM_STATUS',
    DEV_PORTAL = 'DEV_PORTAL',
    INTEGRATIONS = 'INTEGRATIONS',
    MARKETPLACE = 'MARKETPLACE',
    HISTORY = 'HISTORY',
    DESIGN_SYSTEM = 'DESIGN_SYSTEM',
    DESIGN_LAB_TEST = 'DESIGN_LAB_TEST',
    
    // === BUSINESS WORKSPACE (Firma) ===
    PREDICTIVE_TAX = 'PREDICTIVE_TAX',
    RISK_CENTER = 'RISK_CENTER',
    ESG = 'ESG',
    YAPILY_CONNECT = 'YAPILY_CONNECT',
    TREASURY = 'TREASURY',
    SMART_TREASURY = 'SMART_TREASURY',
    NUFFI_PAY = 'NUFFI_PAY',
    LOANS = 'LOANS',
    CARDS = 'CARDS',
    CASH_REGISTER = 'CASH_REGISTER',
    DOCUMENTS = 'DOCUMENTS',
    CONTRACTORS = 'CONTRACTORS',
    ECOMMERCE = 'ECOMMERCE',
    PRICE_CALCULATOR = 'PRICE_CALCULATOR',
    DEBT_COLLECTOR = 'DEBT_COLLECTOR',
    SUBSCRIPTIONS = 'SUBSCRIPTIONS',
    PROJECTS = 'PROJECTS',
    WAREHOUSE = 'WAREHOUSE',
    ASSETS = 'ASSETS',
    VEHICLES = 'VEHICLES',
    CONTRACTS = 'CONTRACTS',
    PAYROLL = 'PAYROLL',
    TIME_TRACKER = 'TIME_TRACKER',
    BUSINESS_TRAVEL = 'BUSINESS_TRAVEL',
    TAX_WIZARD = 'TAX_WIZARD',
    GENERAL_LEDGER = 'GENERAL_LEDGER',
    INTERNATIONAL = 'INTERNATIONAL',
    AUDIT_DEFENDER = 'AUDIT_DEFENDER',
    REPORTS = 'REPORTS',
    CAP_TABLE = 'CAP_TABLE',
    AUDIT_SNAPSHOTS = 'AUDIT_SNAPSHOTS',

    // === INVESTOR WORKSPACE (Prywatne / Krypto) ===
    WAR_ROOM = 'WAR_ROOM',
    LEDGERVERSE = 'LEDGERVERSE',
    CRYPTO_HUB = 'CRYPTO_HUB',
    YIELD_SCOUT = 'YIELD_SCOUT',
    DEFI_ARCHEOLOGY = 'DEFI_ARCHEOLOGY',
    TOKEN_SCANNER = 'TOKEN_SCANNER',
    WEALTH = 'WEALTH',
    DERIVATIVES = 'DERIVATIVES',
    BONDS = 'BONDS',
    REAL_ESTATE = 'REAL_ESTATE',
    WHALE_WATCHER = 'WHALE_WATCHER',
    MARKET_INTEL = 'MARKET_INTEL',
    TAX_ENGINE = 'TAX_ENGINE',
    TAX_OPTIMIZER = 'TAX_OPTIMIZER',
    GLOBAL_TAX = 'GLOBAL_TAX',
    DIVIDENDS = 'DIVIDENDS',
    FOREX = 'FOREX',
    COMMODITIES = 'COMMODITIES',
    TAX_OPTIMIZER_PRO = 'TAX_OPTIMIZER',
    
    // === WALLET WORKSPACE (Hardware/Web3 Direct) ===
    WALLET_DASHBOARD = 'WALLET_DASHBOARD',
    WALLET_SEND = 'WALLET_SEND',
    WALLET_RECEIVE = 'WALLET_RECEIVE',
    WALLET_SWAP = 'WALLET_SWAP',
    WALLET_BRIDGE = 'WALLET_BRIDGE',
    WALLET_STAKING = 'WALLET_STAKING', // NEW
    WALLET_NFTS = 'WALLET_NFTS',       // NEW
    WALLET_HISTORY = 'WALLET_HISTORY', // NEW
    WALLET_DAPPS = 'WALLET_DAPPS',     // NEW
    WALLET_DEVICE = 'WALLET_DEVICE',
    
    // Legacy / Extras
    EXPORT = 'EXPORT',
    B2B_NETWORK = 'B2B_NETWORK', 
    FORENSICS = 'FORENSICS', 
    ACCOUNTANT_DASHBOARD = 'ACCOUNTANT_DASHBOARD',
    AI_CLASSIFIER = 'AI_CLASSIFIER',
    SMART_RULES = 'SMART_RULES',
    IMPORT_WIZARD = 'IMPORT_WIZARD',
    MAILBOX = 'MAILBOX',
    SCENARIOS = 'SCENARIOS',
    BUDGETS = 'BUDGETS'
}

export type CalculationMethod = 'FIFO' | 'LIFO' | 'HIFO' | 'AVCO' | 'SPECID';

export interface NavItem {
    view: ViewState;
    label: string;
    icon: any; 
    badge?: string;
}

export interface NavSection {
    id: string;
    title: string;
    icon: any;
    items: NavItem[];
}

export enum TaxStatus {
    CALCULATED = 'CALCULATED',
    SIGNED = 'SIGNED',
    SUBMITTED = 'SUBMITTED',
    PAID = 'PAID',
    PENDING = 'PENDING',
    DRAFT = 'DRAFT'
}

export type IntegrationStatus = 'IDLE' | 'CONNECTING' | 'AUTHENTICATING' | 'FETCHING' | 'SUCCESS' | 'ERROR';

export type NotificationType = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';

export enum AssetCategory {
    COMPUTER = 'COMPUTER',
    PHONE = 'PHONE',
    CAR = 'CAR',
    FURNITURE = 'FURNITURE',
    SOFTWARE = 'SOFTWARE',
    OTHER = 'OTHER'
}

export enum ApiProvider {
    SALT_EDGE = 'SALT_EDGE',
    TINK = 'TINK',
    TRUELAYER = 'TRUELAYER'
}

// --- MARKET INTEL TYPES ---
export interface MarketNews {
    id: string;
    source: string;
    title: string;
    sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    impactScore: number; // 0-100
    time: string;
    tickers: string[];
}

export interface CapitalFlow {
    from: string;
    to: string;
    amount24h: number;
    trend: 'UP' | 'DOWN';
}

export interface AssetBubble {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    rank: number;
    // Extended properties for pro view
    rsi?: number;
    fdv?: number;
    smartMoneyFlow?: 'INFLOW' | 'OUTFLOW';
}

// --- CORE ENGINE TYPES ---

export interface TaxLot {
    id: string;
    date: string;
    amount: number;
    costBasis: number;
    remaining: number;
    sourceTxId: string;
    asset: string;
}

export interface EngineSnapshot {
    date: string;
    inventory: Record<string, TaxLot[]>;
    realizedGains: number;
    unrealizedGains: number;
    taxDue: number;
    warnings: string[];
}

// --- BEHAVIORAL / FORENSICS ---

export interface InvestmentDNA {
    fomoScore: number;
    panicSellRate: number;
    diamondHandsScore: number;
    riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'DEGEN';
    topBadHabit: string;
}

export interface ForensicsSummary {
    totalIssues: number;
    riskScore: number;
    issues: ForensicIssue[];
    confidenceDistribution: {
        high: number;
        medium: number;
        low: number;
    };
    dna: InvestmentDNA;
}

export interface ForensicIssue {
    id: string;
    type: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    affectedAssets: string[];
    confidence: number;
    date: string;
}

// --- CRYPTO & EXCHANGE TYPES ---

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
    exchange: CryptoExchange | string;
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

export interface TaxEngineConfig {
    strategy: CalculationMethod;
    isRealTime: boolean;
    includeDeFi: boolean;
    includeNFTs: boolean;
    country: string;
    engineVersion: string;
}

export interface TaxEngineStatus {
    status: 'ONLINE' | 'OFFLINE' | 'SYNCING';
    lastSync: string;
    transactionsProcessed: number;
    processingSpeed: number;
    uptime: number;
}

// --- GRAPH / LEDGERVERSE ---
export interface GraphNode {
    id: string;
    label: string;
    type: 'WALLET' | 'BANK' | 'EXCHANGE' | 'CONTRACT' | 'TAX_OFFICE';
    balance: number;
    currency: string;
    x: number;
    y: number;
    riskScore?: number;
}

export interface GraphLink {
    source: string;
    target: string;
    value: number;
    type: 'TRANSFER' | 'SWAP' | 'PAYMENT';
    active: boolean;
}

// --- YIELD SCOUT ---
export interface YieldOpportunity {
    id: string;
    protocol: string;
    chain: string;
    asset: string;
    apy: number;
    tvl: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    impermanentLossRisk: number; // 0-100
    auditStatus: 'AUDITED' | 'UNAUDITED';
    projectedEarnings: number; // Monthly
}

// --- WAR ROOM ---
export interface MarketSentiment {
    overall: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    score: number; // 0-100
    fearGreedIndex: number;
    socialVolume: number;
    trendingTopics: string[];
}

export interface WarRoomWidget {
    id: string;
    type: 'CHART' | 'NEWS' | 'ORDERBOOK' | 'TAX_IMPACT';
    symbol: string;
}

// --- SMART TREASURY ---
export interface TreasuryStrategy {
    id: string;
    name: string;
    risk: 'LOW' | 'MEDIUM';
    apy: number;
    liquidity: 'INSTANT' | 'T+1' | 'T+2';
    allocation: number; // %
    assetType: 'GOV_BONDS' | 'MONEY_MARKET' | 'STABLECOIN_YIELD';
}

// --- USER & SYSTEM ---

export enum SubscriptionPlan {
    FREE = 'FREE',
    PRO = 'PRO',
    ENTERPRISE = 'ENTERPRISE'
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    nip: string;
    pesel: string;
    taxOfficeCode: string;
    taxationForm: string;
    cryptoStrategy: CalculationMethod;
    kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
    companyName: string;
    companyAddress: string;
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

export interface AmortizationSchedule {
    year: number;
    month: number;
    writeOffAmount: number;
    remainingValue: number;
    accumulated: number;
}

export interface CeidgCompany {
    name: string;
    nip: string;
    regon: string;
    address: string;
    status: string;
    verifiedIban?: string;
    isNuffiUser: boolean;
}

// --- MOCK / PLACEHOLDER INTERFACES ---
export interface BankAccount { id: string; providerName: string; balance: number; currency: string; type: string; colorTheme: string; accountNumber: string; aggregator?: string; isVirtual?: boolean; logo?: string; }
export interface Transaction { id: string; date: string; description: string; amount: number; category: string; bankId: string; }
export interface Invoice { id: string; ksefNumber: string; contractor: string; nip: string; date: string; amountNet: number; amountVat: number; amountGross: number; type: 'SALES' | 'PURCHASE'; status: string; currency: string; costCategory?: string; aiAuditScore?: number; aiAuditNotes?: string; items?: any[]; docuSignStatus?: string; }
export interface StockAsset { symbol: string; name: string; type: string; quantity: number; avgPrice: number; currentPrice: number; currency: string; valuePln: number; pnl: number; pnlPercent: number; }
export interface RealEstateProperty { id: string; name: string; type: string; address: string; currentValue: number; rentalIncomeMonthly: number; occupancyStatus: 'RENTED' | 'VACANT'; roi: number; purchaseValue: number; taxation: string; }
export interface EsgScore { totalCo2Tons: number; breakdown: any; treesNeeded: number; trend: string; }
export interface RiskAssessment { globalScore: number; categories: any[]; criticalAlerts: string[]; }
export interface TaxPrediction { month: string; estimatedRevenue: number; estimatedCost: number; estimatedTax: number; type: 'ACTUAL' | 'PREDICTED'; }
export interface LegislativeAlert { id: string; title: string; impact: string; description: string; effectiveDate: string; source: string; }
export interface UnifiedLedgerItem { id: string; date: string; source: string; provider: string; description: string; amountPln: number; direction: string; taxCategory: string; reconciled: boolean; tags: string[]; }
export interface Contract { id: string; name: string; party: string; type: string; status: string; value?: number; currency: string; endDate?: string; autoRenewal: boolean; startDate: string; noticePeriod: string; tags: string[]; }
export interface MarketplaceItem { id: string; category: string; title: string; provider: string; description: string; price: string; icon: string; recommended?: boolean; }
export interface Notification { id: string; type: NotificationType; title: string; message: string; read: boolean; timestamp: string; action?: any; }
export interface ApiVaultStatus { provider: string; isConnected: boolean; lastChecked: string; featuresUnlocked: string[]; }
export interface TaxReturn { id: string; year: number; type: string; income: number; taxDue: number; status: TaxStatus; breakdown?: any; submissionDate?: string; upoId?: string; }
export interface ChatMessage { id: string; role: string; text: string; timestamp: Date; }
export interface TaxOffice { code: string; name: string; }
export interface AuditEntry { id: string; action: string; date: string; status: string; }
export interface TeamMember { id: string; firstName: string; lastName: string; email: string; role: string; status: string; lastActive: string; }
export type UserRole = 'ADMIN' | 'ACCOUNTANT' | 'ANALYST' | 'VIEWER';
export interface RecurringInvoice { id: string; templateName: string; contractor: any; frequency: string; nextIssueDate: string; amountNet: number; active: boolean; }
export interface RecurringSuggestion { contractorName: string; nip: string; detectedFrequency: string; confidence: number; potentialSavingsTime: string; }
export interface NbpTable { tableNo: string; effectiveDate: string; rate: number; currency: string; }
export interface InvoiceItem { name: string; quantity: number; unitPriceNet: number; totalNet: number; vatRate: number; }
export interface CryptoWallet { id: string; provider: string; address: string; chain: string; assetCount: number; riskScore: number; }
export interface DeFiProtocol { name: string; chain: string; type: string; tvl: number; userBalanceUsd: number; unclaimedRewardsUsd: number; }
export interface GoldRushTx { hash: string; }
export interface NFTAsset { id: string; collection: string; tokenId: string; name: string; imageUrl: string; floorPrice: number; purchasePrice: number; gasFee: number; purchaseDate: string; status: string; realizedPnL?: number; soldPrice?: number; }
export interface Asset { id: string; name: string; category: AssetCategory; purchaseDate: string; initialValue: number; currentValue: number; amortizationRate: number; schedule: AmortizationSchedule[]; }
export interface Contractor { id: string; name: string; nip: string; totalSales: number; totalPurchases: number; invoiceCount: number; lastInteraction: string; isNuffiUser: boolean; risk: any; }
export interface WhiteListStatus { status: string; requestId: string; }
export interface FinancialReport { period: string; lines: any[]; }
export interface CalendarEvent { id: string; date: string; title: string; amount: number; type: string; status: string; }
export interface Budget { id: string; category: string; limit: number; spent: number; forecast: number; status: string; percentUsed: number; }
export enum ExportFormat { JPK_V7 = 'JPK_V7', KPIR_PDF = 'KPIR_PDF', KPIR_CSV = 'KPIR_CSV' }
export interface DirectDebitMandate { id: string; creditorName: string; status: string; }
export interface FinancialHealthScore { score: number; riskLevel: string; affordabilityRating: string; monthlyDisposableIncome: number; debtToIncomeRatio: number; }
export interface TransferRequest { fromAccountId: string; amount: number; recipientName: string; recipientIban?: string; title?: string; type?: string; currency?: string; }
export interface BulkPaymentBatch { id: string; totalAmount: number; count: number; status: string; }
export interface VrpConfig { id: string; beneficiary: string; maxAmountPerPeriod: number; period: string; active: boolean; }
export interface AccountVerification { matchStatus: string; confidenceScore: number; }
export interface GusData { name: string; street?: string; propertyNumber?: string; apartmentNumber?: string; city: string; zipCode: string; nip: string; regon: string; startDate?: string; pkd?: string; pkdDesc?: string; vatStatus?: string; legalForm?: string; representatives?: string[]; shareCapital?: number; krs?: string; history?: any[]; }
export interface ExchangeRate { pair: string; mid: number; bid: number; ask: number; changePercent: number; timestamp?: string; }
export interface FxPosition { id: string; pair: string; type: string; amount: number; avgRate: number; valuePln: number; unrealizedPnL: number; }
export interface LedgerEntry { id: string; date: string; provider: string; amount: number; currency: string; status: string; direction: string; metadata: any; }
export interface Project { id: string; name: string; client: string; status: string; budget: number; spent: number; revenue: number; startDate: string; tags: string[]; profitMargin: number; }
export interface VirtualCard { id: string; last4: string; holderName: string; expiry: string; type: string; status: string; limitMonthly: number; spentMonthly: number; brand: string; color: string; }
export interface Employee { id: string; firstName: string; lastName: string; position: string; salaryAmount: number; contractType: string; status: string; joinDate: string; }
export interface PayrollEntry { employeeId: string; employeeName: string; contractType: string; salaryGross: number; employerCostTotal: number; salaryNet: number; zusEmployer: number; zusEmployee: number; healthInsurance: number; pitAdvance: number; }
export interface Product { id: string; sku: string; name: string; category: string; quantity: number; unit: string; priceNet: number; priceSell: number; vatRate: number; minLevel: number; }
export interface WarehouseDocument { id: string; number: string; date: string; type: string; contractorName?: string; totalValueNet: number; }
export interface Vehicle { id: string; name: string; licensePlate: string; type: string; vatDeduction: string; mileageCurrent: number; insuranceExpiry: string; inspectionExpiry: string; }
export interface Order { id: string; platformId: string; platformOrderId: string; date: string; customer: string; totalGross: number; commissionFee: number; status: string; fiscalized: boolean; }
export interface OssTransaction { id: string; source: string; date: string; countryCode: string; amountEur: number; }
export interface OssCountryReport { countryCode: string; countryName: string; standardRate: number; totalNetEur: number; totalVatEur: number; }
export interface IntrastatThreshold { type: string; limit: number; currentValue: number; status: string; }
export interface AuditPackage { id: string; hash: string; status: string; }
export interface IndustryStat { sector: string; avgRevenue: number; avgCost: number; }
export interface MacroIndicator { name: string; value: number; unit: string; trend: string; date: string; }
export interface MarketComparison { metric: string; myValue: number; marketValue: number; difference: number; status: string; }
export interface ScenarioConfig { revenueGrowth: number; costIncrease: number; inflation: number; }
export interface Loan { id: string; name: string; type: string; bank: string; totalAmount: number; remainingAmount: number; nextInstallmentDate: string; nextInstallmentAmount: number; interestRate: number; endDate: string; }
export interface CountryTaxProfile { countryCode: string; name: string; flag: string; taxRateCorporate: number; dttMethod: string; taxRatePersonal?: number[]; hasDttWithPl?: boolean; }
export interface ForeignIncome { country: string; amountForeignCurrency: number; currency: string; taxPaidForeignCurrency: number; type: string; }
export interface CrossBorderResult { plTaxBase: number; foreignTaxBasePln: number; plTaxDue: number; foreignTaxPaidPln: number; effectiveRate: number; taxCreditUsed: number; additionalPaymentPl: number; methodUsed: string; }
export interface TaxOptimizationOpportunity { id: string; asset: string; currentPrice: number; purchasePrice: number; unrealizedLoss: number; quantity: number; type: string; strategy: string; potentialTaxSavings: number; }
export interface Dividend { id: string; ticker: string; companyName: string; paymentDate: string; amountGross: number; currency: string; whtRate: number; taxPaidForeign: number; taxDuePl: number; status: string; country: string; }
export interface ClientProfile { id: string; name: string; nip: string; status: string; documentsToProcess: number; vatStatus: string; pitStatus: string; lastActivity: string; monthProgress: number; }
export interface UnclassifiedTransaction { id: string; date: string; description: string; amount: number; currency: string; confidence: number; aiSuggestion: any; source: string; }
export interface MerchantStats { totalVolume: number; txCount: number; activeLinks: number; cryptoVolume: number; }
export interface MerchantTx { id: string; amount: number; currency: string; method: string; status: string; customerEmail: string; date: string; description: string; }
export interface AutomationRule { id: string; name: string; trigger: string; condition: string; conditionValue: any; action: string; active: boolean; lastTriggered?: string; }
export interface ImportJob { id: string; fileName: string; totalRows: number; preview: any[]; headers: string[]; }
export interface CsvMapping { fileHeader: string; systemField: string; confidence: number; }
export interface TxAnalysisResult { hash: string; timestamp: string; nodes: any[]; links: any[]; taxVerdict: string; complexityScore: number; gasUsedEth: number; }
export interface TaxSnapshot { id: string; name: string; createdAt: string; createdBy: string; period: string; hash: string; dataSize: string; status: string; tags: string[]; }
export interface TimeEntry { id: string; projectId: string; projectName: string; description: string; startTime: string; endTime?: string; durationSeconds: number; billable: boolean; hourlyRate: number; status: string; }
export interface EmailMessage { id: string; sender: string; subject: string; date: string; preview: string; hasAttachment: boolean; isRead: boolean; aiTags: string[]; }
export interface TokenSecurity { address: string; name: string; symbol: string; riskScore: number; issues: any[]; isHoneypot: boolean; ownershipRenounced: boolean; liquidityLocked: boolean; }
export interface Subscription { id: string; name: string; cost: number; currency: string; billingCycle: string; nextPayment: string; status: string; logo: string; usageScore: number; }
export interface WhaleWallet { address: string; label: string; balanceUsd: number; chain: string; tags: string[]; }
export interface WhaleTx { id: string; hash: string; timestamp: string; fromAddress: string; fromLabel?: string; toAddress: string; toLabel?: string; amount: number; token: string; valueUsd: number; type: string; }
export interface DebtCase { id: string; debtorName: string; nip: string; invoiceNumber: string; amount: number; dueDate: string; daysOverdue: number; status: string; statutoryInterest: number; lastActionDate?: string; }
export interface Shareholder { id: string; name: string; role: string; shares: number; percentage: number; joinedDate: string; investedAmount?: number; }
export interface BusinessTrip { id: string; employeeName: string; destination: string; startDate: string; endDate: string; purpose: string; status: string; totalCost: number; perDiem: number; transportCost: number; accommodationCost: number; }
export interface CashDocument { id: string; number: string; date: string; type: string; contractor: string; description: string; amount: number; balanceAfter: number; }
export interface DerivativePosition { id: string; symbol: string; type: string; side: string; strike: number; expiration: string; quantity: number; avgPrice: number; currentPrice: number; underlyingPrice: number; pnl: number; greeks: any; }
export interface BondPosition { id: string; isin: string; name: string; type: string; faceValue: number; quantity: number; couponRate: number; inflationIndexed: boolean; maturityDate: string; nextCouponDate: string; nextCouponAmount: number; yieldToMaturity: number; currentValue: number; }
export interface UserApiKey { id: string; prefix: string; name: string; created: string; lastUsed: string; type: string; permissions: string[]; }
export interface ApiUsageStats { totalRequests: number; errorRate: number; avgLatency: number; history: any[]; }
export interface SystemComponent { name: string; status: string; uptime: number; description: string; }
export interface Incident { id: string; title: string; status: string; impact: string; createdAt: string; updates: any[]; }
export interface SystemStatusData { globalStatus: string; components: SystemComponent[]; incidents: Incident[]; }
export interface HelpCategory { id: string; name: string; description: string; icon: string; }
export interface HelpArticle { id: string; categoryId: string; title: string; description: string; content: string; readTime: string; icon: string; }
export interface AgentMessage { id: string; sender: string; text: string; timestamp: Date; }
export enum CostCategory { OPERATIONAL_100 = 'OPERATIONAL_100', FUEL_75 = 'FUEL_75', REPRESENTATION_0 = 'REPRESENTATION_0' }
export enum TaxationForm { GENERAL_SCALE = 'GENERAL_SCALE', FLAT_RATE = 'FLAT_RATE', LUMP_SUM = 'LUMP_SUM' }
export enum TaxFormType { PIT_37 = 'PIT-37', PIT_38 = 'PIT-38', PIT_36 = 'PIT-36', PIT_36L = 'PIT-36L', PIT_28 = 'PIT-28' }
export interface SimulationParams { amountGross: number; vatRate: number; category: any; taxationForm: any; }
export interface SimulationResult { amountNet: number; vatTotal: number; vatDeductible: number; vatNonDeductible: number; pitCostBasis: number; pitDeductibleAmount: number; pitTaxShield: number; totalSavings: number; realCost: number; percentSaved: number; }
export interface AuditRiskFactor { id: string; category: string; title: string; description: string; severity: string; detected: boolean; }
export interface SearchResult { id: string; type: string; title: string; subtitle: string; targetView?: ViewState; }

export interface DeFiReward { protocol: string; amount: number; token: string; valueUsd: number; }
export interface TaxHarvestingOpp { asset: string; loss: number; }
export interface CryptoAnalytics { volume: number; pnl: number; }
export interface WalletRiskProfile { score: number; warnings: string[]; }
export interface ImpermanentLossResult { pair: string; loss: number; }
export interface WalletDna { type: string; }
export interface StreamEvent { type: string; data: any; }
export interface TokenGodMode { canMint: boolean; canBurn: boolean; }
export interface TokenAllowance { spender: string; amount: number; }
export interface NftCollectionStat { floorPrice: number; volume: number; }
