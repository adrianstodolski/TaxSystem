
import { CalculationMethod, CryptoTransaction, CryptoTransactionType, CryptoTaxReport, EngineSnapshot, TaxLot } from "../types";

interface FifoQueueItem extends TaxLot {
    source: string; // Exchange/Wallet
}

interface ProcessedTransaction extends CryptoTransaction {
    matchedLots: {
        lotId: string;
        amount: number;
        costBasis: number;
        gain: number;
    }[];
    realizedGain: number;
    costOfGoodsSold: number;
}

export class CoreEngine {
    private inventory: Record<string, FifoQueueItem[]> = {}; // Asset -> Lots
    private processedTransactions: ProcessedTransaction[] = [];
    
    constructor(private strategy: CalculationMethod = 'FIFO') {}

    /**
     * Główna funkcja przetwarzająca. Resetuje stan i przelicza wszystko od zera.
     */
    public process(transactions: CryptoTransaction[]): CryptoTaxReport {
        // 1. Sortuj chronologicznie (krytyczne dla FIFO/LIFO)
        const sorted = [...transactions].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        this.inventory = {};
        this.processedTransactions = [];
        let totalSpotIncome = 0;
        let totalSpotCost = 0;
        let totalFuturesIncome = 0;
        let totalFuturesCost = 0;

        for (const tx of sorted) {
            const asset = this.getAssetFromPair(tx.pair);
            
            // --- SPOT BUY / DEPOSIT ---
            if (tx.type === CryptoTransactionType.SPOT_BUY || tx.type === CryptoTransactionType.DEPOSIT) {
                this.addLot(asset, {
                    id: tx.id,
                    date: tx.timestamp,
                    amount: tx.amount,
                    costBasis: tx.price, // For deposits, this might need Fair Market Value lookup
                    remaining: tx.amount,
                    sourceTxId: tx.id,
                    source: typeof tx.exchange === 'string' ? tx.exchange : 'UNKNOWN',
                    asset: asset
                });
            } 
            
            // --- SPOT SELL / WITHDRAWAL (Taxable) ---
            else if (tx.type === CryptoTransactionType.SPOT_SELL) {
                const result = this.consumeLots(asset, tx.amount, tx.price);
                
                const processedTx: ProcessedTransaction = {
                    ...tx,
                    matchedLots: result.matches,
                    realizedGain: result.realizedGain,
                    costOfGoodsSold: result.costBasisTotal
                };
                
                this.processedTransactions.push(processedTx);
                
                totalSpotIncome += tx.totalFiat; // Przychód
                totalSpotCost += result.costBasisTotal + tx.feeFiat; // Koszt (Nabycie + Prowizja)
            }

            // --- FUTURES ---
            else if (tx.type === CryptoTransactionType.FUTURES_PNL) {
                if ((tx.realizedPnL || 0) > 0) totalSpotIncome += (tx.realizedPnL || 0); // Traktowane jako przychód kapitałowy
                else totalSpotCost += Math.abs(tx.realizedPnL || 0);
                totalSpotCost += tx.feeFiat;
            }
        }

        const taxBase = Math.max(0, totalSpotIncome - totalSpotCost);
        
        return {
            year: new Date().getFullYear(),
            strategy: this.strategy,
            spotIncome: totalSpotIncome,
            spotCost: totalSpotCost,
            spotIncomeTaxBase: taxBase,
            futuresIncome: 0, // Simplified: merged into capital gains
            futuresCost: 0,
            futuresIncomeTaxBase: 0,
            totalTaxDue: Math.round(taxBase * 0.19),
            transactionsProcessed: sorted.length
        };
    }

    /**
     * Dodaje partię (Lot) do inwentarza.
     */
    private addLot(asset: string, lot: FifoQueueItem) {
        if (!this.inventory[asset]) this.inventory[asset] = [];
        this.inventory[asset].push(lot);
    }

    /**
     * Pobiera partie zgodnie ze strategią (FIFO/LIFO/HIFO).
     */
    private consumeLots(asset: string, amountToSell: number, sellPrice: number) {
        let remainingToSell = amountToSell;
        let costBasisTotal = 0;
        let realizedGain = 0;
        const matches: { lotId: string; amount: number; costBasis: number; gain: number; }[] = [];

        if (!this.inventory[asset]) this.inventory[asset] = [];
        let queue = this.inventory[asset];

        // Sortowanie kolejki w zależności od strategii
        if (this.strategy === 'LIFO') {
            // Odwracamy (kopia), by brać od końca
            // W praktyce lepiej iterować od końca tablicy, tutaj uproszczenie
            queue.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (this.strategy === 'HIFO') {
            // Najdroższe najpierw
            queue.sort((a, b) => b.costBasis - a.costBasis);
        } else {
            // FIFO (Domyślnie): Sortuj od najstarszej
            queue.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        // Iteracja i zdejmowanie z kolejki
        
        for (const lot of queue) {
            if (remainingToSell <= 0) break;
            if (lot.remaining <= 0) continue;

            const takeAmount = Math.min(remainingToSell, lot.remaining);
            
            const costChunk = takeAmount * lot.costBasis;
            const revenueChunk = takeAmount * sellPrice;
            const gainChunk = revenueChunk - costChunk;

            matches.push({
                lotId: lot.id,
                amount: takeAmount,
                costBasis: lot.costBasis,
                gain: gainChunk
            });

            costBasisTotal += costChunk;
            realizedGain += gainChunk;
            
            lot.remaining -= takeAmount;
            remainingToSell -= takeAmount;
        }

        // Clean up empty lots (optional optimization)
        this.inventory[asset] = this.inventory[asset].filter(lot => lot.remaining > 0.00000001);

        return {
            costBasisTotal,
            realizedGain,
            matches
        };
    }

    private getAssetFromPair(pair: string): string {
        if (!pair) return 'UNKNOWN';
        // BTC/USDT -> BTC
        return pair.split('/')[0].split('-')[0];
    }

    /**
     * Financial Time Machine: Generuje stan portfela na dany dzień.
     */
    public getSnapshotAtDate(date: string): EngineSnapshot {
        // To wymagałoby przechowywania pełnej historii zmian inventory.
        // Uproszczona wersja:
        const holdings: Record<string, TaxLot[]> = {};
        for(const asset in this.inventory) {
            holdings[asset] = this.inventory[asset].filter(lot => new Date(lot.date) <= new Date(date));
        }

        return {
            date,
            inventory: holdings, 
            realizedGains: 0,
            unrealizedGains: 0,
            taxDue: 0,
            warnings: []
        };
    }
}
