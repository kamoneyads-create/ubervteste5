
import React from 'react';
import { motion } from 'framer-motion';

interface AppSettingsProps {
  onBack: () => void;
}

const AppSettings: React.FC<AppSettingsProps> = ({ onBack }) => {
  const settingsGroups = [
    {
      items: [
        { id: 'sounds', title: 'Sons e voz', icon: 'fa-volume-high' },
        { id: 'navigation', title: 'Navegação', icon: 'fa-location-arrow' },
        { id: 'accessibility', title: 'Acessibilidade', icon: 'fa-universal-access' },
        { id: 'night_mode', title: 'Modo noturno', icon: 'fa-moon', value: 'Automático' },
      ]
    },
    {
      items: [
        { id: 'speed_limit', title: 'Limite de velocidade', icon: 'fa-gauge-high' },
        { id: 'follow_trip', title: 'Siga minha viagem', icon: 'fa-share-nodes' },
        { id: 'emergency', title: 'Botão de emergência', icon: 'fa-shield-heart' },
      ]
    },
    {
      items: [
        { id: 'calls', title: 'Chamadas e mensagens', icon: 'fa-comment' },
        { id: 'data_sharing', title: 'Compartilhamento de dados', icon: 'fa-chart-simple' },
        { id: 'video', title: 'Vídeo', icon: 'fa-video' },
        { id: 'language', title: 'Linguagem', icon: 'fa-language', value: 'Português (Brasil)' },
        { id: 'units', title: 'Unidades de distância', icon: 'fa-ruler', value: 'Quilômetros' },
      ]
    }
  ];

  return (
    <div className="h-full bg-white flex flex-col select-none overflow-hidden">
      {/* Header */}
      <div className="pt-6 px-6 pb-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-4 active:opacity-40 transition-opacity">
          <i className="fa-solid fa-arrow-left text-[22px] text-black"></i>
        </button>
        <h1 className="text-[20px] font-bold text-black ml-2">
          Configurações do app
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {settingsGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="bg-white">
            {group.items.map((item, itemIdx) => (
              <div 
                key={item.id}
                className="flex items-center px-5 py-3.5 active:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-8 flex items-center justify-center mr-3">
                  <i className={`fa-solid ${item.icon} text-[16px] text-black`}></i>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-[16px] font-medium text-black">
                    {item.title}
                  </span>
                  {item.value && (
                    <span className="text-[14px] text-gray-500 mr-2">
                      {item.value}
                    </span>
                  )}
                </div>
                <div className="ml-2">
                  <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {/* Bottom spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default AppSettings;
