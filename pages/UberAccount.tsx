
import React from 'react';
import { motion } from 'framer-motion';
import { X, User, ShieldCheck, Lock, CreditCard } from 'lucide-react';

interface UberAccountProps {
  onBack: () => void;
  userName: string;
  profileImage: string;
  profileImageScale?: number;
  profileImageX?: number;
  profileImageY?: number;
}

const UberAccount: React.FC<UberAccountProps> = ({ 
  onBack, 
  userName, 
  profileImage,
  profileImageScale = 1,
  profileImageX = 0,
  profileImageY = 0
}) => {
  const tabs = [
    { id: 'home', label: 'Página inicial', active: true },
    { id: 'personal', label: 'Dados pessoais', active: false },
    { id: 'security', label: 'Segurança', active: false },
    { id: 'privacy', label: 'Privacidade e dados', active: false },
  ];

  const gridItems = [
    { id: 'personal', label: 'Dados pessoais', icon: <User size={32} className="text-black" /> },
    { id: 'security', label: 'Segurança', icon: <ShieldCheck size={32} className="text-black" /> },
    { id: 'privacy', label: 'Privacidade e dados', icon: <Lock size={28} className="text-black" /> },
  ];

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button onClick={onBack} className="p-2 active:opacity-40 transition-opacity">
          <X size={24} className="text-black" />
        </button>
        <h1 className="text-[18px] font-bold text-black flex-1 text-center mr-8">
          Conta da Uber
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 px-2">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={`px-4 py-4 text-[14px] font-medium whitespace-nowrap relative transition-colors ${
              tab.active ? 'text-black' : 'text-gray-500'
            }`}
          >
            {tab.label}
            {tab.active && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black" />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Profile Section */}
        <div className="flex flex-col items-center pt-10 pb-6">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden mb-4 border-[3px] border-white shadow-sm">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover transition-transform duration-200"
              style={{
                transform: `scale(${profileImageScale}) translate(${profileImageX}%, ${profileImageY}%)`
              }}
            />
          </div>
          <h2 className="text-[28px] font-bold text-black leading-tight tracking-tight">{userName}</h2>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-3 gap-3 px-4 mb-10">
          {gridItems.map((item) => (
            <div 
              key={item.id}
              className="bg-[#F3F3F3] rounded-xl p-4 flex flex-col items-center justify-center text-center aspect-square active:bg-gray-200 transition-colors cursor-pointer"
            >
              <div className="mb-3">
                {item.icon}
              </div>
              <span className="text-[14px] font-bold text-black leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UberAccount;
