
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface OpportunitiesProps {
  onBack: () => void;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('Promoções');
  
  const calendar = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' })
        .replace('.', '')
        .substring(0, 3);
      days.push({
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        date: d.getDate(),
        id: d.getTime()
      });
    }
    return days;
  }, []);

  const [selectedDayId, setSelectedDayId] = useState<number>(calendar[0]?.id || Date.now());

  const selectedDayObj = useMemo(() => {
    return calendar.find(d => d.id === selectedDayId) || calendar[0];
  }, [calendar, selectedDayId]);

  const missionDeadline = useMemo(() => {
    if (!selectedDayObj) return '...';
    const date = new Date(selectedDayObj.id);
    const day = date.getDay(); // 0 = Dom, 1 = Seg, ..., 4 = Qui, 5 = Sex, 6 = Sáb
    
    // Segunda (1), Terça (2), Quarta (3), Quinta (4) -> Quinta
    if (day >= 1 && day <= 4) {
      return 'Quinta...';
    }
    // Sexta (5), Sábado (6), Domingo (0) -> Domingo
    return 'Domingo...';
  }, [selectedDayObj]);

  const filters = [
    { id: 'Salvo', icon: 'fa-bookmark' },
    { id: 'Promoções', icon: 'fa-certificate' },
    { id: 'Reservas', icon: 'fa-calendar-check' }
  ];

  return (
    <div className="absolute inset-0 z-[5000] bg-white overflow-y-auto select-none">
      {/* Header */}
      <div className="pt-10 px-5 pb-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center -ml-1 active:scale-90 transition-transform">
          <i className="fa-solid fa-arrow-left text-xl text-black"></i>
        </button>
        <h1 className="text-[30px] font-black text-black tracking-tight mt-3">Oportunidades</h1>
      </div>

      {/* Filter Pills */}
      <div className="px-5 flex gap-2.5 mb-6 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full transition-all active:scale-95 whitespace-nowrap ${
              activeFilter === filter.id 
                ? 'bg-black text-white' 
                : 'bg-[#F3F3F7] text-black'
            }`}
          >
            <i className={`fa-solid ${filter.icon} text-xs`}></i>
            <span className="text-[14px] font-bold">{filter.id}</span>
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="px-5 flex justify-between mb-5 border-b border-gray-100 pb-3">
        {calendar.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedDayId(item.id)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              selectedDayId === item.id ? 'text-black' : 'text-gray-400'
            }`}>
              {item.day}
            </span>
            <span className={`text-[15px] font-black w-7 h-7 flex items-center justify-center rounded-full transition-all ${
              selectedDayId === item.id ? 'bg-black text-white' : 'text-black group-active:bg-gray-100'
            }`}>
              {item.date}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 pt-1 pb-20 scrollbar-hide">
        <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm flex justify-between items-start active:scale-[0.98] transition-transform cursor-pointer">
          <div className="flex-1 pr-3">
            <h3 className="text-[16px] font-bold text-black leading-tight mb-1.5">
              Escolha sua próxima sua missão até: {missionDeadline}
            </h3>
            <p className="text-[14px] font-medium text-gray-500">
              Ganhe R$ 220,00 a mais por 30 viagens
            </p>
          </div>
          <div className="shrink-0 pt-0.5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 21V3H13L14 5H20V15H13L12 13H6V21H4Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;
