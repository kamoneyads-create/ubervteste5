
import React from 'react';

interface PublicProfileProps {
  userName: string;
  profileImage: string;
  profileImageScale?: number;
  profileImageX?: number;
  profileImageY?: number;
  city: string;
  vehicle: string;
  language: string;
  onBack: () => void;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ 
  userName, 
  profileImage, 
  profileImageScale = 1,
  profileImageX = 0,
  profileImageY = 0,
  onBack, 
  language 
}) => {
  const elogios = [
    { label: 'Ótimo atendimento', count: 0, icon: 'fa-thumbs-up', color: 'bg-[#FFC000]' },
    { label: 'Boa rota', count: 0, icon: 'fa-location-dot', color: 'bg-[#4B4E6D]' },
    { label: 'Muito simpático', count: 0, icon: 'fa-face-smile', color: 'bg-[#58C1E2]' },
  ];

  const conquistas = [
    { label: '0 viagens 5 estrelas', icon: 'fa-crown', color: 'bg-[#2E2E4D]' },
    { label: '0 anos com a Uber', icon: 'fa-cake-candles', color: 'bg-[#432A5E]' },
  ];

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto select-none pb-20 scrollbar-hide">
      {/* 1. Top Navigation Header */}
      <div className="pt-8 pb-2 px-5 flex items-center bg-white sticky top-0 z-[100]">
        <button onClick={onBack} className="p-2 -ml-2 active:opacity-50 transition-opacity">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="black" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex-1 text-center pr-8">
          <h1 className="text-[17px] font-bold text-black tracking-tight">Perfil Público</h1>
        </div>
      </div>

      {/* 2. Tabs Section */}
      <div className="flex border-b border-gray-100 bg-white sticky top-[64px] z-[90]">
        <div className="flex-1 flex flex-col items-center pt-3 pb-2 border-b-[2.5px] border-black">
          <div className="flex items-center gap-2">
             <i className="fa-solid fa-car text-[16px] text-black"></i>
             <span className="text-[14px] font-bold text-black">Viagens</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center pt-3 pb-2 opacity-30">
          <div className="flex items-center gap-2">
             <i className="fa-solid fa-utensils text-[16px] text-black"></i>
             <span className="text-[14px] font-bold text-black">Entregas</span>
          </div>
        </div>
      </div>

      {/* 3. Hero Section */}
      <div className="relative w-full h-[280px] bg-black flex flex-col items-center justify-center overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none grayscale invert" style={{ backgroundImage: 'url("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png")', backgroundSize: 'cover' }}></div>
        
        <div className="relative z-20 flex flex-col items-center">
          <div className="w-[84px] h-[84px] rounded-full overflow-hidden border-[1px] border-white/20 mb-3 shadow-2xl">
            <img 
              src={profileImage} 
              alt={userName} 
              className="w-full h-full object-cover transition-transform duration-200"
              style={{
                transform: `scale(${profileImageScale}) translate(${profileImageX}%, ${profileImageY}%)`
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/driver/300/300";
              }}
            />
          </div>
          
          <h2 className="text-[28px] font-black text-white tracking-tighter mb-5 leading-none">
            {userName.split(' ')[0]}
          </h2>

          {/* Botão posicionado um pouco mais abaixo (90% translate-y) conforme solicitado */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[90%] z-30">
            <button className="bg-white rounded-full px-5 py-[10px] flex items-center gap-2.5 shadow-[0_8px_25px_rgba(0,0,0,0.1)] active:scale-95 transition-transform min-w-[120px] justify-center">
               <div className="w-4 h-4 flex items-center justify-center">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M12 2L4 12L12 22L20 12L12 2Z" fill="#276EF1" />
                 </svg>
               </div>
               <span className="text-[17px] font-bold text-black tracking-tight">Azul</span>
               <i className="fa-solid fa-chevron-right text-black text-[10px] ml-0.5"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Information List Section - pt aumentado para pt-[64px] para compensar a descida do botão */}
      <div className="px-6 pt-[64px] space-y-5 bg-white border-b border-gray-100 pb-8">
        <div className="flex items-center gap-4">
           <div className="w-5 flex justify-center">
             <i className="fa-solid fa-globe text-[17px] text-black"></i>
           </div>
           <span className="text-[15px] font-bold text-black tracking-tight">Fala {language.split(' ')[0]}</span>
        </div>

        <div className="flex items-center gap-4">
           <div className="w-5 flex justify-center">
             <i className="fa-regular fa-clock text-[17px] text-black"></i>
           </div>
           <span className="text-[15px] font-bold text-black tracking-tight leading-snug">
             0 viagens em 0 anos
           </span>
        </div>
      </div>

      {/* 5. Elogios Section */}
      <div className="px-6 pt-8 pb-10 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[22px] font-black text-black tracking-tighter">Elogios</h3>
          <button className="text-[16px] font-bold text-black active:opacity-40">Ver tudo</button>
        </div>

        {/* Adicionado py-3 para dar espaço vertical aos badges e evitar cortes */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide -mx-2 px-2 py-3">
          {elogios.map((elogio, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[80px] text-center gap-2.5 group">
              <div className="relative w-[80px] h-[80px]">
                <div className={`w-full h-full rounded-full ${elogio.color} flex items-center justify-center shadow-sm relative overflow-hidden transition-transform active:scale-95`}>
                   {idx === 0 && <div className="absolute top-3 right-4 text-white/50"><i className="fa-solid fa-sparkles text-[8px]"></i></div>}
                   <i className={`fa-solid ${elogio.icon} text-[36px] text-white/95`}></i>
                </div>
                {/* Badge de contagem ajustado na posição para garantir visibilidade */}
                <div className="absolute top-0 right-0 bg-black text-white text-[11px] font-black h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded-full border-[2.5px] border-white shadow-lg translate-x-1.5 -translate-y-1 z-10">
                  {elogio.count}
                </div>
              </div>
              <span className="text-[13px] font-bold text-black leading-tight max-w-[80px]">
                {elogio.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Conquistas Section */}
      <div className="px-6 pt-4 pb-10 bg-white border-b border-gray-100">
        <h3 className="text-[22px] font-black text-black tracking-tighter mb-8">Conquistas</h3>

        <div className="grid grid-cols-2 gap-6 pb-2">
          {conquistas.map((conquista, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-3">
              <div className={`w-[90px] h-[90px] rounded-full ${conquista.color} flex items-center justify-center relative shadow-sm transition-transform active:scale-95`}>
                 <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-[85%] h-[85%] border border-dashed border-white rounded-full"></div>
                 </div>
                 
                 {idx === 0 ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <i key={i} className="fa-solid fa-star text-[6px] text-orange-400"></i>)}
                      </div>
                      <i className={`fa-solid ${conquista.icon} text-[40px] text-white/95`}></i>
                    </div>
                 ) : (
                    <div className="relative flex flex-col items-center">
                       <span className="text-[20px] font-black text-white leading-none mb-[-4px]">0</span>
                       <i className={`fa-solid ${conquista.icon} text-[32px] text-white/90`}></i>
                    </div>
                 )}
              </div>
              <span className="text-[13px] font-bold text-black leading-tight max-w-[100px]">
                {conquista.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Compartilhe a sua história Section */}
      <div className="px-6 pt-10 pb-14 bg-white">
        <h3 className="text-[22px] font-black text-black tracking-tighter mb-6 leading-tight">
          Compartilhe a sua história
        </h3>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
          {/* Card 1: Curiosidade */}
          <div className="min-w-[220px] bg-white rounded-[20px] border border-gray-100 p-6 shadow-[0_6px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between aspect-[1.5/1]">
            <div>
              <h4 className="text-[18px] font-black text-black mb-2 tracking-tight">Curiosidade</h4>
              <p className="text-[14px] font-bold text-[#545454] leading-[18px] tracking-tight">
                O que te torna uma pessoa única?
              </p>
            </div>
            <div className="flex justify-end pt-1">
              <button className="w-[42px] h-[42px] rounded-full bg-[#276EF1] flex items-center justify-center text-white shadow-[0_6px_15px_rgba(39,110,241,0.2)] active:scale-95 transition-transform">
                <i className="fa-solid fa-plus text-[18px]"></i>
              </button>
            </div>
          </div>

          {/* Card 2: Outro */}
          <div className="min-w-[220px] bg-white rounded-[20px] border border-gray-100 p-6 shadow-[0_6px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between aspect-[1.5/1]">
            <div>
              <h4 className="text-[18px] font-black text-black mb-2 tracking-tight">Outro</h4>
              <p className="text-[14px] font-bold text-[#545454] leading-[18px] tracking-tight">
                O que você gosta de fazer nas horas livres?
              </p>
            </div>
            <div className="flex justify-end pt-1">
              <button className="w-[42px] h-[42px] rounded-full bg-[#276EF1] flex items-center justify-center text-white shadow-[0_6px_15px_rgba(39,110,241,0.2)] active:scale-95 transition-transform">
                <i className="fa-solid fa-plus text-[18px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-8 bg-white"></div>
    </div>
  );
};

export default PublicProfile;
