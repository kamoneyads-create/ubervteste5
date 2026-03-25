
import React from 'react';

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  image?: string;
  active: boolean;
}

interface VehiclesProps {
  onBack: () => void;
  onAddVehicle: () => void;
  onManageVehicles: () => void;
  onSelectVehicle?: (id: string) => void;
  onDeleteVehicle?: (id: string) => void;
  vehicles: Vehicle[];
}

const Vehicles: React.FC<VehiclesProps> = ({ onBack, onAddVehicle, onManageVehicles, onSelectVehicle, onDeleteVehicle, vehicles }) => {
  const activeVehicle = vehicles.find(v => v.active) || vehicles[0];

  return (
    <div className="h-full bg-white flex flex-col select-none overflow-hidden">
      {/* Header */}
      <div className="pt-10 px-6 pb-4 flex items-center justify-between bg-white z-50">
        <button onClick={onBack} className="p-2 -ml-4 active:opacity-40 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <h1 className="text-[18px] font-bold text-black">Veículos</h1>

        <button onClick={onAddVehicle} className="p-2 -mr-2 active:opacity-40 transition-opacity">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12L5.5 8H13.5L15 12" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H17V18H15.5V20H13.5V18H5.5V20H3.5V18H2V12Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 4V10" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 7H22" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Conteúdo com Rolagem */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Active Vehicle Info */}
        <div className="px-6 pt-2 pb-6 flex flex-col items-center">
          <div className="w-full aspect-[16/9] flex items-center justify-center mb-4">
            {activeVehicle.image ? (
              <img 
                src={activeVehicle.image} 
                alt={activeVehicle.name} 
                className="w-full h-full object-contain"
              />
            ) : (
              <i className="fa-solid fa-car text-gray-200 text-[100px]"></i>
            )}
          </div>

          <div className="w-full flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-[26px] font-black text-black leading-tight tracking-tight">
                {activeVehicle.name}
              </h2>
              <p className="text-[14px] font-medium text-[#545454] mt-0.5 uppercase tracking-wide">
                {activeVehicle.plate}
              </p>
              <p className="text-[14px] font-medium text-[#545454] mt-0.5">
                Viagens + Entrega
              </p>
            </div>
            <button className="p-1.5 bg-gray-50 rounded-full active:scale-90 transition-transform">
              <i className="fa-solid fa-ellipsis-vertical text-black text-lg"></i>
            </button>
          </div>
        </div>

        {/* Manage Button */}
        <div className="px-4 mb-8">
          <button 
            onClick={onManageVehicles}
            className="w-full bg-[#F3F3F7] text-black font-bold py-3.5 rounded-[10px] text-[16px] active:scale-[0.98] transition-all"
          >
            Gerenciar veículos
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-1.5 bg-gray-50 mb-6"></div>

        {/* Opportunity Card */}
        <div className="px-4 pb-20">
          <div className="bg-[#065e66] rounded-[18px] p-6 flex flex-col gap-3 shadow-md">
            <h3 className="text-[20px] font-black text-white leading-tight tracking-tight">
              Descubra oportunidades de veículos
            </h3>
            <p className="text-[14px] font-medium text-white/90 leading-snug">
              Veja as opções de veículos de parceiro locador, aluguel ou compra de veículos se precisar de outro veículo.
            </p>
            <button className="flex items-center gap-2 text-white font-bold text-[14px] mt-1 active:opacity-70 transition-opacity">
              Saiba mais <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
