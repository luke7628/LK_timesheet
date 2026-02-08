
import React from 'react';
import { Contract } from '../types';

interface ContractDocumentsViewProps {
  contract: Contract;
  onBack: () => void;
  onViewPdf: (fileName: string) => void;
}

const ContractDocumentsView: React.FC<ContractDocumentsViewProps> = ({ contract, onBack, onViewPdf }) => {
  // Mock PDF document list with longer names to test wrapping
  const documents = [
    { name: `Service_Agreement_Main_Standard_Terms_and_Conditions_${contract.contractNumber}_Final_Signed.pdf`, size: '2.4 MB', type: 'Agreement' },
    { name: `Appendix_A_Technical_Specifications_and_Service_Scope_v2.1_Syteline_System_Update.pdf`, size: '840 KB', type: 'Scope' },
    { name: `Standard_Enterprise_Terms_and_Conditions_2024_Global_Compliance_Guide.pdf`, size: '1.2 MB', type: 'Terms' },
    { name: `Site_Audit_Infrastructure_Report_Building_Complex_${contract.site.replace(' ', '_')}_Verification.pdf`, size: '5.1 MB', type: 'Report' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden safe-top">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm text-text-dark dark:text-white transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-text-dark dark:text-white text-[13px] font-black uppercase tracking-widest">Documents</h2>
            <p className="text-sage-green text-[9px] font-black uppercase truncate max-w-[150px]">{contract.client}</p>
        </div>
        <div className="w-11"></div>
      </header>

      <main className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar scroll-container">
        <div className="flex flex-col gap-4">
          {documents.map((doc, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="size-11 rounded-2xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center shrink-0 mt-1">
                   <span className="material-symbols-outlined text-red-500 text-[20px]">picture_as_pdf</span>
                </div>
                <div className="flex flex-col min-w-0">
                  {/* Name allowed to wrap here */}
                  <h3 className="text-text-dark dark:text-white text-[13px] font-bold break-words leading-tight">{doc.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{doc.size}</span>
                    <span className="size-1 rounded-full bg-gray-200"></span>
                    <span className="text-[9px] font-black text-sage-green uppercase tracking-widest">{doc.type}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onViewPdf(doc.name)}
                className="px-4 h-10 rounded-xl bg-sage-green text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sage-green/20 active:scale-90 transition-all shrink-0 self-center"
              >
                VIEW
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center opacity-20 text-center px-10">
           <span className="material-symbols-outlined text-5xl mb-4">verified_user</span>
           <p className="text-[10px] font-black uppercase tracking-widest">Secure Cloud Storage Access Only</p>
        </div>
      </main>
    </div>
  );
};

export default ContractDocumentsView;
