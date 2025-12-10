
import React, { useEffect, useState } from 'react';
import { Asset, AssetCategory } from '../types';
import { NuffiService } from '../services/api';
import { Box, Plus, Calendar, TrendingDown, Server, Smartphone, Car, Armchair, Code, HelpCircle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';

const getIcon = (cat: AssetCategory) => {
    switch(cat) {
        case AssetCategory.COMPUTER: return <Server size={20} />;
        case AssetCategory.PHONE: return <Smartphone size={20} />;
        case AssetCategory.CAR: return <Car size={20} />;
        case AssetCategory.FURNITURE: return <Armchair size={20} />;
        case AssetCategory.SOFTWARE: return <Code size={20} />;
        default: return <HelpCircle size={20} />;
    }
};

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  
  // New Asset Form
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState(0);
  const [newCategory, setNewCategory] = useState<AssetCategory>(AssetCategory.COMPUTER);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    const data = await NuffiService.fetchAssets();
    setAssets(data);
    setLoading(false);
  };

  const handleAddAsset = async () => {
    if(!newName || newValue <= 0) return;
    setAdding(true);
    await NuffiService.addAsset(newName, newCategory, newValue, newDate);
    toast.success('Dodano środek trwały', `${newName} został wprowadzony do ewidencji.`);
    await loadAssets();
    setAdding(false);
    setAddModalOpen(false);
    setNewName(''); setNewValue(0);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Box className="text-indigo-600" /> Ewidencja Majątku
          </h2>
          <p className="text-gray-500">Zarządzanie środkami trwałymi i planem amortyzacji.</p>
        </div>
        <button 
          onClick={() => setAddModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 flex items-center gap-2 font-bold"
        >
          <Plus size={18} /> Dodaj składnik
        </button>
      </header>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? [1,2].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />) : assets.map(asset => {
              const progress = ((asset.initialValue - asset.currentValue) / asset.initialValue) * 100;
              return (
                <div key={asset.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600">
                                {getIcon(asset.category)}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{asset.name}</h4>
                                <p className="text-xs text-gray-500">{asset.category}</p>
                            </div>
                        </div>
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {(asset.amortizationRate * 100).toFixed(0)}% / rok
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Wartość początkowa</p>
                            <p className="font-bold text-gray-900">{formatCurrency(asset.initialValue)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Pozostało netto</p>
                            <p className="font-bold text-indigo-600">{formatCurrency(asset.currentValue)}</p>
                        </div>
                    </div>

                    <div className="mb-2 flex justify-between text-xs text-gray-500">
                        <span>Amortyzacja</span>
                        <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{width: `${progress}%`}}></div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} /> Zakup: {asset.purchaseDate}
                    </div>
                </div>
              );
          })}
      </div>

      {/* Amortization Schedule Preview (For first asset) */}
      {assets.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingDown size={18} className="text-gray-400" /> Plan Amortyzacji ({assets[0].name})
              </h3>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                      <thead>
                          <tr className="border-b border-gray-100 text-gray-500">
                              <th className="py-2">Okres</th>
                              <th className="py-2 text-right">Odpis (KUP)</th>
                              <th className="py-2 text-right">Wartość Końcowa</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {assets[0].schedule.slice(0, 6).map((item, i) => (
                              <tr key={i}>
                                  <td className="py-2 text-gray-700">{item.year} / {item.month.toString().padStart(2, '0')}</td>
                                  <td className="py-2 text-right font-medium text-green-600">+{formatCurrency(item.writeOffAmount)}</td>
                                  <td className="py-2 text-right text-gray-500">{formatCurrency(item.remainingValue)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  <div className="mt-2 text-center text-xs text-gray-400 italic">Pokazano 6 pierwszych rat...</div>
              </div>
          </div>
      )}

      {/* ADD ASSET MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Dodaj Środek Trwały">
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa składnika</label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="np. Laptop Dell XPS" 
                  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria KŚT</label>
                      <select 
                        value={newCategory} 
                        onChange={e => setNewCategory(e.target.value as AssetCategory)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                          {Object.values(AssetCategory).map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data zakupu</label>
                      <input 
                        type="date" 
                        value={newDate}
                        onChange={e => setNewDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                       />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wartość Początkowa (Netto + VAT nieodliczony)</label>
                  <input 
                    type="number" 
                    value={newValue} 
                    onChange={e => setNewValue(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold" 
                   />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                  <button onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Anuluj</button>
                  <button 
                    onClick={handleAddAsset} 
                    disabled={adding}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold disabled:opacity-50"
                  >
                      {adding ? 'Dodawanie...' : 'Zapisz'}
                  </button>
              </div>
          </div>
      </Modal>
    </div>
  );
};
