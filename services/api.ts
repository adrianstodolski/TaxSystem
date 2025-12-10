import { PaymentLink, WatchlistAddress, NftCollectionStat, TransferRequest, BankAccount, Transaction, DirectDebitMandate, BulkPaymentBatch, VrpConfig, FinancialHealthScore, AccountVerification, TokenGodMode, TokenAllowance, StreamEvent, WalletDna, SubscriptionPlan, UserProfile, TaxationForm, ApiVaultStatus, ApiProvider, IndustryStat, MacroIndicator, OssTransaction, LedgerEntry, GoldRushTx, ExpenseBreakdown, CashFlowPoint, Asset, AssetCategory, Contractor, FinancialReport, CalendarEvent, Budget, AuditEntry, ExportFormat, SearchResult, Notification, CryptoWallet, CryptoExchange, CryptoTransaction, DeFiReward, TaxHarvestingOpp, NFTAsset, CryptoAnalytics, WalletRiskProfile, OssCountryReport, IntrastatThreshold, AuditRiskFactor, AuditPackage, MarketComparison, Invoice, InvoiceItem, RecurringInvoice, RecurringSuggestion, NbpTable, Project, VirtualCard, Employee, PayrollEntry, Product, WarehouseDocument, Vehicle, Order, GusData, WhiteListStatus, CeidgCompany, ExchangeRate, TeamMember, UserRole, FxPosition, CryptoTransactionType, TaxReturn, TaxFormType, TaxStatus, CostCategory } from '../types';
import { TaxEngine, TaxSimulator, AmortizationEngine } from '../utils/taxUtils';

// PROXY URL (Relatywny - kieruje do vite proxy -> backend container)
const API_URL = '/api'; 

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// MOCK DATA (Zapasowe)
let MOCK_SESSION_USER: UserProfile = { firstName: 'Adrian', lastName: 'Stodolski', email: 'adrian@nuffi.com', nip: '5213214567', pesel: '86121800691', taxOfficeCode: '1401', taxationForm: TaxationForm.GENERAL_SCALE, cryptoStrategy: 'FIFO', kycStatus: 'VERIFIED', companyName: 'Nuffi Technologies Sp. z o.o.', companyAddress: 'ul. Prosta 20, 00-850 Warszawa' };
const MOCK_ACCOUNTS: BankAccount[] = [ { id: '1', providerName: 'mBank S.A.', accountNumber: 'PL88114020040000300212345678', balance: 42500.00, currency: 'PLN', lastSync: 'Live (Salt Edge)', type: 'BUSINESS', colorTheme: 'from-red-500 to-red-600', aggregator: 'SALT_EDGE', logo: 'M' } ]; 
const MOCK_API_STATUS: ApiVaultStatus[] = [
    { provider: ApiProvider.SALT_EDGE, isConnected: true, lastChecked: 'Live', featuresUnlocked: ['Banking Aggregation'] },
    { provider: ApiProvider.CEIDG, isConnected: true, lastChecked: 'Live', featuresUnlocked: ['Company Search'] }
];

export const NuffiService = {
  
  // --- REAL CEIDG FETCH (Via Backend Proxy) ---
  fetchGusData: async (nip: string) => {
      try {
          console.log(`[Frontend] Fetching CEIDG data from: ${API_URL}/integrations/ceidg/${nip}`);
          const response = await fetch(`${API_URL}/integrations/ceidg/${nip}`);
          
          if (response.ok) {
              const data = await response.json();
              console.log("[Frontend] CEIDG Data received:", data);
              
              return {
                  name: data.name,
                  address: data.address,
                  street: data.street,
                  propertyNumber: data.propertyNumber,
                  city: data.city,
                  zipCode: data.zipCode,
                  nip: data.nip,
                  regon: data.regon,
                  startDate: data.startDate,
                  pkd: data.pkd,
                  vatStatus: data.vatStatus,
                  legalForm: data.legalForm,
                  representatives: ['Pobrane z API'],
                  shareCapital: 5000,
                  history: [],
                  isRealApiData: data.isRealApiData 
              } as GusData;
          }
      } catch (e) {
          console.error("[Frontend] Proxy fetch failed:", e);
      }

      // Fallback (Local)
      await delay(1000);
      if (!/^\d{10}$/.test(nip)) return null;
      return {
          name: `Firma Testowa (Frontend Fallback) NIP:${nip}`,
          address: 'ul. Awaryjna 1, Localhost',
          city: 'Localhost',
          zipCode: '00-000',
          nip: nip,
          regon: '111111111',
          startDate: '2023-01-01',
          pkd: '62.01.Z',
          vatStatus: 'ACTIVE',
          legalForm: 'KRS_SP_Z_OO',
          representatives: ['Symulator'],
          shareCapital: 5000,
          history: []
      } as GusData;
  },

  // --- AUTH ---
  login: async (email?: string, password?: string) => {
      try {
          const response = await fetch(`${API_URL}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });
          if (response.ok) {
              const data = await response.json();
              return { 
                  token: data.token, 
                  plan: SubscriptionPlan.PRO, 
                  user: { ...MOCK_SESSION_USER, email: data.user.email, companyName: data.user.companyName, nip: data.user.nip } 
              };
          }
      } catch (e) {}
      await delay(800);
      return { token: 'mock', plan: SubscriptionPlan.PRO, user: MOCK_SESSION_USER };
  },

  register: async (nip?: string, email?: string) => {
      try {
          const response = await fetch(`${API_URL}/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, nip, password: 'password', company_name: 'Firma z CEIDG' })
          });
          return response.ok;
      } catch (e) {
          return true;
      }
  },

  // --- MOCKS FOR OTHER FEATURES ---
  createPaymentLink: async () => ({} as any),
  fetchWatchlist: async () => [],
  addToWatchlist: async () => true,
  verifyNftAccess: async (address: string) => true,
  fetchNftTrends: async () => [],
  executeTransfer: async (request: TransferRequest) => true,
  processPayment: async (amount: number, method: string) => true,
  fetchAccounts: async () => MOCK_ACCOUNTS, 
  fetchRecentTransactions: async () => [],
  fetchDirectDebits: async () => [],
  fetchFinancialHealth: async () => ({ score: 850 } as any),
  verifyAccountOwnership: async (iban: string, name: string) => ({ matchStatus: 'MATCH' } as any),
  fetchTokenGodMode: async (token: string) => ({} as any),
  resolveEns: async () => null,
  fetchTokenAllowances: async () => [],
  fetchApiVaultStatus: async () => MOCK_API_STATUS,
  updateApiKey: async (provider: ApiProvider, key: string) => true,
  verifyWhiteList: async (nip: string, iban: string) => ({ status: 'VALID' } as any),
  createStripeCheckout: async (plan: SubscriptionPlan) => '',
  calculateTax: async (formType: TaxFormType) => ({ id: '1', year: 2023, taxDue: 0 } as any),
  signDocument: async (docId: string) => true,
  submitToMF: async (docId: string) => 'UPO',
  fetchHistory: async () => [],
  fetchInvoices: async () => [],
  fetchRecurringInvoices: async () => [],
  getSmartRecurringSuggestions: async () => [],
  updateInvoiceCategory: async (id: string, category: CostCategory) => true,
  bulkUpdateCategory: async (ids: string[], category: CostCategory) => true,
  uploadDocument: async (file: File) => ({} as any),
  fetchUserProfile: async () => MOCK_SESSION_USER,
  updateUserProfile: async (profile: UserProfile) => true,
  fetchTaxOffices: async () => [],
  fetchExpensesBreakdown: async () => [],
  fetchCashFlowProjection: async () => [],
  fetchAssets: async () => [],
  addAsset: async (name: string, category: AssetCategory, value: number, date: string) => ({} as any),
  fetchVatSummary: async () => ({ outputVat: 0, inputVat: 0, vatDue: 0 }),
  runSimulation: async (params: SimulationParams) => ({} as any),
  fetchContractors: async () => [],
  sendAIChatMessage: async (message: string) => 'AI Response',
  fetchFinancialReport: async (period: string) => ({} as any),
  fetchFiscalCalendar: async () => [],
  fetchBudgets: async () => [],
  fetchAuditLogs: async () => [],
  generateExport: async (format: ExportFormat, period: string) => true,
  sendPackageToAccountant: async (email: string) => true,
  searchGlobal: async (query: string) => [],
  fetchNotifications: async () => [],
  fetchWallets: async () => [],
  fetchCryptoTransactions: async (exchanges: CryptoExchange[]) => [],
  fetchDeFiRewards: async () => [],
  harvestTaxLoss: async () => [],
  fetchNFTs: async () => [],
  fetchCryptoAnalytics: async () => ({} as any),
  fetchWalletRisk: async () => ({} as any),
  fetchOssData: async () => [],
  calculateOssTax: async () => [],
  fetchIntrastatStatus: async () => [],
  runAuditRiskAnalysis: async () => [],
  generateDefensePackage: async (year: number) => ({} as any),
  fetchIndustryStats: async () => [],
  fetchMacroIndicators: async () => [],
  fetchMarketComparison: async () => [],
  generateKsefInvoice: async (nip: string, items: InvoiceItem[]) => '',
  searchCeidgAndWhiteList: async (query: string) => [],
  sendPaymentReminder: async () => true,
  fetchExchangeRates: async () => [],
  fetchTeamMembers: async () => [],
  inviteTeamMember: async (email: string, role: UserRole) => true,
  executeFxSwap: async (pair: string, amount: number, side: 'BUY' | 'SELL') => true,
  fetchFxPositions: async () => [],
  fetchNbpRate: async () => 1,
  fetchNbpTable: async (currency: string, date: string) => ({} as any),
  fetchProjects: async () => [],
  fetchVirtualCards: async () => [],
  toggleCardFreeze: async (id: string, freeze: boolean) => true,
  createVirtualCard: async () => true,
  fetchEmployees: async () => [],
  runPayroll: async (period: string) => [],
  fetchInventory: async () => [],
  fetchWarehouseDocuments: async () => [],
  predictStockDepletion: async () => 0,
  fetchVehicles: async () => [],
  logTrip: async () => true,
  fetchEcommerceOrders: async () => [],
  syncEcommercePlatform: async () => true,
  scanBankForTaxEvents: async () => [],
  generateRailsrJwt: async () => ({} as any),
  fetchGovTechData: async () => ({} as any),
  trackEvent: async (eventName: string, props?: any) => {},
  fetchLedgerEntries: async () => [],
  fetchGoldRushData: async (address: string) => [],
  fetchWalletDna: async (address: string) => ({} as any),
  subscribeToStreams: async (address: string) => [],
  executeBulkPayment: async (recipients: string[], amount: number) => ({} as any),
  setupVrp: async (config: VrpConfig) => true,
};