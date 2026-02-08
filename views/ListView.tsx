
import React from 'react';
import { Contract } from '../types';

interface ListViewProps {
  contracts: Contract[];
  onSelect: (id: string) => void;
  isSelectionMode?: boolean;
  search: string;
  setSearch: (val: string) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ 
  contracts, 
  onSelect, 
  isSelectionMode,
  search,
  setSearch,
  activeCategory,
  setActiveCategory
}) => {
  const categories = ['All', 'Wlan-T1', 'Wlan-T2', 'Wlan-T3'];

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.client.toLowerCase().includes(search.toLowerCase()) || 
                         c.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
                         c.site.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear().toString().slice(-2);
    return `${d}/${m}/${y}`;
  };

  const getCatColor = (cat: string) => {
    if (cat.includes('T1')) {
      return 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300';
    }
    if (cat.includes('T2')) {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
    }
    if (cat.includes('T3')) {
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300';
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark safe-top relative overflow-hidden">
      
      <div className="bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-30 shadow-sm border-b border-gray-100 dark:border-white/5 shrink-0 px-4 pt-4 pb-2">
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-[13px] font-black tracking-[0.2em] text-sage-green dark:text-primary uppercase">
            {isSelectionMode ? 'Assign Target' : 'Customer List'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400">{filteredContracts.length} Contracts</span>
          </div>
        </header>

        <div className="flex flex-col gap-2">
          <div className="relative flex items-center h-10 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 focus-within:ring-2 focus-within:ring-sage-green/20 transition-all">
            <span className="absolute left-3 text-sage-green/40 material-symbols-outlined text-[18px]">search</span>
            <input 
              className="w-full h-full bg-transparent border-none focus:ring-0 text-[14px] pl-10 pr-10 text-slate-800 dark:text-slate-100 placeholder-sage-green/30 font-semibold" 
              placeholder="Search Site or Client..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-black shadow-sm transition-all active:scale-95 whitespace-nowrap uppercase tracking-widest ${
                  activeCategory === cat 
                    ? 'bg-sage-green text-white' 
                    : 'bg-white dark:bg-neutral-800 text-sage-green border border-sage-green/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 pb-24 pt-2 overflow-y-auto no-scrollbar bg-background-light dark:bg-background-dark scroll-container">
        <div className="flex flex-col gap-1.5">
          {filteredContracts.length > 0 ? (
            filteredContracts.map(c => {
              return (
                <div 
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className="relative flex items-center w-full py-3 px-4 rounded-xl bg-white dark:bg-neutral-800 border border-transparent shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex-1 flex flex-col min-w-0 pr-4">
                    <span className="font-bold text-[14px] text-slate-900 dark:text-slate-50 truncate leading-tight">
                      {c.client}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[12px] text-sage-green dark:text-sage-light font-extrabold truncate">
                        {c.site}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter shrink-0 ${getCatColor(c.category)}`}>
                        {c.category}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight truncate">
                        #{c.contractNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">Hour worked:</span>
                      <span className="text-[12px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                        {c.remainingHours.split(' ')[0]}H
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight whitespace-nowrap">Expiring date:</span>
                      <span className="text-[12px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                        {formatDate(c.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <span className="material-symbols-outlined text-5xl mb-3">search_off</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Empty Search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListView;
