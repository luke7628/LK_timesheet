
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Contract, HourLog, SyncStatus } from '../types';
import { apiService } from '../services/apiService';

interface ProfileViewProps {
  userName: string;
  contracts: Contract[];
  onLogout: () => void;
  onContractSelect: (id: string) => void;
  onAddLog: (contractId?: string, date?: string) => void;
  onEditLog: (contractId: string, logId: string) => void;
  viewMode: 'week' | 'month' | 'year';
  setViewMode: (mode: 'week' | 'month' | 'year') => void;
  anchorDate: Date;
  setAnchorDate: (date: Date) => void;
  syncStatus: SyncStatus | null;
  onSyncRequest: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  userName, 
  contracts, 
  onLogout, 
  onContractSelect, 
  onAddLog, 
  onEditLog,
  viewMode,
  setViewMode,
  anchorDate,
  setAnchorDate,
  syncStatus,
  onSyncRequest
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSyncInfo, setShowSyncInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simplifiedUserName = useMemo(() => {
    return userName.split(' ')[0] || 'Guest';
  }, [userName]);

  const initials = useMemo(() => {
    if (!userName) return 'GT';
    const parts = userName.split(/[ ._]/);
    if (parts.length > 1) return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
    return userName.substring(0, 2).toUpperCase();
  }, [userName]);

  const handleResetData = async () => {
    if (window.confirm("WARNING: This will erase all local logs and reset to defaults. Continue?")) {
      await apiService.resetData();
      window.location.reload();
    }
  };

  const handleExportToExcel = () => {
    apiService.exportToExcel(contracts);
    setShowUserMenu(false);
  };

  const handleImportFromExcel = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await apiService.importFromExcel(file);
      alert('Excel 文件导入成功！页面即将刷新以加载新数据。');
      window.location.reload();
    } catch (error) {
      alert(`导入失败: ${error}`);
    }
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowUserMenu(false);
  };

  const handleDownloadTemplate = () => {
    apiService.exportExcelTemplate();
    setShowUserMenu(false);
  };

  const parseLogDate = (dateStr: string) => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date(0);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = 2000 + parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const getWeekNumber = (d: Date) => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const periodWindow = useMemo(() => {
    const start = new Date(anchorDate);
    const end = new Date(anchorDate);
    if (viewMode === 'week') {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff); start.setHours(0, 0, 0, 0);
      end.setTime(start.getTime() + 6 * 24 * 60 * 60 * 1000 + 23 * 59 * 59 * 1000);
    } else if (viewMode === 'month') {
      start.setDate(1); start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1); end.setDate(0); end.setHours(23, 59, 59, 999);
    } else {
      start.setMonth(0, 1); start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31); end.setHours(23, 59, 59, 999);
    }
    return { start, end };
  }, [anchorDate, viewMode]);

  const allLogs = useMemo(() => {
    const logs: any[] = [];
    contracts.forEach(c => {
      c.hourLogs.forEach(l => {
        logs.push({ ...l, client: c.client, site: c.site, contractId: c.id, parsedDate: parseLogDate(l.date) });
      });
    });
    return logs.sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());
  }, [contracts]);

  const dashboardStats = useMemo(() => {
    const filtered = allLogs.filter(l => l.parsedDate >= periodWindow.start && l.parsedDate <= periodWindow.end);
    const total = filtered.reduce((acc, l) => acc + parseFloat(l.duration || '0'), 0);
    
    let gridData: number[] = viewMode === 'week' ? [0,0,0,0,0,0,0] : [];
    if (viewMode === 'week') {
      filtered.forEach(l => {
        const dayIdx = (l.parsedDate.getDay() + 6) % 7;
        gridData[dayIdx] += parseFloat(l.duration) || 0;
      });
    }
    return { total, filtered, gridData };
  }, [allLogs, periodWindow, viewMode]);

  const lastSyncLabel = useMemo(() => {
    if (!syncStatus?.lastSynced) return 'NEVER';
    const date = new Date(syncStatus.lastSynced);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [syncStatus]);

  // Format period for display
  const periodLabel = useMemo(() => {
    const formatDate = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yy = String(date.getFullYear()).slice(-2);
      return `${dd}/${mm}/${yy}`;
    };

    if (viewMode === 'week') {
      const weekNum = getWeekNumber(anchorDate);
      return `WEEK ${weekNum} ${formatDate(periodWindow.start)}-${formatDate(periodWindow.end)}`;
    } else if (viewMode === 'month') {
      return anchorDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    } else {
      return anchorDate.getFullYear().toString();
    }
  }, [anchorDate, viewMode, periodWindow]);

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark safe-top h-full overflow-hidden" onClick={() => setShowUserMenu(false)}>
      
      {/* 顶部标题栏：带有连接状态指示器 */}
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl z-30 border-b border-gray-100 dark:border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-11 rounded-2xl bg-sage-green text-white font-black flex items-center justify-center shadow-lg shadow-sage-green/20">
                {initials}
              </div>
              {/* 同步状态小点 */}
              <div className={`absolute -bottom-1 -right-1 size-3.5 border-2 border-white dark:border-neutral-900 rounded-full ${syncStatus?.status === 'online' ? 'bg-primary' : 'bg-gray-400'}`}></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[14px] font-black text-text-dark dark:text-white uppercase tracking-tight">{simplifiedUserName}</h2>
              <div className="flex items-center gap-1.5" onClick={() => setShowSyncInfo(!showSyncInfo)}>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  SYNCED {lastSyncLabel}
                </span>
                <span className="material-symbols-outlined text-[10px] text-gray-400">info</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onSyncRequest}
              className="size-11 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center active:rotate-180 transition-all duration-500"
            >
              <span className="material-symbols-outlined text-[20px] text-sage-green">sync</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
              className="size-11 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-gray-400">more_vert</span>
            </button>
          </div>
        </div>

        {/* 数据同步信息层 */}
        {showSyncInfo && (
          <div className="mt-4 p-4 bg-sage-green/5 rounded-2xl border border-sage-green/10 animate-hyper-reveal">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-sage-green uppercase tracking-widest">Connectivity Hub</span>
              <span className="px-1.5 py-0.5 bg-sage-green text-white text-[7px] font-black rounded uppercase">Local Storage</span>
            </div>
            <p className="text-[11px] font-semibold text-gray-500 leading-relaxed">
              Your data is currently stored locally. Connect to <span className="text-sage-green">Airtable</span> or <span className="text-sage-green">Excel Online</span> for cloud sync.
            </p>
          </div>
        )}

        {showUserMenu && (
          <div className="absolute top-20 right-4 w-52 bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 z-50 overflow-hidden animate-fadeIn">
            <input 
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button onClick={handleImportFromExcel} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined text-blue-500 text-[20px]">upload_file</span>
              <span className="text-[10px] font-black uppercase tracking-widest">导入 Excel</span>
            </button>
            <button onClick={handleExportToExcel} className="w-full flex items-center gap-3 px-5 py-4 text-left border-t border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined text-green-500 text-[20px]">download</span>
              <span className="text-[10px] font-black uppercase tracking-widest">导出 Excel</span>
            </button>
            <button onClick={handleDownloadTemplate} className="w-full flex items-center gap-3 px-5 py-4 text-left border-t border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined text-purple-500 text-[20px]">description</span>
              <span className="text-[10px] font-black uppercase tracking-widest">下载模板</span>
            </button>
            <button className="w-full flex items-center gap-3 px-5 py-4 text-left border-t border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined text-sage-green text-[20px]">database</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Connect Database</span>
            </button>
            <button onClick={handleResetData} className="w-full flex items-center gap-3 px-5 py-4 text-left border-t border-gray-50 dark:border-white/5 text-amber-600 hover:bg-amber-50 transition-all">
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Factory Reset</span>
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-4 text-left border-t border-gray-50 dark:border-white/5 text-red-500 hover:bg-red-50 transition-all">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/40 dark:bg-neutral-900/40 border-b border-gray-100 dark:border-white/5 px-5 py-3 shrink-0">
        <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-2xl w-full mb-3">
          {(['week', 'month', 'year'] as const).map(mode => (
            <button 
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-white dark:bg-neutral-700 text-sage-green shadow-sm' : 'text-gray-400'}`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-2">
           <button onClick={() => setAnchorDate(new Date(anchorDate.setDate(anchorDate.getDate() - 7)))} className="size-9 rounded-full bg-sage-green/5 text-sage-green flex items-center justify-center"><span className="material-symbols-outlined">chevron_left</span></button>
           <span className="text-[10px] font-black text-text-dark dark:text-white uppercase tracking-widest">{periodLabel}</span>
           <button onClick={() => setAnchorDate(new Date(anchorDate.setDate(anchorDate.getDate() + 7)))} className="size-9 rounded-full bg-sage-green/5 text-sage-green flex items-center justify-center"><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32">
        <div className="flex flex-col gap-6 pt-4">
           {/* 核心仪表盘 */}
           <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-7 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
              <div className="absolute -top-10 -right-10 size-40 bg-sage-green/5 rounded-full blur-3xl"></div>
              <div className="flex flex-col gap-1 relative z-10">
                <p className="text-[10px] font-black text-sage-green uppercase tracking-[0.2em]">Service Hours ({viewMode})</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-text-dark dark:text-white">{dashboardStats.total.toFixed(1)}</span>
                  <span className="text-sm font-black text-sage-green uppercase">Hours</span>
                </div>
              </div>
              {viewMode === 'week' && (
                <div className="mt-8 grid grid-cols-7 gap-1.5 relative z-10">
                  {dashboardStats.gridData.map((h, i) => (
                    <div key={i} className={`flex flex-col items-center p-2 rounded-2xl border ${h > 0 ? 'bg-sage-green/5 border-sage-green/20' : 'bg-gray-50/50 dark:bg-white/5 border-transparent'}`}>
                      <span className={`text-[8px] font-black uppercase mb-1 ${h > 0 ? 'text-sage-green' : 'text-gray-300'}`}>{['M','T','W','T','F','S','S'][i]}</span>
                      <span className={`text-[12px] font-black ${h > 0 ? 'text-sage-green' : 'text-gray-200'}`}>{h > 0 ? h.toFixed(1) : '0'}</span>
                    </div>
                  ))}
                </div>
              )}
           </div>

           {/* 活动日志 */}
           <div className="flex flex-col gap-5">
             <div className="flex items-center justify-between ml-1">
               <h3 className="text-[11px] font-black text-sage-green uppercase tracking-[0.2em]">Activity Log</h3>
               <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{dashboardStats.filtered.length} Entries</span>
             </div>
             
             {dashboardStats.filtered.length > 0 ? (
               dashboardStats.filtered.map((log, i) => (
                 <div key={log.id} 
                    onClick={() => onEditLog(log.contractId, log.id)}
                    className="bg-white dark:bg-neutral-900 p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                 >
                   <div className="flex flex-col pr-4 min-w-0 flex-1">
                     <div className="flex items-center gap-1.5 flex-wrap mb-1">
                       <span className="text-[10px] font-black text-text-dark dark:text-white uppercase tracking-tight">{log.client}</span>
                       <span className="text-[10px] text-gray-300 font-bold">•</span>
                       <span className="text-[10px] font-black text-sage-green uppercase tracking-tight">{log.site}</span>
                     </div>
                     <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{log.description}</p>
                     <span className="text-[9px] font-black text-gray-300 uppercase mt-2">{log.date}</span>
                   </div>
                   <div className="shrink-0 bg-sage-green/5 px-3 py-2 rounded-2xl border border-sage-green/10 flex flex-col items-center">
                     <p className="text-[16px] font-black text-sage-green leading-none">{parseFloat(log.duration).toFixed(1)}</p>
                     <span className="text-[8px] font-black text-sage-green/40 uppercase mt-0.5">hrs</span>
                   </div>
                 </div>
               ))
             ) : (
               <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center">
                 <span className="material-symbols-outlined text-4xl mb-2">history_toggle_off</span>
                 <p className="text-[10px] font-black uppercase tracking-widest">No entries found</p>
               </div>
             )}
           </div>
        </div>
      </main>

      {/* 底部浮动按钮 */}
      <div className="fixed bottom-24 right-6 z-50">
        <button 
          onClick={() => onAddLog()}
          className="size-16 rounded-full bg-sage-green text-white shadow-2xl flex items-center justify-center active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
