
import React, { useState, useRef } from 'react';

interface PdfPreviewerViewProps {
  fileName: string;
  onBack: () => void;
}

const PdfPreviewerView: React.FC<PdfPreviewerViewProps> = ({ fileName, onBack }) => {
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Multi-page content mock
  const renderPageContent = (page: number) => {
    switch(page) {
      case 1:
        return (
          <div className="flex flex-col h-full gap-6 select-text cursor-text text-slate-900 font-sans">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-2">
              <div className="flex flex-col">
                <h1 className="text-[22px] font-black uppercase tracking-tighter leading-none">SERVICE LEVEL AGREEMENT</h1>
                <p className="text-[9px] font-bold opacity-60 mt-2">DOC ID: SYT-2024-CONTRACT-8849</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="size-10 bg-slate-900 text-white rounded-md flex items-center justify-center font-black text-[10px]">CORP</div>
                <span className="text-[8px] font-bold mt-1 opacity-40 uppercase">Page {page} of {totalPages}</span>
              </div>
            </div>
            <div className="flex flex-col gap-6 text-[11px] leading-relaxed">
              <section>
                <h4 className="font-black uppercase text-[10px] mb-2 tracking-wide text-slate-600">I. Preamble</h4>
                <p>This Strategic Service Agreement (the "Agreement") is formally entered into this day, by and between <strong>The Registered Client Entity</strong> (referred to as the "Customer") and <strong>Enterprise Maintenance Group</strong> (referred to as the "Service Provider").</p>
              </section>
              <section>
                <h4 className="font-black uppercase text-[10px] mb-2 tracking-wide text-slate-600">II. Scope of Engagement</h4>
                <p>The Service Provider shall perform the following core technical operations as part of the Tier 1 service package:</p>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1.5 italic">
                  <li>Bi-monthly preventative maintenance of critical cooling units.</li>
                  <li>End-to-end network signal optimization and latency monitoring.</li>
                  <li>Firmware patching and security auditing of all enrolled assets.</li>
                </ul>
              </section>
              <section>
                <h4 className="font-black uppercase text-[10px] mb-2 tracking-wide text-slate-600">III. Equipment & Asset Identification</h4>
                <table className="w-full border-collapse border border-slate-200 mt-2">
                  <thead className="bg-slate-50 text-[9px] uppercase font-black">
                    <tr>
                      <th className="border border-slate-200 p-2 text-left">Asset Model</th>
                      <th className="border border-slate-200 p-2 text-left">Serial Number</th>
                      <th className="border border-slate-200 p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-2 font-bold">AHU-200X Core Hub</td>
                      <td className="border border-slate-200 p-2 font-mono">99-88-77-X1</td>
                      <td className="border border-slate-200 p-2">ACTIVE</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-2 font-bold">CT-500 Sensor Grid</td>
                      <td className="border border-slate-200 p-2 font-mono">11-22-33-Y2</td>
                      <td className="border border-slate-200 p-2">COVERED</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col h-full gap-6 select-text cursor-text text-slate-900 font-sans">
             <h2 className="text-[16px] font-black border-b border-slate-200 pb-2">SECTION IV: TECHNICAL STANDARDS</h2>
             <p className="text-[11px] leading-relaxed">All services provided under this agreement must adhere to the IEEE 802.11 standards for wireless networking. Any deviation must be documented and signed by both parties.</p>
             <div className="bg-slate-50 p-4 border-l-4 border-sage-green rounded-r-lg">
                <p className="text-[10px] font-bold text-sage-green uppercase mb-2">Internal Note</p>
                <p className="text-[10px]">Regular calibration of signal strength analyzers is required every 90 days of operation.</p>
             </div>
             <p className="text-[11px] leading-relaxed">The service provider maintains the right to audit site infrastructure with a 24-hour notice period to ensure compliance with the service level agreements defined in the master contract.</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col h-full items-center justify-center gap-4 text-slate-400 select-text">
            <span className="material-symbols-outlined text-6xl">description</span>
            <p className="font-black uppercase tracking-widest text-[12px]">Appendix {page - 2}</p>
            <p className="text-[10px] max-w-[200px] text-center italic">Document content for subsequent pages continues with detailed performance graphs and compliance data.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-200 dark:bg-neutral-950 overflow-hidden h-full">
      {/* Header with Page Info */}
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 shadow-md z-30 border-b border-gray-200 dark:border-white/5 safe-top shrink-0">
        <button 
          onClick={onBack}
          className="flex items-center justify-center size-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        <div className="flex flex-col items-center flex-1 mx-4 min-w-0">
          <h2 className="text-text-dark dark:text-white text-[11px] font-bold truncate w-full text-center">{fileName}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-black text-sage-green uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
            <span className="size-1 rounded-full bg-gray-300"></span>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">A4 PDF Render</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
           <button onClick={handleResetZoom} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500 active:scale-90 transition-all">
             <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
           </button>
        </div>
      </header>

      {/* Main Preview Area */}
      <main ref={scrollRef} className="flex-1 overflow-auto relative p-4 no-scrollbar scroll-container bg-neutral-300 dark:bg-neutral-950 flex flex-col items-center">
        {/* A4 Document Container */}
        <div 
          className="bg-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] origin-top transition-transform duration-200 ease-out mb-32 relative overflow-hidden"
          style={{ 
            width: '95%', 
            maxWidth: '842px', // Approx width for A4 in pixels at 72dpi to 96dpi
            aspectRatio: '1 / 1.4142', // Perfect A4 Ratio
            transform: `scale(${zoom})`,
            padding: '40px 50px',
            color: '#1a1a1a',
            marginTop: '20px'
          }}
        >
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
          
          {/* Content Rendering based on page */}
          <div className="h-full">
            {renderPageContent(currentPage)}
          </div>

          {/* Page Footer Info */}
          <div className="absolute bottom-10 left-0 right-0 px-12 flex justify-between items-center text-[8px] font-bold text-slate-300 uppercase tracking-widest border-t border-slate-50 pt-4 pointer-events-none">
            <span>© 2024 Enterprise Maintenance Group</span>
            <span className="text-slate-200">INTERNAL USE ONLY</span>
            <span>{currentPage} / {totalPages}</span>
          </div>
        </div>
      </main>

      {/* Navigation Controls Overlay */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl rounded-full shadow-2xl border border-gray-100 dark:border-white/10 p-2 gap-2">
         <button 
           onClick={prevPage}
           disabled={currentPage === 1}
           className={`size-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${currentPage === 1 ? 'text-gray-200' : 'text-sage-green hover:bg-sage-green/5'}`}
         >
           <span className="material-symbols-outlined">navigate_before</span>
         </button>
         <div className="h-6 w-px bg-gray-100 dark:bg-white/10 mx-1"></div>
         <button 
           onClick={nextPage}
           disabled={currentPage === totalPages}
           className={`size-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${currentPage === totalPages ? 'text-gray-200' : 'text-sage-green hover:bg-sage-green/5'}`}
         >
           <span className="material-symbols-outlined">navigate_next</span>
         </button>
      </div>

      {/* Zoom Controls Overlay */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center bg-sage-green text-white rounded-full shadow-2xl border border-sage-green/20 p-1.5 gap-1 animate-fadeIn">
         <button 
           onClick={handleZoomOut}
           className="size-10 rounded-full flex items-center justify-center active:scale-90 transition-all hover:bg-white/10"
         >
           <span className="material-symbols-outlined text-[20px]">remove</span>
         </button>
         <div className="px-3 min-w-[60px] text-center">
            <span className="text-[10px] font-black uppercase tracking-tighter">{(zoom * 100).toFixed(0)}%</span>
         </div>
         <button 
           onClick={handleZoomIn}
           className="size-10 rounded-full flex items-center justify-center active:scale-90 transition-all hover:bg-white/10"
         >
           <span className="material-symbols-outlined text-[20px]">add</span>
         </button>
      </div>
    </div>
  );
};

export default PdfPreviewerView;
