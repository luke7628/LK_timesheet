
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Contract } from '../types';

interface HourLogHistoryViewProps {
  contract: Contract;
  highlightLogId: string | null;
  onBack: () => void;
}

const HourLogHistoryView: React.FC<HourLogHistoryViewProps> = ({ contract, highlightLogId, onBack }) => {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extract years from logs for the filter bar
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    contract.hourLogs.forEach(log => {
      // Assuming date format DD/MM/YY
      const parts = log.date.split('/');
      if (parts.length === 3) {
        years.add(`20${parts[2]}`);
      }
    });
    return ['All', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
  }, [contract.hourLogs]);

  // Filter and Sort Logs
  const filteredLogs = useMemo(() => {
    let logs = [...contract.hourLogs];
    
    // Sort: Newest to Oldest
    logs.sort((a, b) => {
      const dateA = a.date.split('/').reverse().join('');
      const dateB = b.date.split('/').reverse().join('');
      return dateB.localeCompare(dateA);
    });

    if (selectedYear !== 'All') {
      return logs.filter(log => log.date.endsWith(selectedYear.slice(-2)));
    }
    return logs;
  }, [contract.hourLogs, selectedYear]);

  // Handle auto-scroll to highlighted log
  useEffect(() => {
    if (highlightLogId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`log-${highlightLogId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightLogId]);

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden safe-top">
      {/* Sticky Top Section */}
      <div className="bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-30 shadow-sm border-b border-gray-100 dark:border-white/5 shrink-0 px-4 pt-4 pb-2">
        <header className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm text-text-dark dark:text-white transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-text-dark dark:text-white text-[13px] font-black uppercase tracking-widest">Hour Worked</h2>
            <p className="text-sage-green text-[10px] font-bold truncate max-w-[150px] uppercase">{contract.client}</p>
          </div>
          <div className="w-11 flex justify-end">
            <span className="text-[10px] font-black text-gray-400">{filteredLogs.length}</span>
          </div>
        </header>

        {/* Year Filter Bar */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-[10px] font-black shadow-sm transition-all active:scale-95 whitespace-nowrap uppercase tracking-widest ${
                selectedYear === year 
                  ? 'bg-sage-green text-white' 
                  : 'bg-white dark:bg-neutral-800 text-sage-green border border-sage-green/5'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <main ref={scrollContainerRef} className="flex-1 px-4 py-4 overflow-y-auto no-scrollbar scroll-container bg-background-light dark:bg-background-dark">
        <div className="flex flex-col gap-2">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const isHighlighted = highlightLogId === log.id;
              return (
                <div 
                  id={`log-${log.id}`}
                  key={log.id} 
                  className={`bg-white dark:bg-neutral-900 p-5 rounded-[2rem] border shadow-sm transition-all ${
                    isHighlighted 
                      ? 'border-sage-green ring-2 ring-sage-green/10' 
                      : 'border-gray-100 dark:border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${isHighlighted ? 'bg-sage-green animate-ping' : 'bg-sage-green/40'}`}></div>
                      <span className="text-[11px] font-black text-sage-green uppercase tracking-widest">{log.date}</span>
                    </div>
                    <div className="bg-sage-green/10 px-2 py-0.5 rounded-lg border border-sage-green/10">
                      <span className="text-[11px] font-black text-sage-green">
                        {log.duration.split(' ')[0]} <span className="text-[8px] opacity-40">HRS</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* description shows all content here */}
                  <p className="text-[14px] font-bold text-text-dark dark:text-white leading-snug mb-3">
                    {log.description}
                  </p>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-white/5">
                    <div className="size-6 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-gray-400">person</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">
                      {log.engineer}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-24 opacity-30">
              <span className="material-symbols-outlined text-5xl mb-3">event_busy</span>
              <p className="text-[10px] font-black uppercase tracking-widest">No entries for this year</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HourLogHistoryView;
