
import React, { useState } from 'react';

interface LoginViewProps {
  onBack: () => void;
  onLogin: (name: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onBack, onLogin }) => {
  const [name, setName] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark safe-top safe-bottom p-8 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[20%] w-[70%] h-[40%] rounded-full bg-sage-light dark:bg-sage-green/20 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[40%] rounded-full bg-primary/20 dark:bg-sage-green/10 blur-3xl"></div>
      </div>

      <header className="mb-8 z-10">
        <button 
          onClick={onBack}
          className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-sm text-sage-green active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full z-10">
        <div className="text-center mb-10">
          <div className="inline-flex size-20 rounded-3xl bg-sage-green/10 items-center justify-center text-sage-green mb-6 shadow-inner">
            <span className="material-symbols-outlined text-4xl">person</span>
          </div>
          <h2 className="text-3xl font-black text-text-dark dark:text-white tracking-tight mb-2">Welcome</h2>
          <p className="text-gray-500 text-sm">Please enter your name to continue</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-sage-green uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-300 group-focus-within:text-sage-green transition-colors text-[20px]">person</span>
              <input 
                type="text" 
                placeholder="e.g. Alex/Sarah"
                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-neutral-800 border-2 border-gray-50 dark:border-white/5 rounded-2xl focus:border-sage-green/50 focus:ring-0 transition-all text-sm font-bold text-gray-800 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-16 bg-sage-green text-white rounded-2xl font-black uppercase tracking-[0.15em] text-sm shadow-lg shadow-sage-green/20 hover:bg-sage-green/90 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <span className="material-symbols-outlined text-[18px]">login</span>
          </button>
        </form>

        <p className="mt-12 text-center text-[10px] text-gray-400 uppercase font-black tracking-widest leading-relaxed px-4 opacity-50">
          Accessing Contract Management System
        </p>
      </div>
    </div>
  );
};

export default LoginView;
