
import React, { useState, useRef, useEffect } from 'react';
import { Contract, Contact, HourLog } from '../types';

interface DetailsViewProps {
  contract: Contract;
  currentUserName?: string;
  onBack: () => void;
  onAddLog: () => void;
  onEditLog: (logId: string) => void;
  onViewEquipment: () => void;
  onViewLogs: (logId?: string) => void;
  onViewContracts: () => void;
}

const DetailsView: React.FC<DetailsViewProps> = ({ 
  contract, 
  currentUserName,
  onBack, 
  onAddLog, 
  onEditLog,
  onViewEquipment, 
  onViewLogs,
  onViewContracts
}) => {
  const [activeContactMenu, setActiveContactMenu] = useState<Contact | null>(null);
  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const previewLogs = contract.hourLogs.slice(0, 5);

  // Auto-dismiss permission error toast
  useEffect(() => {
    if (permissionError) {
      const timer = setTimeout(() => setPermissionError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [permissionError]);

  // Handle scroll to toggle header title
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowStickyTitle(scrollRef.current.scrollTop > 80);
      }
    };

    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleLogClick = (log: HourLog) => {
    if (!currentUserName) {
      setPermissionError("Please sign in to edit your logs.");
      return;
    }

    const simplifiedCurrentName = currentUserName.split(' ')[0].toLowerCase();
    const simplifiedEngineerName = log.engineer.toLowerCase();

    if (simplifiedCurrentName === simplifiedEngineerName) {
      onEditLog(log.id);
    } else {
      setPermissionError(`You do not have permission to edit ${log.engineer}'s logs.`);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setActiveContactMenu(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden safe-top relative">
      {/* Dynamic Header */}
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm text-text-dark dark:text-white transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-2">
          {!showStickyTitle ? (
            <h2 className="text-text-dark dark:text-white text-[14px] font-black uppercase tracking-widest animate-hyper-reveal">Details</h2>
          ) : (
            <div className="flex flex-col items-center animate-hyper-reveal">
              <h2 className="text-text-dark dark:text-white text-[13px] font-black truncate max-w-full leading-tight">
                {contract.client}
              </h2>
              <span className="text-sage-green text-[9px] font-black uppercase tracking-widest truncate max-w-full">
                {contract.site}
              </span>
            </div>
          )}
        </div>

        <div className="w-11"></div>
      </header>

      <main 
        ref={scrollRef}
        className="flex-1 px-4 pb-32 pt-4 overflow-y-auto no-scrollbar scroll-container"
      >
        <div className="flex flex-col gap-5">
          
          {/* Main Info Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="text-text-dark dark:text-white text-xl font-black tracking-tight leading-tight">{contract.client}</h1>
                  <span className="text-sage-green/60 text-[11px] font-black uppercase tracking-widest shrink-0">{contract.site}</span>
                </div>
                <div className="flex items-start gap-1 mt-1.5 text-gray-400 dark:text-gray-500 group">
                  <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">location_on</span>
                  <span className="text-[11px] font-semibold leading-relaxed line-clamp-2">{contract.location}</span>
                </div>
              </div>
              <div className="shrink-0 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                <span className="text-sage-green text-[9px] font-black uppercase tracking-[0.2em]">{contract.status}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 py-4 border-y border-gray-50 dark:border-white/5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Syteline Contract Number</span>
                <span className="text-text-dark dark:text-white text-sm font-bold font-mono">{contract.contractNumber}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contract Type</span>
                  <span className="text-text-dark dark:text-white text-xs font-bold truncate">{contract.contractPlan}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Expires Date</span>
                  <span className="text-text-dark dark:text-white text-xs font-bold">{contract.endDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contract Detail</span>
                 <p className="text-text-dark dark:text-white text-[13px] font-semibold leading-relaxed">
                   {contract.serviceContent}
                 </p>
               </div>
               
               <div className="flex gap-2 pt-2">
                 <button 
                  onClick={onViewContracts}
                  className="w-full flex h-14 items-center justify-center gap-3 rounded-2xl bg-sage-green text-white shadow-lg active:scale-95 transition-all"
                 >
                    <span className="material-symbols-outlined text-[22px]">description</span>
                    <span className="text-[12px] font-black uppercase tracking-[0.1em]">View Contract Documents</span>
                 </button>
               </div>
            </div>
          </div>

          {/* Site Contacts Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-[11px] font-black text-sage-green uppercase tracking-[0.2em] mb-4">Site Contacts</h3>
            <div className="flex flex-col gap-4">
              {contract.contacts.map((contact, idx) => (
                <div key={idx} className="flex flex-col p-4 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-text-dark dark:text-white">{contact.name}</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{contact.role}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <a 
                      href={`tel:${contact.phone}`} 
                      className="flex items-center gap-2 text-sage-green active:opacity-60 transition-all group"
                    >
                      <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">call</span>
                      <span className="text-[13px] font-bold font-mono tracking-tight underline underline-offset-4 decoration-sage-green/30">{contact.phone}</span>
                    </a>
                    
                    <button 
                      onClick={() => setActiveContactMenu(contact)}
                      className="flex items-center gap-2 text-sage-green active:opacity-60 transition-all group w-full text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">mail</span>
                      <span className="text-[13px] font-bold truncate underline underline-offset-4 decoration-sage-green/30">{contact.email}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hour Worked Section - Updated with Permission Logic */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black text-sage-green uppercase tracking-[0.2em]">Hour Worked</h3>
              <button 
                onClick={() => onViewLogs()}
                className="flex items-center gap-1 text-sage-green text-[10px] font-black uppercase tracking-widest bg-sage-green/5 px-2.5 py-1 rounded-full active:scale-95 transition-all"
              >
                See all
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {previewLogs.map((log) => (
                <button 
                  key={log.id} 
                  onClick={() => handleLogClick(log)}
                  className="bg-white dark:bg-neutral-900 p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer shadow-sm text-left group"
                >
                  <div className="flex flex-col pr-4 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[10px] font-black text-text-dark dark:text-white uppercase tracking-tight">{log.date}</span>
                      <span className="text-[10px] text-gray-300 font-bold">•</span>
                      <span className="text-[10px] font-black text-sage-green uppercase tracking-tight">{log.engineer}</span>
                    </div>
                    <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{log.description}</p>
                  </div>
                  <div className="shrink-0 bg-sage-green/5 group-active:bg-sage-green/10 px-3 py-2 rounded-2xl border border-sage-green/10 flex flex-col items-center min-w-[54px] transition-colors">
                    <p className="text-[16px] font-black text-sage-green leading-none">{parseFloat(log.duration).toFixed(1)}</p>
                    <span className="text-[8px] font-black text-sage-green/40 uppercase mt-0.5">hrs</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Permission Notification Toast */}
      {permissionError && (
        <div className="fixed bottom-24 left-4 right-4 z-[200] flex justify-center animate-hyper-reveal pointer-events-none">
          <div className="bg-background-dark/80 dark:bg-white/10 backdrop-blur-xl border border-white/10 dark:border-white/5 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500">lock</span>
            <span className="text-white text-[12px] font-bold">{permissionError}</span>
          </div>
        </div>
      )}

      {/* Action Menu Overlay */}
      {activeContactMenu && (
        <div 
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 safe-bottom"
          onClick={() => setActiveContactMenu(null)}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-sage-green uppercase tracking-[0.2em]">Email Options</span>
                <span className="text-[13px] font-bold text-text-dark dark:text-white truncate max-w-[200px]">{activeContactMenu.email}</span>
              </div>
              <button 
                onClick={() => setActiveContactMenu(null)}
                className="size-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleCopyEmail(activeContactMenu.email)}
                className="w-full flex h-14 items-center gap-4 px-6 rounded-2xl bg-gray-50 dark:bg-white/5 active:bg-sage-green/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sage-green">content_copy</span>
                <span className="text-[14px] font-bold text-text-dark dark:text-white">Copy Email Address</span>
              </button>
              
              <a 
                href={`mailto:${activeContactMenu.email}`}
                className="w-full flex h-14 items-center gap-4 px-6 rounded-2xl bg-sage-green text-white shadow-lg shadow-sage-green/20 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined">send</span>
                <span className="text-[14px] font-bold">Send Email Now</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6 z-50">
        <button 
          onClick={onAddLog}
          className="flex items-center justify-center bg-sage-green text-white size-16 rounded-full shadow-2xl shadow-sage-green/40 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </div>
    </div>
  );
};

export default DetailsView;
