
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const Earnings: React.FC = () => {
  const weekData = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return labels.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        day: d.getDate().toString(),
        label,
        value: 0
      };
    });
  }, []);

  const weekRange = useMemo(() => {
    const monday = new Date();
    const day = monday.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    monday.setDate(monday.getDate() + diffToMonday);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDate = (date: Date) => {
      const dayNum = date.getDate();
      const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
      return `${dayNum} de ${months[date.getMonth()]}`;
    };

    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  }, []);

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto pb-20">
      {/* Header */}
      <div className="px-4 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <button className="p-2">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <div className="flex items-center gap-1">
          <span className="text-base font-medium">{weekRange}</span>
          <i className="fa-solid fa-chevron-down text-[10px] mt-1"></i>
        </div>
        <button className="p-2">
          <i className="fa-solid fa-circle-question text-xl"></i>
        </button>
      </div>

      {/* Total Amount */}
      <div className="flex flex-col items-center mt-2">
        <div className="flex items-center justify-center gap-12 w-full px-4">
          <i className="fa-solid fa-chevron-left text-sm text-gray-800"></i>
          <h1 className="text-[40px] font-medium tracking-tight">R$ 0,00</h1>
          <i className="fa-solid fa-chevron-right text-sm text-gray-800"></i>
        </div>
      </div>

      {/* Chart Section */}
      <div className="px-4 mt-4 relative">
        <div className="absolute left-4 top-0 text-[11px] text-gray-500 z-10">
          R$ 0,00
        </div>
        <div className="h-56 w-full border-b border-gray-200">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData} margin={{ top: 20, right: 0, left: 0, bottom: 45 }}>
              <ReferenceLine y={1500} stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                interval={0}
                height={50}
                tick={(props) => {
                  const { x, y, payload } = props;
                  const item = weekData[payload.index];
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text x={0} y={15} textAnchor="middle" fill="#111827" fontSize={13} fontWeight="500">{item.day}</text>
                      <text x={0} y={34} textAnchor="middle" fill="#6b7280" fontSize={13}>{item.label}</text>
                    </g>
                  );
                }}
              />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {weekData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#d1d5db" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="px-6 mt-12">
        <h2 className="text-[28px] font-bold mb-6">Estatísticas</h2>
        
        <div className="grid grid-cols-2 gap-y-8">
          <div>
            <p className="text-gray-500 text-base mb-1">Online</p>
            <p className="text-[22px] font-bold">0 h 0 m</p>
          </div>
          <div>
            <p className="text-gray-500 text-base mb-1">Viagens</p>
            <p className="text-[22px] font-bold">0</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 text-base mb-1">Pontos</p>
            <p className="text-[22px] font-bold">0</p>
          </div>
        </div>

        <button className="mt-8 text-gray-600 text-sm border-b border-gray-300 pb-0.5">
          Como calculamos as estatísticas
        </button>
      </div>

      <div className="h-[1px] bg-gray-100 w-full mt-10"></div>

      {/* Detalhamento Section */}
      <div className="px-6 mt-10">
        <h2 className="text-[28px] font-bold mb-6">Detalhamento</h2>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-800">Valor líquido</span>
            <span className="text-lg font-medium">R$ 0,00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-800">Promoções</span>
            <span className="text-lg font-medium">R$ 0,00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-800">Outros ganhos</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">R$ 0,00</span>
              <i className="fa-solid fa-chevron-down text-xs text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
