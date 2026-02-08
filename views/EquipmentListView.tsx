
import React from 'react';
import { Contract } from '../types';

interface EquipmentListViewProps {
  contract: Contract;
  onBack: () => void;
}

const EquipmentListView: React.FC<EquipmentListViewProps> = ({ contract, onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="flex items-center justify-between px-5 py-6 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/5">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#2a3521] shadow-sm text-text-dark dark:text-white"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-text-dark dark:text-white text-lg font-bold tracking-tight">Equipment Inventory</h2>
          <span className="text-[10px] text-sage-green font-bold uppercase tracking-widest">{contract.client}</span>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-5 py-6 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-4">
          {contract.equipment.length > 0 ? (
            contract.equipment.map((eq, idx) => (
              <div key={idx} className="bg-white dark:bg-[#252b1f] p-4 rounded-2xl shadow-sm border border-[#EBECE8] dark:border-[#2f3826] flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Model Name</p>
                    <h3 className="text-text-dark dark:text-white font-bold text-base">{eq.model}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    eq.status === 'Active' 
                      ? 'bg-primary/20 text-sage-green border-primary/30' 
                      : 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-white/5 dark:border-white/10'
                  }`}>
                    {eq.status}
                  </span>
                </div>
                <div className="h-px bg-gray-50 dark:bg-white/5 w-full"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Serial Number</p>
                    <p className="text-xs font-mono font-semibold text-sage-green dark:text-primary">{eq.sn}</p>
                  </div>
                  <button className="flex items-center justify-center size-8 rounded-lg bg-sage-green/10 text-sage-green">
                    <span className="material-symbols-outlined text-sm">history</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">inventory_2</span>
              <p className="text-sm font-medium">No equipment records found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EquipmentListView;
