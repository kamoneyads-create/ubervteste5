
import React from 'react';

interface DocumentsProps {
  onBack: () => void;
  onViewAll?: () => void;
}

const Documents: React.FC<DocumentsProps> = ({ onBack, onViewAll }) => {
  return (
    <div className="h-full bg-white flex flex-col select-none overflow-y-auto overflow-x-hidden">
      {/* Header Bar - Native iOS/Android App Style */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2 sticky top-0 bg-white z-50">
        <button onClick={onBack} className="p-2 -ml-2 active:opacity-40 transition-opacity">
          <i className="fa-solid fa-arrow-left text-[20px] text-black"></i>
        </button>
        <span className="text-[16px] font-bold text-black tracking-tight">Uber</span>
        <button className="bg-[#F3F3F7] px-4 py-1.5 rounded-full text-[13px] font-bold text-black active:opacity-60 transition-opacity">
          Ajuda
        </button>
      </div>

      <div className="px-6 pt-4 pb-20">
        {/* Title Section - Reduced scale from 44px to 28px */}
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-none mb-3 break-words">
          Documentos
        </h1>
        <p className="text-[16px] font-medium text-gray-500 leading-snug mb-8 max-w-full">
          Gerencie documentos corporativos e de veículos.
        </p>

        {/* Cards Container */}
        <div className="space-y-3">
          {/* Viagens Card */}
          <div className="bg-white border border-gray-100 rounded-[12px] p-5 shadow-sm border-opacity-60">
            <h2 className="text-[22px] font-bold text-black tracking-tight mb-3">
              Viagens
            </h2>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#0E8345] flex items-center justify-center">
                <i className="fa-solid fa-check text-[8px] text-[#0E8345]"></i>
              </div>
              <span className="text-[14px] font-bold text-[#0E8345]">Aprovado</span>
            </div>
            <button 
              onClick={onViewAll}
              className="w-full bg-[#F3F3F7] py-2.5 rounded-full text-[14px] font-bold text-black active:bg-gray-200 transition-colors"
            >
              Ver todos os documentos
            </button>
          </div>

          {/* Entregas Card */}
          <div className="bg-white border border-gray-100 rounded-[12px] p-5 shadow-sm border-opacity-60">
            <h2 className="text-[22px] font-bold text-black tracking-tight mb-3">
              Entregas
            </h2>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#0E8345] flex items-center justify-center">
                <i className="fa-solid fa-check text-[8px] text-[#0E8345]"></i>
              </div>
              <span className="text-[14px] font-bold text-[#0E8345]">Aprovado</span>
            </div>
            <button 
              onClick={onViewAll}
              className="w-full bg-[#F3F3F7] py-2.5 rounded-full text-[14px] font-bold text-black active:bg-gray-200 transition-colors"
            >
              Ver todos os documentos
            </button>
          </div>
        </div>

        {/* Mais Informações Section - Reduced scale */}
        <div className="mt-10">
          <h3 className="text-[20px] font-bold text-black tracking-tight mb-5">
            Mais informações
          </h3>
          
          <div className="flex items-center gap-4 active:opacity-50 transition-opacity cursor-pointer">
            <div className="w-6 flex justify-center flex-shrink-0">
              <i className="fa-solid fa-map text-[18px] text-black"></i>
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-black leading-tight pr-4">
                Descubra as regiões com oportunidades de ganhos
              </p>
            </div>
            <div className="ml-2 flex-shrink-0">
              <i className="fa-solid fa-chevron-right text-[11px] text-gray-300"></i>
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-gray-50 mt-5 ml-10"></div>
        </div>
      </div>
      
      {/* Bottom Safe Area Padding */}
      <div className="h-10 flex-shrink-0"></div>
    </div>
  );
};

export default Documents;
