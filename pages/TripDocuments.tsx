
import React, { useState } from 'react';

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  image?: string;
  active: boolean;
}

interface TripDocumentsProps {
  onBack: () => void;
  vehicles?: Vehicle[];
}

const TripDocuments: React.FC<TripDocumentsProps> = ({ 
  onBack, 
  vehicles = []
}) => {
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    vehicles.forEach(v => {
      initial[v.id] = true;
    });
    return initial;
  });

  const toggleCollapse = (id: string) => {
    setCollapsedStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const documents = [
    { title: "Verificação de segurança", status: "Concluída" },
    { title: "CNH - Carteira de motorista", status: "Concluída" },
    { title: "Foto do perfil", status: "Concluída" },
    { title: "Termos e condições", status: "Concluída" }
  ];

  return (
    <div className="h-full bg-white flex flex-col select-none overflow-y-auto overflow-x-hidden">
      {/* Header - Native iOS/Android App Style */}
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
        {/* Main Title */}
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-none mb-6">
          Viagens
        </h1>

        {/* Document List */}
        <div className="flex flex-col">
          {documents.map((doc, index) => (
            <React.Fragment key={index}>
              <div className="py-4 active:bg-gray-50 transition-colors cursor-pointer flex flex-col gap-0.5">
                <span className="text-[17px] font-bold text-black tracking-tight leading-tight">
                  {doc.title}
                </span>
                <span className="text-[14px] font-bold text-[#0E8345] tracking-tight">
                  {doc.status}
                </span>
              </div>
              {/* Divider */}
              <div className="w-full h-[1px] bg-gray-50"></div>
            </React.Fragment>
          ))}

          {/* Vehicles List */}
          {vehicles.map((vehicle) => (
            <React.Fragment key={vehicle.id}>
              {/* Vehicle Section */}
              <div className="flex items-center gap-4 py-8">
                <div className="w-12 h-10 flex items-center justify-center bg-white">
                  <img 
                    src={vehicle.image || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=200&auto=format&fit=crop"} 
                    alt="Vehicle" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-[17px] font-bold text-black leading-tight">{vehicle.name}</h2>
                  <p className="text-[15px] font-medium text-black">{vehicle.plate}</p>
                </div>
                <button 
                  onClick={() => toggleCollapse(vehicle.id)}
                  className="w-10 h-10 flex items-center justify-center active:bg-gray-100 rounded-full transition-colors"
                >
                  <i className={`fa-solid ${collapsedStates[vehicle.id] ? 'fa-plus' : 'fa-minus'} text-black text-[18px]`}></i>
                </button>
              </div>

              {!collapsedStates[vehicle.id] && (
                <>
                  {/* CRLV - Documento do veículo */}
                  <div className="py-5 flex items-center justify-between border-t border-gray-100 cursor-pointer active:bg-gray-50 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[17px] font-bold text-black tracking-tight leading-tight">CRLV - Documento do veículo</span>
                      <span className="text-[14px] font-bold text-[#0E8345] tracking-tight">Concluída</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-300 text-sm"></i>
                  </div>
                  <div className="w-full h-[1px] bg-gray-100"></div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Bottom spacer for safe area */}
      <div className="h-10 flex-shrink-0"></div>
    </div>
  );
};

export default TripDocuments;
