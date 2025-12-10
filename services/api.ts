
import { GoogleGenAI, Content } from "@google/genai";
import { PaymentLink, WatchlistAddress, NftCollectionStat, TransferRequest, BankAccount, Transaction, DirectDebitMandate, BulkPaymentBatch, VrpConfig, FinancialHealthScore, AccountVerification, TokenGodMode, TokenAllowance, StreamEvent, WalletDna, SubscriptionPlan, UserProfile, TaxationForm, ApiVaultStatus, ApiProvider, IndustryStat, MacroIndicator, OssTransaction, LedgerEntry, GoldRushTx, ExpenseBreakdown, CashFlowPoint, Asset, AssetCategory, Contractor, FinancialReport, CalendarEvent, Budget, AuditEntry, ExportFormat, SearchResult, Notification, CryptoWallet, CryptoExchange, CryptoTransaction, DeFiReward, TaxHarvestingOpp, NFTAsset, CryptoAnalytics, WalletRiskProfile, OssCountryReport, IntrastatThreshold, AuditRiskFactor, AuditPackage, MarketComparison, Invoice, InvoiceItem, RecurringInvoice, RecurringSuggestion, NbpTable, Project, VirtualCard, Employee, PayrollEntry, Product, WarehouseDocument, Vehicle, Order, GusData, WhiteListStatus, CeidgCompany, ExchangeRate, TeamMember, UserRole, FxPosition, CryptoTransactionType, TaxReturn, TaxFormType, TaxStatus, CostCategory, ChatMessage, SimulationParams, TaxOffice, StockAsset, EsgScore, Contract, MarketplaceItem, ForensicIssue, ForensicsSummary, TaxEngineConfig, TaxEngineStatus, DeFiProtocol, TaxPrediction, LegislativeAlert, ScenarioConfig, RealEstateProperty, Loan, CountryTaxProfile, CrossBorderResult, ForeignIncome, TaxOptimizationOpportunity } from '../types';
import { TaxEngine, TaxSimulator, AmortizationEngine } from '../utils/taxUtils';

// PROXY URL - to musi być '/api' żeby działało w Dockerze przez Vite
const API_URL = '/api'; 

// Initialize Gemini AI with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// MOCK DATA (Zapasowe)
let MOCK_SESSION_USER: UserProfile = { firstName: 'Adrian', lastName: 'Stodolski', email: 'adrian@nuffi.com', nip: '5213214567', pesel: '86121800691', taxOfficeCode: '1401', taxationForm: TaxationForm.GENERAL_SCALE, cryptoStrategy: 'FIFO', kycStatus: 'VERIFIED', companyName: 'Nuffi Technologies Sp. z o.o.', companyAddress: 'ul. Prosta 20, 00-850 Warszawa' };

export const NuffiService = {
  
  // --- EXCHANGE KEYS MANAGEMENT (Local Mock for Demo) ---
  saveExchangeKeys: async (exchange: CryptoExchange | string, key: string, secret: string) => {
      // W prawdziwej aplikacji to leci do bezpiecznego Vaulta na backendzie (Python + Fernet)
      console.log(`[SecureVault] Saving keys for ${exchange}...`);
      // Simulate persistence
      localStorage.setItem(`nuffi_keys_${exchange}`, JSON.stringify({ key, secret, connected: true }));
      await delay(500); 
      return true;
  },

  getExchangeConnectionStatus: async () => {
      const exchanges = [CryptoExchange.MEXC, CryptoExchange.BYBIT, CryptoExchange.BINANCE, CryptoExchange.KRAKEN];
      const status: Record<string, boolean> = {};
      exchanges.forEach(ex => {
          status[ex] = !!localStorage.getItem(`nuffi_keys_${ex}`);
      });
      return status;
  },

  disconnectExchange: async (exchange: CryptoExchange | string) => {
      localStorage.removeItem(`nuffi_keys_${exchange}`);
      await delay(300);
      return true;
  },

  // --- CRYPTO REAL SYNC SIMULATION ---
  fetchCryptoTransactions: async (exchanges?: CryptoExchange[]) => {
      // 1. Sprawdź, czy są podłączone giełdy
      const status = await NuffiService.getExchangeConnectionStatus();
      
      let allTransactions: CryptoTransaction[] = [];

      // 2. Jeśli podłączono MEXC - generuj dane "Live" z MEXC (Symulacja odpowiedzi API)
      if (status[CryptoExchange.MEXC]) {
          console.log('[API] Fetching live data from MEXC Global via CCXT Proxy...');
          await delay(800); // Simulate network latency
          const mexcTxs: CryptoTransaction[] = [
              { id: 'mx_1', exchange: CryptoExchange.MEXC, timestamp: '2023-10-01T12:00:00Z', type: CryptoTransactionType.SPOT_BUY, pair: 'KAS/USDT', amount: 5000, price: 0.12, totalFiat: 600, feeFiat: 0.6, confidenceScore: 0.99 },
              { id: 'mx_2', exchange: CryptoExchange.MEXC, timestamp: '2023-10-05T14:30:00Z', type: CryptoTransactionType.SPOT_BUY, pair: 'PEPE/USDT', amount: 10000000, price: 0.000001, totalFiat: 10, feeFiat: 0.01, confidenceScore: 0.98 },
              { id: 'mx_3', exchange: CryptoExchange.MEXC, timestamp: '2023-10-10T09:15:00Z', type: CryptoTransactionType.SPOT_SELL, pair: 'KAS/USDT', amount: 2000, price: 0.15, totalFiat: 300, feeFiat: 0.3, confidenceScore: 0.99 },
              { id: 'mx_4', exchange: CryptoExchange.MEXC, timestamp: '2023-10-20T11:00:00Z', type: CryptoTransactionType.SPOT_BUY, pair: 'MX/USDT', amount: 100, price: 2.50, totalFiat: 250, feeFiat: 0, confidenceScore: 0.95 },
          ];
          allTransactions = [...allTransactions, ...mexcTxs];
      }

      // 3. Jeśli podłączono Bybit - generuj dane "Live" z Bybit (Symulacja odpowiedzi API)
      if (status[CryptoExchange.BYBIT]) {
          console.log('[API] Fetching live data from Bybit Unified Account...');
          await delay(800);
          const bybitTxs: CryptoTransaction[] = [
              { id: 'by_1', exchange: CryptoExchange.BYBIT, timestamp: '2023-09-15T08:00:00Z', type: CryptoTransactionType.SPOT_BUY, pair: 'SOL/USDT', amount: 20, price: 200, totalFiat: 4000, feeFiat: 4, confidenceScore: 0.99 },
              { id: 'by_2', exchange: CryptoExchange.BYBIT, timestamp: '2023-09-20T16:00:00Z', type: CryptoTransactionType.FUTURES_PNL, pair: 'BTCUSDT', amount: 0, price: 0, totalFiat: 0, feeFiat: 15, realizedPnL: 450, confidenceScore: 0.90 },
              { id: 'by_3', exchange: CryptoExchange.BYBIT, timestamp: '2023-09-22T10:00:00Z', type: CryptoTransactionType.FUNDING_FEE, pair: 'ETHUSDT', amount: 0, price: 0, totalFiat: 0, feeFiat: 2.5, realizedPnL: -2.5, confidenceScore: 0.95 },
              { id: 'by_4', exchange: CryptoExchange.BYBIT, timestamp: '2023-10-02T10:00:00Z', type: CryptoTransactionType.DEPOSIT, pair: 'USDT', amount: 5000, price: 1, totalFiat: 5000, feeFiat: 0, confidenceScore: 1.0 },
          ];
          allTransactions = [...allTransactions, ...bybitTxs];
      }

      // Fallback if nothing connected, just to show something
      if (allTransactions.length === 0) {
           // allTransactions = [{ id: 'sample', exchange: CryptoExchange.BINANCE, timestamp: '2023-01-01T00:00:00Z', type: CryptoTransactionType.SPOT_BUY, pair: 'BTC/USDT', amount: 0.1, price: 20000, totalFiat: 2000, feeFiat: 2 }];
      }

      // Sort by date descending
      return allTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  // ... (rest of methods) ...
  fetchGusData: async (nip: string) => {
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
          pkdDesc: 'Działalność związana z oprogramowaniem',
          vatStatus: 'ACTIVE',
          legalForm: 'KRS_SP_Z_OO',
          representatives: ['Jan Prezes'],
          shareCapital: 5000,
          krs: '0000123456',
          history: [{date: '2023-01-01', description: 'Rejestracja w KRS'}]
      } as GusData;
  },

  // AUTH
  login: async (email?: string, password?: string) => {
      await delay(800);
      return { token: 'mock', plan: SubscriptionPlan.PRO, user: MOCK_SESSION_USER };
  },

  register: async (nip?: string, email?: string) => {
      return true;
  },

  fetchInvoices: async () => {
      await delay(500);
      return [
          { id: '1', ksefNumber: '1234567890-20231001-ABCD-1', contractor: 'Design Studio Creative', nip: '8881112233', date: '2023-10-05', amountNet: 4500.00, amountVat: 1035.00, amountGross: 5535.00, type: 'SALES', status: 'PROCESSED', currency: 'PLN' },
          { id: '2', ksefNumber: '9876543210-20231002-EFGH-2', contractor: 'Hosting Solutions Sp. z o.o.', nip: '5213214567', date: '2023-10-02', amountNet: 100.00, amountVat: 23.00, amountGross: 123.00, type: 'PURCHASE', status: 'PROCESSED', costCategory: CostCategory.OPERATIONAL_100, currency: 'PLN', aiAuditScore: 98 },
          { id: '3', ksefNumber: 'INT-2023-001', contractor: 'Digital Ocean Inc.', nip: 'US-99999', date: '2023-10-01', amountNet: 50.00, amountVat: 0, amountGross: 50.00, type: 'PURCHASE', status: 'PENDING', currency: 'USD', exchangeRate: 4.25, costCategory: CostCategory.OPERATIONAL_100, aiAuditScore: 85, aiAuditNotes: 'Brak adnotacji o odwrotnym obciążeniu.' }
      ] as Invoice[];
  },

  fetchRecurringInvoices: async () => {
      await delay(300);
      return [
          { id: 'r1', templateName: 'Obsługa IT (Ryczałt)', contractor: { name: 'Alpha Corp', nip: '1234567890' } as any, frequency: 'MONTHLY', nextIssueDate: '2023-11-01', amountNet: 3500, active: true }
      ] as RecurringInvoice[];
  },

  getSmartRecurringSuggestions: async () => {
      return [
          { contractorName: 'Beta Logistics', nip: '9876543210', detectedFrequency: 'MONTHLY', confidence: 0.95, potentialSavingsTime: '15 min/msc' }
      ] as RecurringSuggestion[];
  },

  fetchNbpTable: async (currency: string, date: string) => {
      await delay(200);
      return { tableNo: '195/A/NBP/2023', effectiveDate: date, rate: currency === 'EUR' ? 4.65 : currency === 'USD' ? 4.25 : 5.30, currency } as NbpTable;
  },

  uploadDocument: async (file: File) => {
      await delay(2000);
      return { id: `ocr_${Date.now()}`, ksefNumber: 'PENDING', contractor: 'OCR Result Ltd', nip: '0000000000', date: new Date().toISOString().split('T')[0], amountNet: 200, amountVat: 46, amountGross: 246, type: 'PURCHASE', status: 'DRAFT_XML', currency: 'PLN', costCategory: CostCategory.OPERATIONAL_100, aiAuditScore: 70, aiAuditNotes: 'Weryfikacja danych z OCR...' } as Invoice;
  },

  updateInvoiceCategory: async (id: string, category: CostCategory) => { await delay(200); },
  bulkUpdateCategory: async (ids: string[], category: CostCategory) => { await delay(500); },
  generateKsefInvoice: async (nip: string, items: any[]) => { await delay(1500); return 'KSEF-ID-MOCK-123'; },

  // --- Reports & Calc ---
  calculateTax: async (type: TaxFormType) => {
      await delay(1000);
      const revenue = 15000;
      const costs = 3000;
      const breakdown = TaxEngine.calculate(type, revenue, costs, TaxationForm.GENERAL_SCALE);
      return { id: 'tax_2023_10', year: 2023, type, income: breakdown.income, taxDue: breakdown.taxDue, breakdown, status: TaxStatus.CALCULATED } as TaxReturn;
  },

  fetchHistory: async () => {
      return [
          { id: 'tax_2022', year: 2022, type: TaxFormType.PIT_36, income: 120000, taxDue: 14500, status: TaxStatus.PAID, submissionDate: '2023-04-20', upoId: 'UPO-2023-MOCK-1' }
      ] as TaxReturn[];
  },

  // --- Integrations ---
  fetchAccounts: async () => {
      await delay(500);
      return [
          { id: '1', providerName: 'mBank S.A.', accountNumber: 'PL88 1140 2004 0000 3102 1234 5678', balance: 42500.00, currency: 'PLN', lastSync: 'Live (Salt Edge)', type: 'BUSINESS', colorTheme: 'bg-gradient-to-br from-red-600 to-red-700', logo: 'M', aggregator: 'SALT_EDGE' },
          { id: '2', providerName: 'Revolut Business', accountNumber: 'LT45 3200 1000 1234 5678', balance: 1250.00, currency: 'EUR', lastSync: 'Live (Tink)', type: 'MULTI_CURRENCY', colorTheme: 'bg-gradient-to-br from-blue-500 to-blue-600', logo: 'R', aggregator: 'TINK' }
      ] as BankAccount[];
  },

  fetchWallets: async () => {
      await delay(500);
      return [
          { id: 'w1', provider: 'Moralis', address: '0x71C...9A21', chain: 'ETH', assetCount: 12, riskScore: 10 },
          { id: 'w2', provider: 'Nansen', address: 'bc1q...xy2z', chain: 'BTC', assetCount: 2, riskScore: 5 }
      ] as CryptoWallet[];
  },

  // --- Dashboard Data ---
  fetchRecentTransactions: async () => {
      await delay(400);
      return [
          { id: 't1', date: '2023-10-24', description: 'Płatność za fakturę FV/2023/10/05', amount: -1230.00, category: 'EXPENSE', bankId: '1' },
          { id: 't2', date: '2023-10-23', description: 'Przelew przychodzący: Design Studio', amount: 5535.00, category: 'INCOME', bankId: '1' },
          { id: 't3', date: '2023-10-22', description: 'ZUS DRA (Składki)', amount: -1800.00, category: 'TAX', bankId: '1' },
          { id: 't4', date: '2023-10-21', description: 'AWS EMEA Sarl', amount: -50.00, category: 'EXPENSE', bankId: '2' }
      ] as Transaction[];
  },

  fetchExpensesBreakdown: async () => {
      return [] as ExpenseBreakdown[];
  },

  fetchVatSummary: async () => {
      return { outputVat: 1035, inputVat: 23, vatDue: 1012 };
  },

  fetchCashFlowProjection: async () => {
      return Array.from({length: 6}, (_, i) => ({ date: `2023-${10+i}`, balance: 40000 + (i*2000), type: 'PROJECTED' })) as CashFlowPoint[];
  },

  fetchBudgets: async () => {
      return [
          { id: 'b1', category: 'Marketing', limit: 2000, spent: 1200, forecast: 1900, status: 'SAFE', percentUsed: 60 },
          { id: 'b2', category: 'Software', limit: 1000, spent: 950, forecast: 1100, status: 'WARNING', percentUsed: 95 },
          { id: 'b3', category: 'Biuro', limit: 1500, spent: 400, forecast: 500, status: 'SAFE', percentUsed: 26 }
      ] as Budget[];
  },

  runAuditRiskAnalysis: async () => {
      await delay(1500);
      return [
          { id: 'r1', category: 'VAT', title: 'Nietypowa transakcja zagraniczna', description: 'Faktura od AWS (50 USD) nie została rozliczona jako import usług.', severity: 'MEDIUM', detected: true },
          { id: 'r2', category: 'COSTS', title: 'Wysokie koszty reprezentacji', description: 'Wykryto dużą liczbę faktur gastronomicznych w weekendy.', severity: 'LOW', detected: true }
      ] as AuditRiskFactor[];
  },

  fetchMarketComparison: async () => {
      return [
          { metric: 'Przychód/Pracownika', myValue: 25000, marketValue: 18000, difference: 38, status: 'BETTER' },
          { metric: 'Marża Netto', myValue: 18, marketValue: 12, difference: 50, status: 'BETTER' },
          { metric: 'Koszty IT', myValue: 15, marketValue: 5, difference: -200, status: 'WORSE' }
      ] as MarketComparison[];
  },

  // --- Other Services (Simplified) ---
  signDocument: async (id: string) => { await delay(2000); return true; },
  submitToMF: async (id: string) => { await delay(2000); return 'UPO-2023-LIVE-888'; },
  processPayment: async (amount: number, method: string) => { await delay(1500); return true; },
  
  // Settings & Profile
  fetchUserProfile: async () => { await delay(300); return MOCK_SESSION_USER; },
  updateUserProfile: async (data: UserProfile) => { MOCK_SESSION_USER = data; await delay(500); return true; },
  fetchTaxOffices: async () => { return [{code: '1401', name: 'I Urząd Skarbowy Warszawa-Śródmieście'}] as TaxOffice[]; },
  fetchAuditLogs: async () => { return [{id: 'l1', action: 'Login', date: '2023-10-25 09:00', ip: '192.168.1.1', device: 'Chrome / Mac', status: 'SUCCESS'}] as AuditEntry[]; },
  fetchTeamMembers: async () => { return [{id: 'u1', firstName: 'Jan', lastName: 'Kowalski', email: 'jan@nuffi.com', role: 'ACCOUNTANT', status: 'ACTIVE', lastActive: '2 min temu'}] as TeamMember[]; },
  fetchApiVaultStatus: async () => { 
      const exStatus = await NuffiService.getExchangeConnectionStatus();
      const vault: ApiVaultStatus[] = [
          { provider: ApiProvider.SALT_EDGE, isConnected: true, lastChecked: 'Today', featuresUnlocked: ['Banking'] },
          { provider: ApiProvider.SUMSUB, isConnected: true, lastChecked: 'Today', featuresUnlocked: ['KYC'] },
          { provider: ApiProvider.MEXC, isConnected: exStatus[CryptoExchange.MEXC], lastChecked: 'Live', featuresUnlocked: ['Spot', 'Futures'] },
          { provider: ApiProvider.BYBIT, isConnected: exStatus[CryptoExchange.BYBIT], lastChecked: 'Live', featuresUnlocked: ['Unified Account'] }
      ];
      return vault;
  },
  updateApiKey: async (provider: ApiProvider, key: string) => { await delay(500); return true; },
  inviteTeamMember: async (email: string, role: string) => { await delay(500); return true; },

  // AI Chat
  sendAIChatMessage: async (msg: string, history: ChatMessage[]) => {
      try {
          const chat = ai.chats.create({
              model: "gemini-2.5-flash",
              history: history.map(h => ({
                  role: h.role === 'user' ? 'user' : 'model',
                  parts: [{ text: h.text }]
              }))
          });
          const result = await chat.sendMessage({ message: msg });
          return result.text || "No response text.";
      } catch (e) {
          console.error("Gemini Error:", e);
          await delay(1000);
          return "Jako asystent podatkowy Nuffi (Fallback), sugeruję skonsultowanie tej kwestii z księgowym. (Sprawdź klucz API Gemini)";
      }
  },

  // Placeholder for missing methods referenced in components
  fetchContractors: async () => { return [] as Contractor[]; },
  verifyWhiteList: async (nip: string, iban: string) => { await delay(1000); return { status: 'VALID', requestId: 'req-123' } as WhiteListStatus; },
  fetchAssets: async () => { return [] as Asset[]; },
  addAsset: async (name: string, cat: AssetCategory, val: number, date: string) => { return true; },
  runSimulation: async (params: SimulationParams) => { return TaxSimulator.simulateExpense(params); },
  fetchFinancialReport: async (period: string) => { 
      return { 
          period, 
          lines: [
              { label: 'Przychody netto ze sprzedaży', value: 15000, type: 'REVENUE', indent: 0, isBold: true },
              { label: 'Koszty operacyjne', value: -4500, type: 'COST', indent: 0 },
              { label: 'EBITDA', value: 10500, type: 'PROFIT', indent: 0, isBold: true, highlight: true },
              { label: 'Zysk Netto', value: 8500, type: 'PROFIT', indent: 0, isBold: true }
          ] 
      } as FinancialReport; 
  },
  fetchFiscalCalendar: async () => { return [{id: 'e1', date: '2023-11-20', title: 'Podatek PIT-5', amount: 1200, type: 'PIT', status: 'PENDING'}] as CalendarEvent[]; },
  generateExport: async (format: ExportFormat, period: string) => { await delay(2000); return true; },
  sendPackageToAccountant: async (email: string) => { await delay(2000); return true; },
  searchGlobal: async (query: string) => { return [{id: '1', type: 'INVOICE', title: 'Faktura FV/123', subtitle: 'Design Studio'}] as SearchResult[]; },
  fetchNotifications: async () => { return [{id: 'n1', type: 'INFO', title: 'Nowa faktura', message: 'Otrzymano fakturę kosztową.', read: false, timestamp: '10 min temu'}] as Notification[]; },
  fetchDeFiRewards: async () => { return [] as DeFiReward[]; },
  harvestTaxLoss: async () => { return [] as TaxHarvestingOpp[]; },
  fetchNFTs: async () => { return [] as NFTAsset[]; },
  fetchCryptoAnalytics: async () => { return { totalPnl: 12500, winRate: 65, volume: 500000, tradesCount: 124 } as CryptoAnalytics; },
  fetchWalletRisk: async () => { return { score: 10, riskLevel: 'LOW' } as WalletRiskProfile; },
  fetchGoldRushData: async (address: string) => { return [] as GoldRushTx[]; },
  fetchWalletDna: async (address: string) => { return null; },
  subscribeToStreams: async (address: string) => { return [] as StreamEvent[]; },
  fetchTokenGodMode: async (symbol: string) => { return null; },
  fetchTokenAllowances: async () => { return [] as TokenAllowance[]; },
  fetchNftTrends: async () => { return [] as NftCollectionStat[]; },
  fetchDirectDebits: async () => { return [] as DirectDebitMandate[]; },
  fetchFinancialHealth: async () => { return { score: 850, riskLevel: 'LOW', affordabilityRating: 'A', monthlyDisposableIncome: 12000, debtToIncomeRatio: 0.15 } as FinancialHealthScore; },
  executeTransfer: async (req: TransferRequest) => { await delay(2000); return true; },
  executeBulkPayment: async (recipients: string[], amount: number) => { return { id: 'bulk_1', totalAmount: amount, count: recipients.length, status: 'AUTHORIZED' } as BulkPaymentBatch; },
  setupVrp: async (config: VrpConfig) => { return true; },
  verifyAccountOwnership: async (iban: string, name: string) => { await delay(1500); return { matchStatus: 'MATCH', confidenceScore: 99 } as AccountVerification; },
  verifyNftAccess: async (wallet: string) => { return true; },
  searchCeidgAndWhiteList: async (query: string) => { 
      await delay(1000); 
      return [
          { name: 'Example Corp Sp. z o.o.', nip: '5252525252', regon: '141414141', address: 'Warszawa, Zielona 1', status: 'ACTIVE', verifiedIban: 'PL12 3456 7890 0000 0000 1234 5678', isNuffiUser: true }
      ] as CeidgCompany[]; 
  },
  createStripeCheckout: async (plan: SubscriptionPlan) => { return 'https://checkout.stripe.com/mock'; },
  fetchProjects: async () => { return [{id: 'p1', name: 'Website Redesign', client: 'Alpha Corp', status: 'ACTIVE', budget: 50000, spent: 12000, revenue: 25000, startDate: '2023-09-01', tags: ['Web', 'Design'], profitMargin: 0.52}] as Project[]; },
  fetchVirtualCards: async () => { return [{id: 'c1', last4: '4242', holderName: 'Jan Kowalski', expiry: '12/25', type: 'VIRTUAL', status: 'ACTIVE', limitMonthly: 5000, spentMonthly: 1200, brand: 'VISA', color: 'bg-gradient-to-r from-indigo-500 to-purple-600'}] as VirtualCard[]; },
  toggleCardFreeze: async (id: string, freeze: boolean) => { return true; },
  fetchEmployees: async () => { return [] as Employee[]; },
  runPayroll: async (period: string) => { return [] as PayrollEntry[]; },
  fetchInventory: async () => { return [{id: 'pr1', sku: 'SKU-001', name: 'Laptop Dell', category: 'Elektronika', quantity: 5, unit: 'szt', priceNet: 3500, priceSell: 4500, vatRate: 0.23, minLevel: 2, lastMoved: '2023-10-01'}] as Product[]; },
  fetchWarehouseDocuments: async () => { return [] as WarehouseDocument[]; },
  fetchVehicles: async () => { return [{id: 'v1', name: 'Toyota Corolla', licensePlate: 'WA 12345', type: 'CAR', vatDeduction: 'MIXED_50', mileageCurrent: 125000, insuranceExpiry: '2024-05-01', inspectionExpiry: '2024-05-01'}] as Vehicle[]; },
  fetchEcommerceOrders: async () => { return [{id: 'o1', platformId: 'allegro', platformOrderId: 'ORDER-123', date: '2023-10-25', customer: 'Jan Nowak', totalGross: 150.00, commissionFee: 12.50, status: 'PAID', fiscalized: true}] as Order[]; },
  fetchOssData: async () => { return [] as OssTransaction[]; },
  calculateOssTax: async () => { return [] as OssCountryReport[]; },
  fetchIntrastatStatus: async () => { return [] as IntrastatThreshold[]; },
  generateDefensePackage: async (year: number) => { await delay(3000); return { id: 'pkg_1', hash: 'sha256-mock-hash-123', status: 'READY' } as AuditPackage; },
  fetchIndustryStats: async () => { return [] as IndustryStat[]; },
  fetchMacroIndicators: async () => { return [] as MacroIndicator[]; },
  fetchGovTechData: async () => { return { smupRequests: 124, dbwKbArticles: 56, sdpTaxStatus: 'Connected' }; },
  executeFxSwap: async (pair: string, amount: number, side: string) => { await delay(1000); return true; },
  fetchExchangeRates: async () => { return [{pair: 'EUR/PLN', mid: 4.55, bid: 4.52, ask: 4.58, changePercent: 0.5, timestamp: 'Now'}] as ExchangeRate[]; },
  fetchFxPositions: async () => { return [] as FxPosition[]; },
  fetchLedgerEntries: async () => { return [] as LedgerEntry[]; },
  trackEvent: (name: string, data: any) => { console.log(`[Analytics] ${name}`, data); },

  // --- NEW MODULES: ESG & WEALTH ---
  fetchEsgData: async () => {
      await delay(800);
      return {
          totalCo2Tons: 12.5,
          breakdown: {
              transport: 8.2, // Paliwo
              energy: 3.1,    // Prąd
              servers: 0.8,   // AWS/Cloud
              other: 0.4
          },
          treesNeeded: 520, // Approx 40-50 trees per ton/year offset
          trend: 'DOWN'
      } as EsgScore;
  },

  fetchStockPortfolio: async () => {
      await delay(1000);
      return [
          { symbol: 'AAPL', name: 'Apple Inc.', type: 'STOCK', quantity: 50, avgPrice: 150, currentPrice: 175, currency: 'USD', valuePln: 35000, pnl: 5000, pnlPercent: 16.6 },
          { symbol: 'TSLA', name: 'Tesla Inc.', type: 'STOCK', quantity: 20, avgPrice: 220, currentPrice: 210, currency: 'USD', valuePln: 17500, pnl: -800, pnlPercent: -4.5 },
          { symbol: 'CDR', name: 'CD Projekt', type: 'STOCK', quantity: 1000, avgPrice: 120, currentPrice: 145, currency: 'PLN', valuePln: 145000, pnl: 25000, pnlPercent: 20.8 },
          { symbol: 'S&P500', name: 'Vanguard S&P 500 ETF', type: 'ETF', quantity: 100, avgPrice: 380, currentPrice: 420, currency: 'USD', valuePln: 168000, pnl: 16000, pnlPercent: 10.5 },
          { symbol: 'XAU', name: 'Gold Spot', type: 'COMMODITY', quantity: 5, avgPrice: 1900, currentPrice: 1950, currency: 'USD', valuePln: 40000, pnl: 1000, pnlPercent: 2.6 }
      ] as StockAsset[];
  },

  // --- NEW MODULES: CONTRACTS & MARKETPLACE ---
  fetchContracts: async () => {
      await delay(800);
      return [
          { id: 'c1', name: 'Umowa Współpracy B2B', party: 'Design Studio Creative', type: 'B2B', startDate: '2023-01-01', endDate: '2024-01-01', value: 150000, currency: 'PLN', status: 'ACTIVE', noticePeriod: '1 miesiąc', autoRenewal: true, tags: ['IT', 'Service'] },
          { id: 'c2', name: 'NDA - Projekt X', party: 'FinTech Solutions', type: 'NDA', startDate: '2023-06-01', status: 'ACTIVE', noticePeriod: 'n/d', autoRenewal: false, tags: ['Confidential'] },
          { id: 'c3', name: 'Umowa Najmu Biura', party: 'WeWork', type: 'LEASE', startDate: '2022-01-01', endDate: '2023-12-31', value: 5000, currency: 'PLN', status: 'EXPIRING', noticePeriod: '3 miesiące', autoRenewal: true, tags: ['Office'] }
      ] as Contract[];
  },

  fetchMarketplaceItems: async () => {
      await delay(500);
      return [
          { id: 'm1', category: 'FINANCE', title: 'Faktoring SMEO', provider: 'SMEO', description: 'Finansowanie faktur w 15 minut. Limit do 100k PLN.', price: 'od 1.5%', icon: 'Banknote', recommended: true },
          { id: 'm2', category: 'INSURANCE', title: 'OC Zawodowe IT', provider: 'Hestia', description: 'Polisa chroniąca przed błędami w kodzie i utratą danych.', price: '50 PLN/msc', icon: 'Shield' },
          { id: 'm3', category: 'SERVICES', title: 'Księgowa Premium', provider: 'Nuffi Partners', description: 'Dedykowana księgowa, doradztwo podatkowe 24/7.', price: '300 PLN/msc', icon: 'UserCheck' }
      ] as MarketplaceItem[];
  },

  // --- FORENSICS & TAX ENGINE ---
  fetchForensics: async () => {
      await delay(1500);
      return {
          totalIssues: 3,
          riskScore: 65,
          confidenceDistribution: { high: 85, medium: 12, low: 3 },
          issues: [
              { id: 'f1', type: 'WASH_SALE', severity: 'HIGH', description: 'Sprzedaż i odkupienie aktywa (TSLA) w ciągu 30 dni. Strata może nie być uznana podatkowo.', affectedAssets: ['TSLA'], confidence: 0.98, date: '2023-10-12' },
              { id: 'f2', type: 'MISSING_COST_BASIS', severity: 'MEDIUM', description: 'Transfer przychodzący 5 ETH bez historii nabycia. Przyjęto koszt 0 PLN.', affectedAssets: ['ETH'], confidence: 0.92, date: '2023-09-01' },
              { id: 'f3', type: 'SCAM_TOKEN', severity: 'LOW', description: 'Wykryto airdrop tokena o niskiej reputacji. Oznaczono jako SPAM.', affectedAssets: ['ScamCoin'], confidence: 0.88, date: '2023-10-20' },
          ]
      } as ForensicsSummary;
  },

  getTaxEngineStatus: async () => {
      await delay(600);
      return {
          status: 'ONLINE',
          lastSync: new Date().toISOString(),
          transactionsProcessed: 12450,
          processingSpeed: 4500, // tx/sec
          uptime: 99.99
      } as TaxEngineStatus;
  },

  updateTaxEngineConfig: async (config: TaxEngineConfig) => {
      await delay(800);
      return true;
  },

  fetchDeFiProtocols: async () => {
      await delay(1000);
      return [
          { name: 'Uniswap V3', chain: 'Ethereum', type: 'DEX', tvl: 3500000000, userBalanceUsd: 1250, unclaimedRewardsUsd: 0 },
          { name: 'Aave V3', chain: 'Arbitrum', type: 'LENDING', tvl: 1200000000, userBalanceUsd: 5000, unclaimedRewardsUsd: 12.5 },
          { name: 'Lido', chain: 'Ethereum', type: 'YIELD', tvl: 8000000000, userBalanceUsd: 3200, unclaimedRewardsUsd: 0 }
      ] as DeFiProtocol[];
  },

  // --- PREDICTIVE AI & SIMULATION ---
  fetchTaxPredictions: async () => {
      await delay(800);
      const today = new Date();
      // Generate 6 months past, 6 months future
      const predictions: TaxPrediction[] = [];
      for (let i = -6; i <= 6; i++) {
          const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
          const isFuture = i > 0;
          const baseRevenue = 20000 + (Math.random() * 5000);
          const baseCost = 8000 + (Math.random() * 2000);
          
          predictions.push({
              month: d.toLocaleString('pl-PL', { month: 'short' }),
              estimatedRevenue: Math.round(baseRevenue),
              estimatedCost: Math.round(baseCost),
              estimatedTax: Math.round((baseRevenue - baseCost) * 0.19),
              type: isFuture ? 'PREDICTED' : 'ACTUAL',
              confidenceInterval: isFuture ? [Math.round(baseRevenue * 0.9), Math.round(baseRevenue * 1.1)] : undefined
          });
      }
      return predictions;
  },

  fetchLegislativeAlerts: async () => {
      await delay(1200);
      return [
          { id: 'leg1', title: 'Zmiana składki zdrowotnej', description: 'Projekt ustawy przewiduje powrót do ryczałtowej składki dla przedsiębiorców. Może obniżyć Twoje koszty o 300 PLN/msc.', impact: 'HIGH', effectiveDate: '2024-01-01', source: 'gov.pl' },
          { id: 'leg2', title: 'KSeF Obligatoryjny', description: 'Przesunięcie terminu wejścia w życie obowiązkowego KSeF na rok 2025. Masz więcej czasu na wdrożenie.', impact: 'MEDIUM', effectiveDate: '2025-01-01', source: 'mf.gov.pl' },
          { id: 'leg3', title: 'Limit płatności gotówkowych', description: 'Planowane obniżenie limitu transakcji gotówkowych B2B do 8000 PLN.', impact: 'LOW', effectiveDate: '2024-06-01', source: 'sejm.gov.pl' }
      ] as LegislativeAlert[];
  },

  runAiSimulation: async (config: ScenarioConfig) => {
      await delay(1500);
      // Simulate impact of config
      return {
          originalTax: 45000,
          simulatedTax: 45000 * (1 + (config.revenueGrowth/100)) * (1 - (config.costIncrease/200)), // dummy math
          riskScore: 35 + (config.revenueGrowth * 0.5)
      };
  },

  // --- REAL ESTATE & LOANS ---
  fetchRealEstate: async () => {
      await delay(800);
      return [
          {
              id: 'prop1', name: 'Apartament Wilanów', type: 'APARTMENT', address: 'ul. Klimczaka 15/22, Warszawa',
              purchaseValue: 850000, currentValue: 1100000, rentalIncomeMonthly: 4500, occupancyStatus: 'RENTED',
              taxation: 'LUMP_SUM', roi: 5.8
          },
          {
              id: 'prop2', name: 'Lokal Użytkowy Centrum', type: 'OFFICE', address: 'ul. Marszałkowska 88, Warszawa',
              purchaseValue: 1200000, currentValue: 1350000, rentalIncomeMonthly: 8000, occupancyStatus: 'RENTED',
              taxation: 'SCALE', roi: 6.5
          }
      ] as RealEstateProperty[];
  },

  fetchLoans: async () => {
      await delay(800);
      return [
          {
              id: 'loan1', name: 'Kredyt Hipoteczny (Biuro)', type: 'MORTGAGE', bank: 'PKO BP',
              totalAmount: 900000, remainingAmount: 750000, nextInstallmentDate: '2023-11-10', nextInstallmentAmount: 5200,
              interestRate: 7.5, currency: 'PLN', endDate: '2040-01-01'
          },
          {
              id: 'lease1', name: 'Leasing Toyota Camry', type: 'LEASING', bank: 'Santander Leasing',
              totalAmount: 160000, remainingAmount: 45000, nextInstallmentDate: '2023-11-15', nextInstallmentAmount: 3100,
              interestRate: 108, currency: 'PLN', endDate: '2025-05-01'
          }
      ] as Loan[];
  },

  // --- GLOBAL TAX ---
  fetchCountryTaxRules: async () => {
      return [
          { countryCode: 'DE', name: 'Niemcy', flag: '🇩🇪', taxRateCorporate: 15, taxRatePersonal: [14, 42, 45], hasDttWithPl: true, dttMethod: 'EXEMPTION_WITH_PROGRESSION' },
          { countryCode: 'UK', name: 'Wielka Brytania', flag: '🇬🇧', taxRateCorporate: 25, taxRatePersonal: [20, 40, 45], hasDttWithPl: true, dttMethod: 'EXEMPTION_WITH_PROGRESSION' },
          { countryCode: 'CZ', name: 'Czechy', flag: '🇨🇿', taxRateCorporate: 19, taxRatePersonal: [15, 23], hasDttWithPl: true, dttMethod: 'EXEMPTION_WITH_PROGRESSION' },
          { countryCode: 'US', name: 'USA', flag: '🇺🇸', taxRateCorporate: 21, taxRatePersonal: [10, 12, 22, 24, 32, 35, 37], hasDttWithPl: true, dttMethod: 'PROPORTIONAL_DEDUCTION' }, // PL-US has specific proportional deduction usually
          { countryCode: 'EE', name: 'Estonia', flag: '🇪🇪', taxRateCorporate: 0, taxRatePersonal: [20], hasDttWithPl: true, dttMethod: 'EXEMPTION_WITH_PROGRESSION' } // 0% CIT on distributed only
      ] as CountryTaxProfile[];
  },

  calculateCrossBorderTax: async (income: ForeignIncome[]) => {
      await delay(1200);
      // Simplified mock calculation logic
      // Assume basic PL income of 100k
      const basePlIncome = 100000;
      const ratePl = 0.12;
      
      // Assume user selected one foreign source for simplicity in mock
      const foreign = income[0];
      const exRate = foreign.currency === 'EUR' ? 4.5 : 4.0;
      const foreignIncomePln = foreign.amountForeignCurrency * exRate;
      const foreignTaxPaidPln = foreign.taxPaidForeignCurrency * exRate;

      let result: CrossBorderResult = {
          plTaxBase: basePlIncome,
          foreignTaxBasePln: foreignIncomePln,
          plTaxDue: 0,
          foreignTaxPaidPln: foreignTaxPaidPln,
          effectiveRate: 0,
          taxCreditUsed: 0,
          additionalPaymentPl: 0,
          methodUsed: 'UNKNOWN'
      };

      // Apply dummy logic based on country
      if (['DE', 'UK', 'CZ'].includes(foreign.country)) {
          // Exemption with Progression (Wyłączenie z progresją)
          // 1. Calculate rate on GLOBAL income
          const globalIncome = basePlIncome + foreignIncomePln;
          const globalTax = globalIncome * 0.15; // Simulated progressive rate
          const effectiveRate = globalTax / globalIncome;
          
          // 2. Apply rate to PL income only
          const taxDue = basePlIncome * effectiveRate;
          
          result.methodUsed = 'Wyłączenie z progresją (Exemption)';
          result.effectiveRate = effectiveRate;
          result.plTaxDue = taxDue;
          result.additionalPaymentPl = 0; // Usually 0 extra on foreign part
      } else {
          // Proportional Deduction (Odliczenie proporcjonalne) e.g. USA, NL in some cases
          const totalTaxPl = (basePlIncome + foreignIncomePln) * 0.12; // PL Scale
          const limit = totalTaxPl * (foreignIncomePln / (basePlIncome + foreignIncomePln));
          
          const deduction = Math.min(foreignTaxPaidPln, limit);
          const taxDue = totalTaxPl - deduction;
          
          result.methodUsed = 'Odliczenie proporcjonalne (Credit)';
          result.taxCreditUsed = deduction;
          result.plTaxDue = taxDue;
          result.additionalPaymentPl = Math.max(0, (foreignIncomePln * 0.12) - deduction); // Simplified
          
          // Ulga Abolicyjna cap
          if (result.additionalPaymentPl > 1360) {
              // result.additionalPaymentPl -= 1360; // Simplified
          }
      }

      return result;
  },

  // --- TAX OPTIMIZER (AUTO-HEDGING) ---
  fetchTaxOptimizationOpportunities: async () => {
      await delay(1200);
      return [
          {
              id: 'opt1', asset: 'KASPA (KAS)', currentPrice: 0.10, purchasePrice: 0.15,
              unrealizedLoss: 2500, quantity: 50000, type: 'CRYPTO',
              strategy: 'HARVEST_LOSS', potentialTaxSavings: 475 // 19% of 2500
          },
          {
              id: 'opt2', asset: 'Tesla Inc. (TSLA)', currentPrice: 210, purchasePrice: 220,
              unrealizedLoss: 800, quantity: 20, type: 'STOCK',
              strategy: 'WASH_SALE_AVOIDANCE', potentialTaxSavings: 152
          }
      ] as TaxOptimizationOpportunity[];
  }
};
