
import React from 'react';

interface AccountProps {
  onBack: () => void;
  vehicleName: string;
  licensePlate: string;
  vehicleImage?: string;
  onLogout: () => void;
  onDocuments?: () => void;
  onVehicles?: () => void;
  onPayoutInfo?: () => void;
  onOpportunities?: () => void;
  onUberAccount?: () => void;
  onAppSettings?: () => void;
}

const Account: React.FC<AccountProps> = ({ onBack, vehicleName, licensePlate, vehicleImage, onLogout, onDocuments, onVehicles, onPayoutInfo, onOpportunities, onUberAccount, onAppSettings }) => {
  const mainItems = [
    {
      id: 'vehicle',
      title: 'Veículos',
      subtitle: `${vehicleName} ${licensePlate}`,
      icon: vehicleImage ? (
        <div className="w-12 h-10 flex items-center justify-center -ml-1">
          <img src={vehicleImage} alt="Veículo" className="w-full h-full object-contain" />
        </div>
      ) : (
        <i className="fa-solid fa-car text-[20px] text-black"></i>
      ),
      action: onVehicles
    },
    {
      id: 'documents',
      title: 'Documentos',
      icon: <i className="fa-solid fa-file-lines text-[20px] text-black"></i>,
      action: onDocuments
    },
    {
      id: 'portal',
      title: 'Portal de oportunidades',
      icon: <i className="fa-solid fa-briefcase text-[20px] text-black"></i>,
      action: onOpportunities
    },
    {
      id: 'earnings_transfer',
      title: 'Repasse de ganhos',
      icon: <i className="fa-solid fa-credit-card text-[20px] text-black"></i>,
      action: onPayoutInfo
    },
    {
      id: 'tax_info',
      title: 'Informações fiscais',
      icon: <i className="fa-solid fa-calculator text-[20px] text-black"></i>,
      action: () => {}
    },
    {
      id: 'manage_uber',
      title: 'Gerenciar conta da Uber',
      icon: <i className="fa-solid fa-user text-[20px] text-black"></i>,
      action: onUberAccount
    },
    {
      id: 'edit_address',
      title: 'Edite o endereço',
      icon: <i className="fa-solid fa-circle-info text-[20px] text-black"></i>,
      action: () => {}
    },
    {
      id: 'insurance',
      title: 'Seguro',
      icon: <i className="fa-solid fa-umbrella text-[20px] text-black"></i>,
      action: () => {}
    }
  ];

  const configItems = [
    {
      id: 'privacy',
      title: 'Privacidade',
      icon: <i className="fa-solid fa-lock text-[20px] text-black"></i>
    },
    {
      id: 'app_settings',
      title: 'Configurações do app',
      icon: <i className="fa-solid fa-gear text-[20px] text-black"></i>,
      action: onAppSettings
    },
    {
      id: 'about',
      title: 'Sobre',
      icon: <i className="fa-solid fa-circle-info text-[20px] text-black"></i>
    }
  ];

  return (
    <div className="h-full bg-white flex flex-col select-none overflow-y-auto">
      {/* Header */}
      <div className="pt-6 px-6 pb-2">
        <button onClick={onBack} className="p-2 -ml-4 active:opacity-40 transition-opacity">
          <i className="fa-solid fa-arrow-left text-[22px] text-black"></i>
        </button>
        <h1 className="text-[28px] font-bold text-black tracking-tight mt-4 leading-none">
          Conta
        </h1>
      </div>

      {/* Main Section */}
      <div className="mt-2">
        {mainItems.map((item) => (
          <div 
            key={item.id} 
            onClick={item.action}
            className="flex items-center px-6 py-4 active:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
          >
            <div className="w-12 flex items-center justify-center mr-4">
              {item.icon}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[17px] font-bold text-black leading-tight">
                {item.title}
              </span>
              {item.subtitle && (
                <span className="text-[13px] font-medium text-gray-500 mt-0.5">
                  {item.subtitle}
                </span>
              )}
            </div>
            <div className="ml-4">
              <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Config Section */}
      <div className="border-t border-gray-50">
        {configItems.map((item) => (
          <div 
            key={item.id} 
            onClick={item.action}
            className="flex items-center px-6 py-4 active:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
          >
            <div className="w-12 flex items-center justify-center mr-4">
              {item.icon}
            </div>
            <div className="flex-1">
              <span className="text-[17px] font-bold text-black leading-tight">
                {item.title}
              </span>
            </div>
            <div className="ml-4">
              <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Smaller Grey Divider Spacer */}
      <div className="w-full h-[32px] bg-[#F3F3F7] border-y border-gray-100"></div>

      {/* Account Management Section */}
      <div className="bg-white">
        <div className="flex items-center px-6 py-5 active:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex-1">
            <span className="text-[17px] font-bold text-black leading-tight">
              Trocar conta
            </span>
          </div>
          <div className="ml-4">
            <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
          </div>
        </div>
      </div>
      
      {/* Bottom spacer for safe area */}
      <div className="h-24 bg-white"></div>
    </div>
  );
};

export default Account;
