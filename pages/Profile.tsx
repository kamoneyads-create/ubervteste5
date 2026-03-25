
import React from 'react';

interface ProfileProps {
  userName: string;
  profileImage?: string;
  profileImageScale?: number;
  profileImageX?: number;
  profileImageY?: number;
  onLogout: () => void;
  onDetail?: () => void;
  onEdit?: () => void;
  onAccount?: () => void;
  onOpportunities?: () => void;
  onReferrals?: () => void;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  userName, 
  profileImage, 
  profileImageScale = 1,
  profileImageX = 0,
  profileImageY = 0,
  onLogout, 
  onDetail, 
  onEdit, 
  onAccount, 
  onOpportunities, 
  onReferrals, 
  onBack 
}) => {
  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto scrollbar-hide pt-12 px-8 select-none pb-40">
      {/* User Header Section */}
      <div 
        className="flex flex-col items-start mb-10 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all duration-200"
        onClick={onDetail}
      >
        <div className="flex items-start gap-6">
          <div className="relative shrink-0 w-[72px] h-[72px]">
            <div className="w-full h-full rounded-full overflow-hidden border border-gray-100 shadow-sm shrink-0 aspect-square">
              <img 
                src={profileImage || "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/junior_driver.jpg"} 
                alt={userName} 
                className="w-full h-full object-cover transition-transform duration-200"
                style={{
                  transform: `scale(${profileImageScale}) translate(${profileImageX}%, ${profileImageY}%)`
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://picsum.photos/seed/junior/200/200";
                }}
              />
            </div>
            {/* Blue Diamond Badge */}
            <div className="absolute -bottom-1 -left-1 w-[22px] h-[22px] bg-white rounded-full flex items-center justify-center shadow-md border border-gray-50 z-10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 2L4 12L12 22L20 12L12 2Z" fill="#276EF1" stroke="#276EF1" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col pt-2">
            <h2 className="text-[22px] font-bold text-black tracking-tight leading-tight">{userName}</h2>
            <div className="flex items-center gap-1.5 mt-1.5">
              <i className="fa-solid fa-star text-black text-[12px]"></i>
              <span className="text-[18px] font-bold text-black">5,00</span>
              {/* Seta removida conforme solicitação */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu Items */}
      <div className="flex flex-col space-y-[26px] mb-12">
        <h3 
          onClick={onReferrals}
          className="text-[32px] font-black text-black leading-none tracking-tight active:opacity-50 transition-opacity cursor-pointer"
        >
          Indicações
        </h3>
        
        <div 
          onClick={onOpportunities}
          className="flex items-center gap-3 active:opacity-50 transition-opacity cursor-pointer"
        >
          <h3 className="text-[32px] font-black text-black leading-none tracking-tight">
            Oportunidades
          </h3>
          <div className="w-[10px] h-[10px] bg-[#276EF1] rounded-full mt-2"></div>
        </div>
        
        <h3 className="text-[32px] font-black text-black leading-none tracking-tight active:opacity-50 transition-opacity cursor-pointer">
          Uber Pro
        </h3>
        
        <h3 className="text-[32px] font-black text-black leading-none tracking-tight active:opacity-50 transition-opacity cursor-pointer">
          Carteira
        </h3>
        
        <h3 
          onClick={onAccount}
          className="text-[32px] font-black text-black leading-none tracking-tight active:opacity-50 transition-opacity cursor-pointer"
        >
          Conta
        </h3>
      </div>

      {/* Divider */}
      <div className="w-full h-[1.5px] bg-gray-100 mb-10"></div>

      {/* Secondary Items */}
      <div className="flex flex-col space-y-8">
        <h4 
          onClick={onEdit}
          className="text-[20px] font-bold text-black tracking-tight active:opacity-50 transition-opacity cursor-pointer"
        >
          Ajuda
        </h4>
        <h4 className="text-[20px] font-bold text-black tracking-tight active:opacity-50 transition-opacity cursor-pointer">
          Informações
        </h4>
      </div>

      <div className="mt-auto pb-10"></div>
    </div>
  );
};

export default Profile;
