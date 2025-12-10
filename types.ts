
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
  PRICING = 'PRICING',
  PROJECTS = 'PROJECTS',
  CARDS = 'CARDS',
  PAYROLL = 'PAYROLL',
  WAREHOUSE = 'WAREHOUSE',
  VEHICLES = 'VEHICLES',
  ECOMMERCE = 'ECOMMERCE',
  INTERNATIONAL = 'INTERNATIONAL',
  AUDIT_DEFENDER = 'AUDIT_DEFENDER',
  MARKET_INTEL = 'MARKET_INTEL'
}

export enum TaxFormType {
  PIT_36 = 'PIT-36',
  PIT_37 = 'PIT-37',
  PIT_38 = 'PIT-38',
}

export enum TaxStatus {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  SIGNED = 'SIGNED',
  SUBMITTED = 'SUBMITTED',
  PAID = 'PAID',
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

export interface VatSummary {
  outputVat: number;
  inputVat: number;
  vatDue: number;
}

export interface BankAccount {
  id: string;
  providerName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  lastSync: string;
  type: 'BUSINESS' | 'SAVINGS' | 'MULTI_CURRENCY' | 'RAILSR_VIRTUAL';
  colorTheme: string;
  logo?: string;
  isVirtual?: boolean;
  aggregator?: 'SALT_EDGE' | 'TINK' | 'TRUELAYER';
}

export interface CryptoWallet {
  id: string;
  provider: 'Moralis' | 'Nansen' | 'Alchemy' | 'QuickNode';
  address: string;
  chain: string;
  assetCount: number;
  riskScore?: number;
}

export interface TaxReturn {
  id: string;
  year: number;
  type: TaxFormType;
  income: number;
  taxDue: number;
  breakdown?: TaxBreakdown;
  status: TaxStatus;
  submissionDate?: string;
  upoId?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'INCOME' | 'EXPENSE' | 'TAX';
  bankId?: string;
  merchantLogo?: string;
}

export enum CostCategory {
  OPERATIONAL_100 = 'OPERATIONAL_100',
  FUEL_75 = 'FUEL_75',
  REPRESENTATION_0 = 'REPRESENTATION_0',
  EQUIPMENT = 'EQUIPMENT',
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPriceNet: number;
  totalNet: number;
  vatRate: number;
}

export interface Invoice {
  id: string;
  ksefNumber: string;
  contractor: string;
  nip: string;
  date: string;
  currency: string;
  exchangeRate?: number;
  amountNet: number;
  amountVat: number;
  amountGross: number;
  type: 'SALES' | 'PURCHASE';
  status: 'PROCESSED' | 'PENDING' | 'DRAFT_XML' | 'SENT_TO_MF';
  costCategory?: CostCategory;
  items?: InvoiceItem[];
  ksefValidationStatus?: 'VALID' | 'INVALID' | 'UNKNOWN';
  isNuffiNetwork?: boolean;
  remindersSent?: number;
  aiAuditScore?: number;
  aiAuditNotes?: string;
  projectId?: string;
  docuSignStatus?: 'SENT' | 'SIGNED' | 'NONE';
}

export interface RecurringInvoice {
    id: string;
    templateName: string;
    contractor: Contractor;
    frequency: 'MONTHLY' | 'WEEKLY' | 'QUARTERLY';
    nextIssueDate: string;
    amountNet: number;
    active: boolean;
}

export interface RecurringSuggestion {
    contractorName: string;
    nip: string;
    detectedFrequency: 'MONTHLY';
    confidence: number;
    potentialSavingsTime: string;
}

export interface NbpTable {
    tableNo: string;
    effectiveDate: string;
    rate: number;
    currency: string;
}

export type IntegrationStatus = 'IDLE' | 'CONNECTING' | 'AUTHENTICATING' | 'FETCHING' | 'SUCCESS' | 'ERROR';

export interface TaxOffice {
  code: string;
  name: string;
  nameShort?: string;
}

export enum TaxationForm {
  GENERAL_SCALE = 'Zasady Ogólne (Skala)',
  FLAT_RATE = 'Podatek Liniowy (19%)',
  LUMP_SUM = 'Ryczałt Ewidencjonowany',
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  pesel: string;
  nip: string;
  email: string;
  taxOfficeCode: string;
  taxationForm: TaxationForm;
  cryptoStrategy: 'FIFO' | 'LIFO' | 'HIFO';
  companyName?: string;
  companyAddress?: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'NONE';
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export type NotificationType = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';

export interface NotificationAction {
    label: string;
    actionType: 'NAVIGATE' | 'ACTION';
    target?: ViewState;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp?: string;
  read?: boolean;
  action?: NotificationAction;
}

export type SearchResultType = 'INVOICE' | 'CONTRACTOR' | 'ASSET' | 'VIEW' | 'ACTION' | 'PROJECT';

export interface SearchResult {
    id: string;
    type: SearchResultType;
    title: string;
    subtitle: string;
    targetView?: ViewState;
    metadata?: any;
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

export enum AssetCategory {
  COMPUTER = 'Komputery (30%)',
  PHONE = 'Telefony (20%)',
  CAR = 'Samochody (20%)',
  FURNITURE = 'Meble (20%)',
  SOFTWARE = 'WNiP (50%)',
  OTHER = 'Inne (10%)'
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
  status: 'ACTIVE' | 'FULLY_AMORTIZED' | 'SOLD';
  schedule: AmortizationSchedule[];
}

export interface CashFlowPoint {
  date: string;
  balance: number;
  type: 'HISTORICAL' | 'PROJECTED';
}

export interface ContractorRisk {
  dependency: 'LOW' | 'MEDIUM' | 'HIGH';
  whiteListStatus: 'VERIFIED' | 'WARNING' | 'UNKNOWN';
}

export interface Contractor {
  id: string;
  name: string;
  nip: string;
  totalSales: number;
  totalPurchases: number;
  invoiceCount: number;
  lastInteraction: string;
  risk: ContractorRisk;
  bankAccount?: string;
  isNuffiUser?: boolean;
}

export type EventType = 'ZUS' | 'VAT' | 'PIT' | 'OTHER';

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  amount: number;
  type: EventType;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
}

export interface FinancialReportLine {
  label: string;
  value: number;
  type: 'REVENUE' | 'COST' | 'PROFIT' | 'TAX' | 'CALCULATION';
  indent: number;
  isBold?: boolean;
  highlight?: boolean;
}

export interface FinancialReport {
  period: string;
  generatedAt: string;
  lines: FinancialReportLine[];
}

export type BudgetStatus = 'SAFE' | 'WARNING' | 'EXCEEDED';

export interface Budget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    forecast: number;
    status: BudgetStatus;
    percentUsed: number;
}

export interface AuditEntry {
  id: string;
  date: string;
  action: string;
  ip: string;
  device: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE';
}

export enum ExportFormat {
  JPK_V7 = 'JPK_V7 (XML)',
  KPIR_PDF = 'KPiR (PDF)',
  KPIR_CSV = 'KPiR (Excel/CSV)',
  ASSETS_PDF = 'Ewidencja ŚT (PDF)'
}

export enum CryptoExchange {
  BINANCE = 'BINANCE',
  COINBASE = 'COINBASE',
  KRAKEN = 'KRAKEN',
  BYBIT = 'BYBIT',
  MEXC = 'MEXC',
  OKX = 'OKX'
}

export enum CryptoTransactionType {
  SPOT_BUY = 'SPOT_BUY',
  SPOT_SELL = 'SPOT_SELL',
  FUTURES_PNL = 'FUTURES_PNL',
  FUNDING_FEE = 'FUNDING_FEE',
  STAKING_REWARD = 'STAKING_REWARD'
}

export interface CryptoTransaction {
  id: string;
  exchange: CryptoExchange;
  timestamp: string;
  type: CryptoTransactionType;
  pair?: string;
  amount: number;
  price: number;
  totalFiat: number;
  feeFiat: number;
  realizedPnL?: number;
}

export interface CryptoTaxReport {
  year: number;
  strategy: 'FIFO' | 'LIFO';
  spotIncome: number;
  spotCost: number;
  spotIncomeTaxBase: number;
  futuresIncome: number;
  futuresCost: number;
  futuresIncomeTaxBase: number;
  totalTaxDue: number;
  transactionsProcessed: number;
}

export interface DeFiReward {
    id: string;
    protocol: string;
    token: string;
    amount: number;
    valuePln: number;
    date: string;
    type: 'STAKING' | 'AIRDROP' | 'LIQUIDITY_MINING';
}

export interface TaxHarvestingOpp {
    asset: string;
    unrealizedLoss: number;
    currentValue: number;
    potentialTaxSavings: number;
}

export interface NFTAsset {
    id: string;
    collection: string;
    name: string;
    imageUrl: string;
    boughtAt: number;
    floorPrice: number;
    pnl: number;
    chain: 'ETH' | 'SOL' | 'MATIC';
    provider?: 'Moralis' | 'Alchemy';
}

export interface CryptoAnalytics {
    totalPnl: number;
    winRate: number;
    bestTrade: { pair: string; pnl: number };
    worstTrade: { pair: string; pnl: number };
    volume: number;
    tradesCount: number;
}

export interface WalletRiskProfile {
    address: string;
    score: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    issues: string[];
    provider?: 'Nansen' | 'GoldRush';
}

export interface ImpermanentLossResult {
    initialValue: number;
    holdValue: number;
    poolValue: number;
    impermanentLoss: number;
    impermanentLossPercent: number;
}

export interface GoldRushTx {
    txHash: string;
    blockSignedAt: string;
    blockHeight: number;
    gasSpent: number;
    gasQuote: number;
    successful: boolean;
    fromAddress: string;
    toAddress: string;
    value: string;
    prettyValue: string;
    logoUrl: string;
}

export interface WalletDna {
    address: string;
    labels: string[];
    netWorthUsd: number;
    topHoldings: { token: string; pct: number }[];
    ageDays: number;
    volume30d: number;
}

export interface StreamEvent {
    id: string;
    type: 'TX_IN' | 'TX_OUT' | 'NFT_TRANSFER';
    summary: string;
    timestamp: string;
    value: string;
    chain: string;
}

export interface NftCollectionStat {
    id: string;
    name: string;
    image: string;
    floorPrice: number;
    volume24h: number;
    change24h: number;
    smartMoneyBuys: number;
}

export interface TokenGodMode {
    symbol: string;
    smartMoney: SmartMoneyFlow;
    topBalances: { address: string; label: string; balance: number; pct: number }[];
}

export interface SmartMoneyFlow {
    timeframe: '24h' | '7d';
    inflow: number;
    outflow: number;
    netFlow: number;
    smartBuyers: number;
    smartSellers: number;
}

export interface TokenAllowance {
    id: string;
    token: string;
    spender: string;
    spenderLabel?: string;
    allowance: string;
    risk: 'HIGH' | 'MEDIUM' | 'LOW';
    lastUpdated: string;
}

export type TaxEventType = 'DIVIDEND' | 'CAPITAL_GAIN' | 'INTEREST' | 'UNKNOWN';

export interface TaxEvent {
    id: string;
    date: string;
    description: string;
    amount: number;
    detectedType: TaxEventType;
    confidence: number;
    source: string;
}

export interface TransferRequest {
  fromAccountId: string;
  recipientName: string;
  recipientIban: string;
  amount: number;
  title: string;
  type: 'DOMESTIC' | 'TAX' | 'INSTANT' | 'RAILSR' | 'SEPA' | 'SWIFT';
  currency?: string;
}

export interface BulkPaymentBatch {
    id: string;
    totalAmount: number;
    count: number;
    status: 'PENDING' | 'AUTHORIZED' | 'COMPLETED';
    recipients: string[];
}

export interface VrpConfig {
    id: string;
    beneficiary: string;
    maxAmountPerPeriod: number;
    period: 'MONTHLY' | 'WEEKLY';
    active: boolean;
}

export interface DirectDebitMandate {
    id: string;
    creditor: string;
    reference: string;
    status: 'ACTIVE' | 'PENDING' | 'CANCELLED';
    lastPaymentDate?: string;
    lastAmount?: number;
    provider: 'GOCARDLESS';
}

export interface FinancialHealthScore {
    score: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    affordabilityRating: 'A' | 'B' | 'C' | 'D';
    monthlyDisposableIncome: number;
    debtToIncomeRatio: number;
}

export interface AccountVerification {
    iban: string;
    nameProvided: string;
    matchStatus: 'MATCH' | 'CLOSE_MATCH' | 'NO_MATCH';
    confidenceScore: number;
}

export interface PaymentLink {
    id: string;
    url: string;
    qrCodeUrl?: string;
    amount: number;
    currency: string;
    description: string;
    status: 'ACTIVE' | 'PAID' | 'EXPIRED';
    createdAt: string;
    recipientName: string;
}

export interface WatchlistAddress {
    id: string;
    address: string;
    label: string;
    netWorthUsd: number;
    change24h: number;
    topToken: string;
    alertsEnabled: boolean;
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  plan: SubscriptionPlan;
}

export interface GusHistoryEntry {
    date: string;
    description: string;
}

export interface GusData {
  name: string;
  nip: string;
  regon: string;
  krs?: string;
  address: string;
  street?: string;
  propertyNumber?: string;
  apartmentNumber?: string;
  city: string;
  zipCode: string;
  startDate: string;
  pkd: string;
  pkdDesc?: string;
  vatStatus?: 'ACTIVE' | 'EXEMPT' | 'SUSPENDED';
  legalForm?: 'JDG' | 'KRS_SP_Z_OO' | 'KRS_SA' | 'KRS_SP_KOM' | 'CIVIL';
  representatives?: string[];
  shareCapital?: number;
  lastUpdateDate?: string;
  history?: GusHistoryEntry[];
}

export interface WhiteListStatus {
    nip: string;
    iban: string;
    status: 'VALID' | 'INVALID' | 'UNKNOWN';
    checkDate: string;
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

export type ReminderType = 'SOFT' | 'HARD' | 'LEGAL';

export interface ReminderLog {
    invoiceId: string;
    type: ReminderType;
    date: string;
    method: 'EMAIL' | 'PUSH' | 'SMS';
}

export interface ExchangeRate {
    pair: string;
    bid: number;
    ask: number;
    mid: number;
    changePercent: number;
    timestamp: string;
}

export interface FxPosition {
    id: string;
    pair: string;
    type: 'LONG' | 'SHORT';
    amount: number;
    avgRate: number;
    unrealizedPnL: number;
    valuePln: number;
}

export interface TreasuryAlert {
    id: string;
    type: 'PROFIT' | 'LOSS';
    message: string;
    timestamp: string;
}

export interface LedgerEntry {
    id: string;
    direction: 'DEBIT' | 'CREDIT';
    amount: number;
    currency: string;
    status: 'POSTED' | 'PENDING';
    metadata: Record<string, string>;
    date: string;
    provider: 'MODERN_TREASURY';
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
    avatar?: string;
}

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'PLANNED';

export interface Project {
    id: string;
    name: string;
    client: string;
    status: ProjectStatus;
    budget: number;
    spent: number;
    revenue: number;
    startDate: string;
    deadline?: string;
    tags: string[];
    profitMargin: number;
}

export type CardType = 'VIRTUAL' | 'PHYSICAL' | 'ONE_TIME';
export type CardStatus = 'ACTIVE' | 'FROZEN' | 'CANCELLED';

export interface VirtualCard {
    id: string;
    last4: string;
    holderName: string;
    expiry: string;
    type: CardType;
    status: CardStatus;
    limitMonthly: number;
    spentMonthly: number;
    brand: 'VISA' | 'MASTERCARD';
    color: string;
    assignedUser?: string;
}

export type ContractType = 'UOP' | 'B2B' | 'UZ';
export type EmploymentStatus = 'ACTIVE' | 'L4' | 'HOLIDAY' | 'TERMINATED';

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    contractType: ContractType;
    salaryAmount: number;
    status: EmploymentStatus;
    joinDate: string;
    avatar?: string;
    taxReliefUnder26: boolean;
}

export interface PayrollEntry {
    employeeId: string;
    employeeName: string;
    contractType: ContractType;
    salaryGross: number;
    employerCostTotal: number;
    zusEmployer: number;
    zusEmployee: number;
    healthInsurance: number;
    pitAdvance: number;
    salaryNet: number;
    status: 'DRAFT' | 'PAID';
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

export type WarehouseDocType = 'PZ' | 'WZ' | 'MM' | 'PW' | 'RW';

export interface WarehouseDocument {
    id: string;
    number: string;
    type: WarehouseDocType;
    date: string;
    contractorName: string;
    itemsCount: number;
    totalValueNet: number;
    status: 'DRAFT' | 'APPROVED';
}

export interface InventoryStat {
    totalValue: number;
    lowStockCount: number;
    turnoverRate: number;
}

export type VehicleType = 'CAR' | 'TRUCK' | 'MOTORCYCLE';
export type VatDeductionType = 'FULL_100' | 'MIXED_50';

export interface Vehicle {
    id: string;
    name: string;
    licensePlate: string;
    type: VehicleType;
    vatDeduction: VatDeductionType;
    mileageCurrent: number;
    insuranceExpiry: string;
    inspectionExpiry: string;
    image?: string;
}

export interface MileageLog {
    id: string;
    vehicleId: string;
    date: string;
    startLocation: string;
    endLocation: string;
    distance: number;
    purpose: string;
    driver: string;
}

export type EcommercePlatformType = 'ALLEGRO' | 'SHOPIFY' | 'WOOCOMMERCE';

export interface EcommercePlatform {
    id: string;
    type: EcommercePlatformType;
    name: string;
    status: 'CONNECTED' | 'ERROR';
    lastSync: string;
}

export type OrderStatus = 'PAID' | 'PENDING' | 'SHIPPED' | 'REFUNDED';

export interface Order {
    id: string;
    platformId: string;
    platformOrderId: string;
    date: string;
    customer: string;
    totalGross: number;
    commissionFee: number;
    status: OrderStatus;
    fiscalized: boolean;
}

export enum ApiProvider {
    SALT_EDGE = 'Salt Edge',
    TINK = 'Tink',
    TRUELAYER = 'TrueLayer',
    GOCARDLESS = 'GoCardless',
    RAILSR = 'Railsr',
    MODERN_TREASURY = 'Modern Treasury',
    BYBIT = 'Bybit',
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
    SEGMENT = 'Segment'
}

export interface ApiVaultStatus {
    provider: ApiProvider;
    isConnected: boolean;
    lastChecked: string;
    featuresUnlocked: string[];
}

export interface OssTransaction {
    id: string;
    date: string;
    countryCode: string;
    amountEur: number;
    vatRate: number;
    vatAmountEur: number;
    source: 'SHOPIFY' | 'ALLEGRO' | 'MANUAL';
}

export interface OssCountryReport {
    countryCode: string;
    countryName: string;
    standardRate: number;
    totalNetEur: number;
    totalVatEur: number;
    transactionCount: number;
}

export interface IntrastatThreshold {
    type: 'IMPORT' | 'EXPORT';
    currentValue: number;
    limit: number;
    status: 'SAFE' | 'WARNING' | 'EXCEEDED';
    deadline: string;
}

export type AuditRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AuditRiskFactor {
    id: string;
    category: 'REVENUE' | 'COSTS' | 'VAT' | 'COMPLIANCE';
    title: string;
    description: string;
    severity: AuditRiskLevel;
    detected: boolean;
}

export interface AuditPackage {
    id: string;
    year: number;
    generatedAt: string;
    filesIncluded: string[];
    hash: string;
    status: 'READY' | 'GENERATING';
}

export interface IndustryStat {
    sector: string;
    avgRevenue: number;
    avgCost: number;
    avgSalary: number;
    growthYoY: number;
    source: string;
}

export interface MacroIndicator {
    name: string;
    value: number;
    unit: string;
    trend: 'UP' | 'DOWN' | 'STABLE';
    date: string;
}

export interface MarketComparison {
    metric: string;
    myValue: number;
    marketValue: number;
    difference: number;
    status: 'BETTER' | 'WORSE' | 'NEUTRAL';
}
