
import { CryptoTransaction, CryptoTransactionType, CryptoTaxReport } from "../types";

interface FifoQueueItem {
    id: string;
    amount: number;
    price: number; // Purchase price
    remaining: number;
}

export const CryptoEngine = {
    /**
     * Calculates tax for Spot transactions using FIFO (First-In, First-Out)
     * and separates Futures PnL (Cash Flow method)
     */
    calculateTax: (transactions: CryptoTransaction[], strategy: 'FIFO' | 'LIFO'): CryptoTaxReport => {
        // 1. Separate Spot and Futures
        const spotTxs = transactions.filter(t => 
            t.type === CryptoTransactionType.SPOT_BUY || 
            t.type === CryptoTransactionType.SPOT_SELL
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const futuresTxs = transactions.filter(t => 
            t.type === CryptoTransactionType.FUTURES_PNL || 
            t.type === CryptoTransactionType.FUNDING_FEE
        );

        // --- SPOT LOGIC (FIFO) ---
        let spotRevenue = 0;
        let spotCostOfRevenue = 0;
        const inventory: Record<string, FifoQueueItem[]> = {}; // Map by Pair (e.g. BTC)

        spotTxs.forEach(tx => {
            const asset = tx.pair?.split('/')[0] || 'UNKNOWN';
            if (!inventory[asset]) inventory[asset] = [];

            if (tx.type === CryptoTransactionType.SPOT_BUY) {
                // Add to inventory
                inventory[asset].push({
                    id: tx.id,
                    amount: tx.amount,
                    price: tx.price,
                    remaining: tx.amount
                });
            } else if (tx.type === CryptoTransactionType.SPOT_SELL) {
                spotRevenue += tx.totalFiat;
                let amountToSell = tx.amount;
                let currentCost = 0;

                // Consume inventory
                const queue = inventory[asset];
                
                // For LIFO we would reverse iteration or pop from end, simplified FIFO here
                while (amountToSell > 0 && queue.length > 0) {
                    const batch = queue[0]; // Peek first (FIFO)
                    
                    if (batch.remaining > amountToSell) {
                        // Partial consume
                        currentCost += amountToSell * batch.price;
                        batch.remaining -= amountToSell;
                        amountToSell = 0;
                    } else {
                        // Full consume
                        currentCost += batch.remaining * batch.price;
                        amountToSell -= batch.remaining;
                        queue.shift(); // Remove empty batch
                    }
                }
                
                // Add fee to cost
                spotCostOfRevenue += currentCost + tx.feeFiat;
            }
        });

        // --- FUTURES LOGIC (Cash Flow) ---
        let futuresIncome = 0;
        let futuresCost = 0;

        futuresTxs.forEach(tx => {
            if (tx.realizedPnL && tx.realizedPnL > 0) {
                futuresIncome += tx.realizedPnL;
            } else if (tx.realizedPnL && tx.realizedPnL < 0) {
                futuresCost += Math.abs(tx.realizedPnL);
            }
            // Funding fees are usually costs (if negative) or income (if positive)
            // Simplified: Treating all fees as cost
            futuresCost += tx.feeFiat;
        });

        // --- AGGREGATION ---
        const spotIncome = Math.max(0, spotRevenue - spotCostOfRevenue);
        const futuresIncomeNet = Math.max(0, futuresIncome - futuresCost);
        
        const totalTaxBase = spotIncome + futuresIncomeNet;
        const totalTaxDue = Math.round(totalTaxBase * 0.19); // 19% Belka Tax

        return {
            year: new Date().getFullYear(),
            strategy,
            spotIncome: spotRevenue,
            spotCost: spotCostOfRevenue,
            spotIncomeTaxBase: spotIncome,
            futuresIncome,
            futuresCost,
            futuresIncomeTaxBase: futuresIncomeNet,
            totalTaxDue,
            transactionsProcessed: transactions.length
        };
    }
};
