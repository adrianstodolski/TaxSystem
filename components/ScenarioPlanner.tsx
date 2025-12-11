
import React, { useState, useEffect } from 'react';
import { Calculator, ShoppingCart, TrendingDown, ArrowRight, Info, Car, Monitor, Coffee } from 'lucide-react';
import { CostCategory, SimulationParams, SimulationResult, TaxationForm } from '../types';
import { NuffiService } from '../services/api';

export const ScenarioPlanner: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    amountGross: 5000,
    vatRate: 0.23,
    category: CostCategory.OPERATIONAL_100,
    taxationForm: TaxationForm.GENERAL_SCALE
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runSimulation();
  }, [params.amountGross, params.category, params.vatRate]); // Auto-recalculate

  const runSimulation = async () => {
    setLoading(true);
    const res = await NuffiService.runSimulation(params);
    setResult(res);
    setLoading(false);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="border-b border-white/10 pb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calculator className="text-indigo-400" /> Symulator Podatkowy
        </h2>
        <p className="text-slate-400 mt-1">Sprawdź, ile realnie kosztuje inwestycja po uwzględnieniu tarczy podatkowej (VAT + PIT).</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Inputs */}
        <div className="glass-card p-6 rounded-2xl shadow-sm border border-white/10 space-y-6">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">Parametry Inwestycji</h3>
            
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Kwota Brutto</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={params.amountGross}
                        onChange={(e) => setParams({...params, amountGross: parseFloat(e.target.value) || 0})}
                        className="w-full pl-4 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-bold text-white placeholder-slate-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">PLN</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Rodzaj Wydatku (Kategoria)</label>
                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => setParams({...params, category: CostCategory.OPERATIONAL_100})}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${params.category === CostCategory.OPERATIONAL_100 ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-900/30 border-slate-700 hover:bg-slate-800'}`}
                    >
                        <div className="bg-indigo-500/20 p-2 rounded text-indigo-400"><Monitor size={18} /></div>
                        <div className="text-left">
                            <span className="block font-bold text-sm text-white">Sprzęt / Usługi</span>
                            <span className="block text-xs text-slate-400">100% VAT, 100% PIT</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => setParams({...params, category: CostCategory.FUEL_75})}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${params.category === CostCategory.FUEL_75 ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-900/30 border-slate-700 hover:bg-slate-800'}`}
                    >
                        <div className="bg-orange-500/20 p-2 rounded text-orange-400"><Car size={18} /></div>
                        <div className="text-left">
                            <span className="block font-bold text-sm text-white">Samochód Mieszany</span>
                            <span className="block text-xs text-slate-400">50% VAT, 75% PIT</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => setParams({...params, category: CostCategory.REPRESENTATION_0})}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${params.category === CostCategory.REPRESENTATION_0 ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-900/30 border-slate-700 hover:bg-slate-800'}`}
                    >
                        <div className="bg-rose-500/20 p-2 rounded text-rose-400"><Coffee size={18} /></div>
                        <div className="text-left">
                            <span className="block font-bold text-sm text-white">Reprezentacja</span>
                            <span className="block text-xs text-slate-400">Brak odliczeń</span>
                        </div>
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Stawka VAT</label>
                <select 
                    value={params.vatRate}
                    onChange={(e) => setParams({...params, vatRate: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900/50 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value={0.23}>23% (Standardowa)</option>
                    <option value={0.08}>8% (Obniżona)</option>
                    <option value={0}>zw. (Zwolniona)</option>
                </select>
            </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
            {/* Big Impact Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl text-white p-8 rounded-2xl shadow-xl relative overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-slate-400 font-medium mb-1">Cena "na półce" (Brutto)</p>
                        <h3 className="text-3xl font-bold font-mono">{formatCurrency(params.amountGross)}</h3>
                        
                        <div className="mt-8 flex items-center gap-3">
                            <ArrowRight className="text-indigo-400" />
                            <div>
                                <p className="text-slate-400 font-medium mb-1">Twój Realny Koszt</p>
                                <h3 className="text-4xl font-bold text-emerald-400 font-mono">
                                    {result ? formatCurrency(result.realCost) : '...'}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-2 mb-2 text-indigo-400">
                                <TrendingDown size={20} />
                                <span className="font-bold uppercase text-xs tracking-wider">Oszczędność Podatkowa</span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1 font-mono">
                                {result ? formatCurrency(result.totalSavings) : '...'}
                            </div>
                            <div className="text-sm text-slate-400">
                                Taniej o {result ? (result.percentSaved * 100).toFixed(1) : 0}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown */}
            {result && (
                <div className="glass-card p-6 rounded-2xl shadow-sm border border-white/10">
                     <h3 className="font-bold text-white mb-6">Analiza Tarczy Podatkowej</h3>
                     
                     <div className="space-y-4">
                        {/* VAT Part */}
                        <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/20 text-blue-300 p-1.5 rounded font-bold text-xs border border-blue-500/30">VAT</div>
                                <span className="text-slate-300 font-medium">Odliczenie VAT ({((result.vatDeductible / result.vatTotal || 0) * 100).toFixed(0)}%)</span>
                            </div>
                            <span className="font-bold text-blue-400 font-mono">-{formatCurrency(result.vatDeductible)}</span>
                        </div>

                        {/* PIT Part */}
                        <div className="flex justify-between items-center p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500/20 text-emerald-300 p-1.5 rounded font-bold text-xs border border-emerald-500/30">PIT</div>
                                <div>
                                    <span className="block text-slate-300 font-medium">Obniżenie Podatku Dochodowego</span>
                                    <span className="text-xs text-slate-500">
                                        Koszt uzyskania: {formatCurrency(result.pitDeductibleAmount)}
                                    </span>
                                </div>
                            </div>
                            <span className="font-bold text-emerald-400 font-mono">-{formatCurrency(result.pitTaxShield)}</span>
                        </div>
                     </div>

                     <div className="mt-6 flex gap-3 text-xs text-slate-500">
                        <Info size={16} className="shrink-0" />
                        <p>Symulacja przyjmuje stawkę opodatkowania dochodowego 12% (I próg skali). W przypadku przekroczenia progu lub podatku liniowego (19%) oszczędności mogą być wyższe.</p>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
