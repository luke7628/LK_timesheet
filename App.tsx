
import React, { useState, useEffect, useCallback } from 'react';
import { View, Contract, HourLog, SyncStatus } from './types';
import { apiService } from './services/apiService';
import { initializationService } from './services/initializationService';
import SplashView from './views/SplashView';
import ListView from './views/ListView';
import DetailsView from './views/DetailsView';
import AddLogView from './views/AddLogView';
import EditLogView from './views/EditLogView';
import EquipmentListView from './views/EquipmentListView';
import HourLogHistoryView from './views/HourLogHistoryView';
import ContractDocumentsView from './views/ContractDocumentsView';
import PdfPreviewerView from './views/PdfPreviewerView';
import LoginView from './views/LoginView';
import ProfileView from './views/ProfileView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.SPLASH);
  const [viewStack, setViewStack] = useState<View[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState<string | null>(null);
  const [highlightedLogId, setHighlightedLogId] = useState<string | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [logDate, setLogDate] = useState<string | null>(null);

  const [profileViewMode, setProfileViewMode] = useState<'week' | 'month' | 'year'>('week');
  const [profileAnchorDate, setProfileAnchorDate] = useState(new Date());
  const [listSearch, setListSearch] = useState('');
  const [listCategory, setListCategory] = useState('All');

  const refreshData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [data, status] = await Promise.all([
        apiService.getContracts(),
        apiService.getSyncStatus()
      ]);
      setContracts(data);
      setSyncStatus(status);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // 初始化：加载本地 Excel 数据库
  useEffect(() => {
    const initialize = async () => {
      await initializationService.loadInitialData();
      await refreshData();
    };
    initialize();
  }, [refreshData]);

  useEffect(() => {
    if (currentView === View.SPLASH) {
      const timer = setTimeout(() => {
        setCurrentView(View.LIST);
        setViewStack([]);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const pushView = (nextView: View) => {
    setViewStack(prev => [...prev, currentView]);
    setCurrentView(nextView);
  };

  const popView = () => {
    if (viewStack.length > 0) {
      const lastView = viewStack[viewStack.length - 1];
      setViewStack(prev => prev.slice(0, -1));
      setCurrentView(lastView);
      if (lastView === View.LIST || lastView === View.PROFILE) {
        setLogDate(null);
      }
    } else {
      setCurrentView(View.LIST);
    }
  };

  const switchRootView = (rootView: View) => {
    setViewStack([]);
    setCurrentView(rootView);
    setLogDate(null);
  };

  const handleContractSelect = (id: string) => {
    setSelectedContractId(id);
    if (logDate || currentView === View.PROFILE) {
      pushView(View.ADD_LOG);
    } else {
      pushView(View.DETAILS);
    }
  };

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    switchRootView(View.PROFILE);
  };

  const handleAddLog = async (log: Partial<HourLog>) => {
    if (!selectedContractId) return;
    setLoading(true);
    try {
      const updatedContract = await apiService.addHourLog(selectedContractId, log, isLoggedIn ? userName : 'You');
      setContracts(prev => prev.map(c => c.id === selectedContractId ? updatedContract : c));
      const status = await apiService.getSyncStatus();
      setSyncStatus(status);
      popView();
    } catch (err) {
      alert("Error saving log.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLog = async (log: Partial<HourLog>) => {
    if (!selectedContractId || !selectedLogId) return;
    setLoading(true);
    try {
      const updatedContract = await apiService.updateHourLog(selectedContractId, selectedLogId, log);
      setContracts(prev => prev.map(c => c.id === selectedContractId ? updatedContract : c));
      const status = await apiService.getSyncStatus();
      setSyncStatus(status);
      popView();
    } catch (err) {
      alert("Error updating log.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileAddLog = (contractId?: string, date?: string) => {
    setLogDate(date || null);
    if (contractId) {
      setSelectedContractId(contractId);
      pushView(View.ADD_LOG);
    } else {
      pushView(View.LIST);
    }
  };

  const selectedContract = contracts.find(c => c.id === selectedContractId);
  const selectedLog = selectedContract?.hourLogs.find(l => l.id === selectedLogId);
  const showBottomNav = currentView === View.LIST || currentView === View.PROFILE;

  return (
    <div className="flex justify-center h-[100dvh] w-full bg-gray-100 dark:bg-neutral-950 overflow-hidden">
      <div className="w-full xl:max-w-4xl bg-background-light dark:bg-background-dark h-full relative shadow-2xl overflow-hidden flex flex-col transition-all">
        
        {loading && currentView !== View.SPLASH && (
          <div className="absolute inset-0 z-[200] bg-background-light/40 dark:bg-background-dark/60 backdrop-blur-[16px] flex flex-col items-center justify-center overflow-hidden">
             <div className="relative flex flex-col items-center animate-hyper-reveal">
                <div className="relative size-32 backdrop-blur-[30px] bg-white/40 dark:bg-black/50 rounded-[2.2rem] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
                   <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute top-0 bottom-0 w-[60%] bg-gradient-to-r from-transparent via-sage-green/15 to-transparent animate-shimmer"></div>
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-sage-green text-4xl font-light drop-shadow-sm select-none animate-spin">sync</span>
                   </div>
                   <div className="absolute inset-0 shadow-[inset_0_-4px_12px_rgba(114,136,99,0.1)] pointer-events-none"></div>
                </div>
                <div className="mt-10 flex flex-col items-center">
                   <h3 className="text-sage-green text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Database</h3>
                </div>
             </div>
          </div>
        )}

        <div className="flex-1 relative flex flex-col overflow-hidden">
          {currentView === View.SPLASH && <SplashView />}
          {currentView === View.LIST && (
            <ListView 
              contracts={contracts} 
              onSelect={handleContractSelect} 
              isSelectionMode={!!logDate} 
              search={listSearch}
              setSearch={setListSearch}
              activeCategory={listCategory}
              setActiveCategory={setListCategory}
            />
          )}
          {currentView === View.LOGIN && <LoginView onBack={popView} onLogin={handleLogin} />}
          {currentView === View.PROFILE && (
            <ProfileView 
              userName={userName} 
              contracts={contracts} 
              onLogout={() => { setIsLoggedIn(false); switchRootView(View.LOGIN); }} 
              onContractSelect={handleContractSelect} 
              onAddLog={handleProfileAddLog} 
              onEditLog={(cid, lid) => { setSelectedContractId(cid); setSelectedLogId(lid); pushView(View.EDIT_LOG); }}
              viewMode={profileViewMode}
              setViewMode={setProfileViewMode}
              anchorDate={profileAnchorDate}
              setAnchorDate={setProfileAnchorDate}
              syncStatus={syncStatus}
              onSyncRequest={() => refreshData()}
            />
          )}
          
          {currentView === View.DETAILS && selectedContract && (
            <DetailsView 
              contract={selectedContract} 
              currentUserName={isLoggedIn ? userName : undefined}
              onBack={popView} 
              onAddLog={() => pushView(View.ADD_LOG)} 
              onEditLog={(logId) => { setSelectedLogId(logId); pushView(View.EDIT_LOG); }}
              onViewEquipment={() => pushView(View.EQUIPMENT_LIST)} 
              onViewLogs={(logId) => { setHighlightedLogId(logId || null); pushView(View.HOUR_LOG_HISTORY); }}
              onViewContracts={() => pushView(View.CONTRACT_DOCUMENTS)}
            />
          )}

          {currentView === View.CONTRACT_DOCUMENTS && selectedContract && (
            <ContractDocumentsView 
              contract={selectedContract} 
              onBack={popView} 
              onViewPdf={(name) => { setSelectedPdfName(name); pushView(View.PDF_VIEWER); }}
            />
          )}

          {currentView === View.PDF_VIEWER && (
            <PdfPreviewerView 
              fileName={selectedPdfName || 'Document.pdf'} 
              onBack={popView} 
            />
          )}

          {currentView === View.ADD_LOG && selectedContract && (
            <AddLogView 
              contract={selectedContract} 
              initialDate={logDate || undefined} 
              onBack={popView} 
              onSubmit={handleAddLog} 
            />
          )}

          {currentView === View.EDIT_LOG && selectedContract && selectedLog && (
            <EditLogView 
              contract={selectedContract} 
              log={selectedLog} 
              onBack={popView} 
              onSubmit={handleUpdateLog} 
            />
          )}

          {currentView === View.EQUIPMENT_LIST && selectedContract && (
            <EquipmentListView 
              contract={selectedContract} 
              onBack={popView} 
            />
          )}

          {currentView === View.HOUR_LOG_HISTORY && selectedContract && (
            <HourLogHistoryView 
              contract={selectedContract} 
              highlightLogId={highlightedLogId} 
              onBack={popView} 
            />
          )}
        </div>

        {showBottomNav && (
          <nav className="h-[76px] shrink-0 bg-white/90 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 flex items-center justify-around px-8 z-50 safe-bottom">
            <button onClick={() => switchRootView(View.LIST)} className={`flex flex-col items-center gap-1 transition-all ${currentView === View.LIST ? 'text-sage-green scale-105' : 'text-gray-400'}`}>
              <span className={`material-symbols-outlined text-[26px] ${currentView === View.LIST ? 'fill-icon' : ''}`}>description</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Customer</span>
            </button>
            <button onClick={() => { if (isLoggedIn) switchRootView(View.PROFILE); else pushView(View.LOGIN); }} className={`flex flex-col items-center gap-1 transition-all ${currentView === View.PROFILE ? 'text-sage-green scale-105' : 'text-gray-400'}`}>
              <span className={`material-symbols-outlined text-[26px] ${currentView === View.PROFILE ? 'fill-icon' : ''}`}>person</span>
              <span className="text-[9px] font-black uppercase tracking-widest">My Timesheet</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default App;
