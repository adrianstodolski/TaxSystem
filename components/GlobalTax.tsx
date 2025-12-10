
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { CountryTaxProfile, ForeignIncome, CrossBorderResult } from '../types';
import { Globe, Map, Calculator, ArrowRight, Info, CheckCircle2, TrendingDown, Flag, Scale } from 'lucide-react';
import { toast } from './ui/Toast';
import { Loader2 } from 'lucide-react';

export const GlobalTax: React.FC = () => {
    const [countries, setCountries] = useState<CountryTaxProfile[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('DE');
    const [incomeAmount, setIncomeAmount] = useState<string>('50000');
    const [taxPaid, setTaxPaid] = useState<string>('12000');
    const [result, setResult] = useState<CrossBorderResult | null>(null);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchCountryTaxRules();
            setCountries(data);
        };
        load();
    }, []);

    const handleCalculate = async () => {
        setCalculating(true);
        const country = countries.find(c => c.countryCode === selectedCountry);
        if (!country) return;

        const income: ForeignIncome = {
            country: selectedCountry,
            amountForeignCurrency: parseFloat(incomeAmount),
            currency: selectedCountry === 'UK' ? 'GBP' : selectedCountry === 'US' ? 'USD' : 'EUR',
            taxPaidForeignCurrency: parseFloat(taxPaid),
            type: 'EMPLOYMENT'
        };

        const res = await NuffiService.calculateCrossBorderTax([income]);
        setResult(res);
        setCalculating(false);
        toast.success('Przeliczono', 'Symulacja PIT-ZG zakończona.');
    };

    const formatCurrency = (val: number, curr = 'PLN') => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);

    const currentCountry = countries.find(c => c.countryCode === selectedCountry);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Globe className="text-indigo-600" /> Nuffi Global (Cross-Border)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Rozliczenia dochodów zagranicznych, PIT-ZG i optymalizacja rezydencji.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Map size={20} className="text-slate-400" /> Konfiguracja Źródła
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Kraj Źródła Dochodu</label>
                            <div className="grid grid-cols-3 gap-3">
                                {countries.map(c => (
                                    <button 
                                        key={c.countryCode}
                                        onClick={() => setSelectedCountry(c.countryCode)}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedCountry === c.countryCode ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
                                    >
                                        <span className="text-2xl mb-1">{c.flag}</span>
                                        <span className="text-xs font-bold text-slate-700">{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Dochód Brutto</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={incomeAmount}
                                        onChange={e => setIncomeAmount(e.target.value)}
                                        className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                        {selectedCountry === 'UK' ? 'GBP' : selectedCountry === 'US' ? 'USD' : 'EUR'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Podatek Zapłacony</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={taxPaid}
                                        onChange={e => setTaxPaid(e.target.value)}
                                        className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                        {selectedCountry === 'UK' ? 'GBP' : selectedCountry === 'US' ? 'USD' : 'EUR'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {currentCountry && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-500">Metoda unikania (UPO):</span>
                                    <span className="font-bold text-indigo-700">
                                        {currentCountry.dttMethod === 'EXEMPTION_WITH_PROGRESSION' ? 'Wyłączenie z Progresją' : 'Odliczenie Proporcjonalne'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Stawka CIT (Lokalna):</span>
                                    <span className="font-bold text-slate-900">{currentCountry.taxRateCorporate}%</span>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleCalculate}
                            disabled={calculating}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            {calculating ? <Loader2 className="animate-spin" /> : <><Calculator size={18} /> Symuluj Podatek (PL + Zagranica)</>}
                        </button>
                    </div>
                </div>

                {/* Result Panel */}
                <div className={`p-8 rounded-2xl border transition-all relative overflow-hidden ${result ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-50 border-dashed border-slate-300 flex items-center justify-center'}`}>
                    {!result ? (
                        <div className="text-center text-slate-400">
                            <Globe size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Wprowadź dane, aby zobaczyć symulację.</p>
                        </div>
                    ) : (
                        <div className="relative z-10 animate-in fade-in">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Scale size={20} className="text-indigo-600" /> Wynik Symulacji
                            </h3>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-slate-500 text-sm">Metoda</span>
                                    <span className="font-bold text-indigo-600 text-sm bg-white px-2 py-1 rounded border border-indigo-100">{result.methodUsed}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Dochód Zagraniczny (PLN)</span>
                                    <span className="font-mono font-bold text-slate-900">{formatCurrency(result.foreignTaxBasePln)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Podatek zapłacony za granicą</span>
                                    <span className="font-mono text-slate-500">{formatCurrency(result.foreignTaxPaidPln)}</span>
                                </div>
                                <div className="w-full border-t border-slate-200 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Efektywna stawka (Stopa %)</span>
                                    <span className="font-mono font-bold text-indigo-600">{(result.effectiveRate * 100).toFixed(2)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Dopłata w Polsce (PIT-ZG)</span>
                                    <span className={`font-mono font-bold text-xl ${result.additionalPaymentPl > 0 ? 'text-rose-600' : 'text-green-600'}`}>
                                        {formatCurrency(result.additionalPaymentPl)}
                                    </span>
                                </div>
                            </div>

                            {result.additionalPaymentPl > 0 && (
                                <div className="mt-6 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-3 text-xs text-amber-800">
                                    <Info size={16} className="shrink-0 mt-0.5" />
                                    <p>
                                        Występuje obowiązek dopłaty różnicy podatkowej w Polsce (metoda odliczenia proporcjonalnego). 
                                        Możesz spróbować skorzystać z ulgi abolicyjnej (limit 1360 PLN).
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Deco */}
                    {result && <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>}
                </div>
            </div>
        </div>
    );
};
