
import React, { useState, useRef, useEffect } from 'react';
import { Contract, HourLog } from '../types';

interface AddLogViewProps {
  contract: Contract;
  initialDate?: string;
  onBack: () => void;
  onSubmit: (log: Partial<HourLog>) => void;
}

const AddLogView: React.FC<AddLogViewProps> = ({ contract, initialDate, onBack, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('1.0');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(1);
  const [selectedMinute, setSelectedMinute] = useState(0);

  // Helper to get today's date in DD/MM/YY
  const getTodayFormatted = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  };

  const [displayDate, setDisplayDate] = useState(initialDate || getTodayFormatted());

  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 50; 
  const SPACER_HEIGHT = 100;

  const handleScroll = (container: HTMLDivElement, type: 'hour' | 'minute') => {
    const scrollTop = container.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    
    if (type === 'hour') {
      if (index >= 0 && index < 25) setSelectedHour(index);
    } else {
      if (index >= 0 && index < 60) setSelectedMinute(index);
    }
  };

  useEffect(() => {
    if (showTimePicker) {
      const timer = setTimeout(() => {
        if (hourScrollRef.current) hourScrollRef.current.scrollTop = selectedHour * ITEM_HEIGHT;
        if (minuteScrollRef.current) minuteScrollRef.current.scrollTop = selectedMinute * ITEM_HEIGHT;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showTimePicker]);

  const handleSubmit = () => {
    if (!description.trim()) return;
    onSubmit({ description, duration, date: displayDate });
  };

  const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark h-full relative overflow-hidden">
      <header className="sticky top-0 z-10 flex items-center bg-white dark:bg-background-dark p-4 border-b border-gray-100 dark:border-white/5 justify-between safe-top">
        <button onClick={onBack} className="text-sage-green flex size-11 items-center justify-center active:scale-90 transition-all">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h2 className="text-text-dark dark:text-white text-[14px] font-black uppercase tracking-widest">New Log</h2>
        <div className="w-11"></div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar px-4 pt-4">
        <div className="bg-sage-green/10 rounded-[2rem] p-5 mb-6 border border-sage-green/5">
          <span className="text-sage-green text-[9px] font-black uppercase tracking-widest block mb-1">Contract Context</span>
          <h3 className="text-text-dark dark:text-white text-lg font-black leading-tight">{contract.client}</h3>
          <p className="text-sage-green/60 text-[10px] font-black uppercase tracking-widest mt-1">Site: {contract.site}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <button onClick={() => setShowDatePicker(true)} className="w-full flex items-center gap-4 px-5 py-5 justify-between border-b border-gray-50 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sage-green text-[20px]">calendar_today</span>
                <span className="text-text-dark dark:text-white text-[14px] font-bold">Log Date</span>
              </div>
              <span className="text-sage-green font-black text-sm bg-sage-green/5 px-3 py-1.5 rounded-xl">{displayDate}</span>
            </button>

            <button onClick={() => setShowTimePicker(true)} className="w-full flex items-center gap-4 px-5 py-5 justify-between active:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sage-green text-[20px]">timer</span>
                <span className="text-text-dark dark:text-white text-[14px] font-bold">Recorded Duration</span>
              </div>
              <span className="text-sage-green font-black text-sm bg-sage-green/5 px-3 py-1.5 rounded-xl">{duration} <span className="text-[9px] opacity-40">H</span></span>
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
            <span className="text-[9px] font-black text-sage-green uppercase tracking-widest mb-3 block">Service Description</span>
            <textarea 
              className="w-full h-40 text-[15px] bg-transparent border-none focus:ring-0 resize-none placeholder-gray-300 font-semibold p-0" 
              placeholder="What did you work on today?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background-light pt-12 z-20 safe-bottom">
        <button onClick={handleSubmit} className="w-full bg-sage-green text-white h-16 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-sage-green/20 active:scale-95 transition-all">
          Commit Service Log
        </button>
      </div>

      {showTimePicker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm" 
             onClick={() => setShowTimePicker(false)}
             style={{ overscrollBehavior: 'none' }}>
          <div className="w-full max-w-lg bg-white rounded-t-[3rem] px-6 pt-6 pb-12 shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-sage-green">Adjust Duration</h4>
              <button onClick={() => setShowTimePicker(false)} className="size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><span className="material-symbols-outlined text-[18px]">close</span></button>
            </div>

            <div className="relative flex justify-center gap-10 h-[250px] overflow-hidden mb-8 select-none">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[50px] bg-sage-green/5 border-y border-sage-green/10 rounded-2xl z-0 pointer-events-none"></div>

              <div className="flex flex-col items-center w-28 relative z-10">
                <span className="text-[9px] font-black text-gray-300 uppercase mb-2">Hrs</span>
                <div 
                  ref={hourScrollRef} 
                  onScroll={(e) => handleScroll(e.currentTarget, 'hour')} 
                  className="w-full h-full overflow-y-auto no-scrollbar snap-y snap-mandatory scroll-smooth"
                  style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' }}
                >
                  <div style={{ height: SPACER_HEIGHT }}></div>
                  {Array.from({ length: 25 }).map((_, h) => (
                    <div key={h} style={{ height: ITEM_HEIGHT }} className={`flex items-center justify-center snap-center transition-all ${selectedHour === h ? 'text-sage-green text-4xl font-black' : 'text-gray-200 text-lg font-bold opacity-30'}`}>
                      {h}
                    </div>
                  ))}
                  <div style={{ height: SPACER_HEIGHT }}></div>
                </div>
              </div>

              <div className="flex items-center pt-8"><span className="text-3xl font-black text-gray-200">:</span></div>

              <div className="flex flex-col items-center w-28 relative z-10">
                <span className="text-[9px] font-black text-gray-300 uppercase mb-2">Min</span>
                <div 
                  ref={minuteScrollRef} 
                  onScroll={(e) => handleScroll(e.currentTarget, 'minute')} 
                  className="w-full h-full overflow-y-auto no-scrollbar snap-y snap-mandatory scroll-smooth"
                  style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' }}
                >
                  <div style={{ height: SPACER_HEIGHT }}></div>
                  {Array.from({ length: 60 }).map((_, m) => (
                    <div key={m} style={{ height: ITEM_HEIGHT }} className={`flex items-center justify-center snap-center transition-all ${selectedMinute === m ? 'text-sage-green text-4xl font-black' : 'text-gray-200 text-lg font-bold opacity-30'}`}>
                      {m.toString().padStart(2, '0')}
                    </div>
                  ))}
                  <div style={{ height: SPACER_HEIGHT }}></div>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Decimal Hours</span>
              <p className="text-2xl font-black text-sage-green">{(selectedHour + (selectedMinute / 60)).toFixed(2)}h</p>
            </div>

            <button onClick={() => { setDuration((selectedHour + (selectedMinute / 60)).toFixed(2)); setShowTimePicker(false); }} className="w-full h-16 bg-sage-green text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Confirm Selection</button>
          </div>
        </div>
      )}

      {showDatePicker && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/70 backdrop-blur-sm" 
             onClick={() => setShowDatePicker(false)}
             style={{ overscrollBehavior: 'none' }}>
          <div className="w-full max-w-lg bg-white rounded-t-[3rem] px-6 pt-6 pb-14 shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-sage-green">Select Date</h4>
              <button onClick={() => setShowDatePicker(false)} className="size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><span className="material-symbols-outlined text-[18px]">close</span></button>
            </div>

            <div className="flex items-center justify-between py-4 mb-2">
              <button onClick={() => setCalMonth(m => m === 0 ? 11 : m - 1)} className="size-10 rounded-2xl bg-sage-green/5 text-sage-green flex items-center justify-center active:scale-90"><span className="material-symbols-outlined">chevron_left</span></button>
              <div className="text-center">
                 <p className="text-[14px] font-black text-sage-green uppercase tracking-[0.2em]">{new Date(calYear, calMonth).toLocaleString('en-US', { month: 'long' })}</p>
                 <p className="text-[10px] font-bold text-gray-300">{calYear}</p>
              </div>
              <button onClick={() => setCalMonth(m => m === 11 ? 0 : m + 1)} className="size-10 rounded-2xl bg-sage-green/5 text-sage-green flex items-center justify-center active:scale-90"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2 px-1">
              {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[9px] font-black text-gray-300">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5 px-1">
              {Array.from({ length: firstDayOfMonth(calMonth, calYear) }).map((_, i) => <div key={i}></div>)}
              {Array.from({ length: daysInMonth(calMonth, calYear) }).map((_, i) => {
                const day = i + 1;
                const dd = String(day).padStart(2, '0');
                const mm = String(calMonth + 1).padStart(2, '0');
                const yy = String(calYear).slice(-2);
                const dateStr = `${dd}/${mm}/${yy}`;
                const isSelected = displayDate === dateStr;
                return (
                  <button key={day} onClick={() => { setDisplayDate(dateStr); setShowDatePicker(false); }} className={`h-11 rounded-2xl flex items-center justify-center text-[13px] font-bold transition-all ${isSelected ? 'bg-sage-green text-white shadow-lg' : 'text-gray-700 active:bg-sage-green/5'}`}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddLogView;
