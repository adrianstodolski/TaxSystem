
import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, PieChart, ArrowRight, TrendingUp, Wallet } from 'lucide-react';
import { safeFormatCurrency } from '../utils/formatters';

export const PriceCalculator: React.FC = () => {
    const [cost, setCost] = useState(100);
    const [margin, setMargin] = useState(30); // %
    const [vatRate, setVatRate] = useState(23); // %
    const [priceNet, setPriceNet] = useState(0);
    const [priceGross, setPriceGross] = useState(0);
    const [profit, setProfit] = useState(0);
    const [taxImpact, setTaxImpact] = useState(0); // PIT/CIT approx 19%

    useEffect(() => {
        // Calculation Logic
        const net = cost / (1 - (margin / 100));
        const prof = net - cost;
        const gross = net * (1 + (vatRate / 100));
        const tax = prof * 0.19; // Simplified 19% tax on profit

        setPriceNet(net);
        setPriceGross(gross);
        setProfit(prof - tax); // Net profit after tax
        setTaxImpact(tax);
    }, [cost, margin, vatRate]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Calculator className="text-gold" /> Kalkulator Cen B2B/B2C
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Oblicz rentowność, narzut i cenę końcową uwzględniając podatki.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="neo-card p-6 rounded-2xl space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">Koszt wytworzenia / zakupu (Netto)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={cost}
                                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                                className="neo-input w-full pl-4 pr-12 py-3 rounded-xl text-lg font-bold text-white placeholder-zinc-600 font-mono"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">PLN</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">Oczekiwana Marża (%)</label>
                        <input 
                            type="range" 
                            min="0" max="90" 
                            value={margin} 
                            onChange={(e) => setMargin(parseInt(e.target.value))}
                            className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-gold mb-2 border border-white/10"
                        />
                        <div className="flex justify-between">
                            <input 
                                type="number" 
                                value={margin}
                                onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 neo-input rounded text-center font-bold"
                            />
                            <span className="text-xs text-zinc-500 self-center">Narzut: {((priceNet / cost - 1) * 100).toFixed(1)}%</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">Stawka VAT</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[23, 8, 5, 0].map(r => (
                                <button 
                                    key={r}
                                    onClick={() => setVatRate(r)}
                                    className={`py-2 rounded-lg text-sm font-bold transition-colors border ${vatRate === r ? 'bg-gold text-black border-gold' : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'}`}
                                >
                                    {r}%
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Visual */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0A0A0C] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center border border-white/10">
                        <div className="relative z-10">
                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Sugerowana Cena Sprzedaży</p>
                            <h3 className="text-5xl font-bold tracking-tight font-mono">{safeFormatCurrency(priceGross)}</h3>
                            <p className="text-sm text-zinc-500 mt-2">Brutto (z VAT)</p>
                        </div>
                        <div className="relative z-10 text-right mt-6 md:mt-0">
                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Cena Netto</p>
                            <h3 className="text-3xl font-bold text-white font-mono">{safeFormatCurrency(priceNet)}</h3>
                        </div>
                        {/* Deco */}
                        <div className="absolute right-0 top-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="neo-card p-4 rounded-xl border-l-4 border-l-emerald-500">
                            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Zysk "Na Rękę"</p>
                            <p className="text-2xl font-bold text-emerald-400 font-mono">{safeFormatCurrency(profit)}</p>
                            <p className="text-[10px] text-zinc-500 mt-1">Po podatku dochodowym (19%)</p>
                        </div>
                        <div className="neo-card p-4 rounded-xl border-l-4 border-l-rose-500">
                            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Podatki (VAT + PIT)</p>
                            <p className="text-2xl font-bold text-rose-400 font-mono">{safeFormatCurrency((priceGross - priceNet) + taxImpact)}</p>
                        </div>
                        <div className="neo-card p-4 rounded-xl border-l-4 border-l-indigo-500">
                            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Marża Kwotowa</p>
                            <p className="text-2xl font-bold text-indigo-400 font-mono">{safeFormatCurrency(priceNet - cost)}</p>
                        </div>
                    </div>

                    {/* Breakdown Bar */}
                    <div className="neo-card p-6 rounded-2xl">
                        <h4 className="font-bold text-white mb-4 text-sm">Struktura Ceny</h4>
                        <div className="h-8 w-full rounded-full overflow-hidden flex font-bold text-[10px] text-black">
                            <div className="bg-zinc-400 flex items-center justify-center" style={{width: `${(cost / priceGross) * 100}%`}} title="Koszt">KOSZT</div>
                            <div className="bg-rose-400 flex items-center justify-center" style={{width: `${(((priceGross - priceNet) + taxImpact) / priceGross) * 100}%`}} title="Podatki">PODATKI</div>
                            <div className="bg-emerald-400 flex items-center justify-center" style={{width: `${(profit / priceGross) * 100}%`}} title="Zysk">ZYSK</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
