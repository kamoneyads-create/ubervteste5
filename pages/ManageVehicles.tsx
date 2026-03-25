
import React from 'react';

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  image?: string;
  active: boolean;
}

interface ManageVehiclesProps {
  onBack: () => void;
  onAddVehicle: () => void;
  onSelectVehicle?: (id: string) => void;
  onDeleteVehicle?: (id: string) => void;
  vehicles: Vehicle[];
}

const ManageVehicles: React.FC<ManageVehiclesProps> = ({ onBack, onAddVehicle, onSelectVehicle, onDeleteVehicle, vehicles }) => {
  const canDelete = vehicles.length > 1;

  return (
    <div className="h-full bg-white flex flex-col select-none overflow-hidden">
      {/* Header Fixo */}
      <div className="pt-10 px-6 pb-4 flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-50">
        <button onClick={onBack} className="p-2 -ml-4 active:opacity-40 transition-opacity">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <h1 className="text-[18px] font-bold text-black">Seus veículos</h1>

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
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-20 scrollbar-hide">
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.id}
              onClick={() => onSelectVehicle?.(vehicle.id)}
              className={`w-full border-[3.5px] rounded-[18px] p-4 flex items-center gap-4 relative bg-white shadow-sm transition-all cursor-pointer min-h-[100px] overflow-hidden ${
                vehicle.active ? 'border-black' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              {/* Botão de Excluir - Canto Superior Direito */}
              {canDelete && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteVehicle?.(vehicle.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-gray-50 rounded-full active:scale-90 transition-transform text-gray-300 hover:text-red-500 z-10"
                >
                  <i className="fa-solid fa-trash-can text-[14px]"></i>
                </button>
              )}

              {/* Imagem do Veículo */}
              <div className="w-20 h-14 flex items-center justify-center shrink-0 bg-white rounded-lg overflow-hidden p-1">
                {vehicle.image ? (
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <i className="fa-solid fa-car text-gray-200 text-2xl"></i>
                )}
              </div>

              {/* Informações */}
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-8 py-1">
                <h2 className="text-[15px] font-medium text-black leading-tight tracking-tight break-words line-clamp-2 overflow-hidden">
                  {vehicle.name}
                </h2>
                <p className="text-[13px] font-medium text-[#545454] mt-1 uppercase tracking-wide truncate">
                  {vehicle.plate}
                </p>
                <p className="text-[12px] font-medium text-[#A6A6A6] mt-0.5">
                  Viagens + Entregas
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé Fixo */}
      <div className="p-6 pb-2 bg-white border-t border-gray-50 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button 
          onClick={onBack}
          className="w-full bg-black text-white font-bold py-[18px] rounded-[14px] text-[18px] active:scale-[0.98] transition-all shadow-lg"
        >
          Confirmar seleção
        </button>
      </div>
    </div>
  );
};

export default ManageVehicles;
