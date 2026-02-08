
import React from 'react';

const SplashView: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden bg-background-light dark:bg-background-dark">
      
      {/* 动态流体背景层 - 颜色调整为纯粹的鼠尾草绿渐变，更自然 */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-10 pointer-events-none animate-bg-spin">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] rounded-full bg-gradient-to-br from-sage-light via-sage-green/10 to-sage-green/30 blur-[120px]"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 z-10 animate-hyper-reveal">
        
        {/* 中心图标容器：高级毛玻璃反射效果 */}
        <div className="relative mb-16">
          {/* 容器外框：极细边框增加精致感 */}
          <div className="relative size-36 backdrop-blur-[40px] bg-white/30 dark:bg-black/40 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(114,136,99,0.3)] flex items-center justify-center border border-white/50 dark:border-white/10 overflow-hidden">
            
            {/* 绿色玻璃反射扫光 (Reflection Sweep) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 bottom-0 w-[60%] bg-gradient-to-r from-transparent via-sage-green/20 to-transparent animate-shimmer"></div>
            </div>

            {/* 图标背景的微弱光晕 */}
            <div className="absolute size-24 bg-sage-green/10 rounded-full blur-2xl"></div>
            
            {/* 中心图标 - 纯净的鼠尾草绿 */}
            <span className="material-symbols-outlined text-6xl text-sage-green dark:text-sage-light relative z-10 drop-shadow-sm select-none">
              database
            </span>

            {/* 玻璃内侧高亮边缘 */}
            <div className="absolute inset-0 border border-white/20 rounded-[2.5rem] pointer-events-none"></div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="overflow-hidden">
            <h1 className="text-text-dark dark:text-white tracking-[-0.05em] text-5xl font-black leading-tight">
              CONTRACT<span className="text-sage-green">.AI</span>
            </h1>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-sage-green/50">Secure Sync Protocol</p>
          </div>
        </div>
      </div>

      {/* 极速进度条系统 */}
      <div className="w-full px-12 pb-24 z-10">
        <div className="w-full h-[3px] bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-sage-green animate-progress rounded-full">
            {/* 进度头部的反射光点 */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/60 to-transparent"></div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-sage-green animate-pulse"></span>
            <span className="text-[9px] font-black text-sage-green uppercase tracking-widest">System Ready</span>
          </div>
          <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">v1.0.8</span>
        </div>
      </div>

      {/* 底部装饰：极其微弱的全局光感 */}
      <div className="absolute bottom-[-20%] left-[-10%] size-96 bg-sage-green/5 rounded-full blur-[150px]"></div>
    </div>
  );
};

export default SplashView;
