import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, icon: 'fa-house', label: 'Página inicial' },
    { id: AppView.EARNINGS, icon: 'fa-money-bill-1', label: 'Ganhos' },
    { id: AppView.INBOX, icon: 'fa-envelope', label: 'Mensagens' },
    { id: AppView.PROFILE, icon: 'fa-bars', label: 'Menu' },
  ];

  return (
    <nav className="h-20 bg-white border-t border-gray-100 flex items-center justify-around px-2 bottom-nav-shadow z-[9000]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center gap-1 relative ${
            currentView === item.id ? 'text-black' : 'text-gray-500'
          }`}
        >
          <div className="relative">
            <i className={`fa-solid ${item.icon} text-xl`}></i>
          </div>
          <span className={`text-[11px] ${currentView === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;