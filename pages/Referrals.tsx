
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareSheet from '../components/ShareSheet';

interface ReferralsProps {
  onBack: () => void;
}

const Referrals: React.FC<ReferralsProps> = ({ onBack }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);

  return (
    <div className="absolute inset-0 z-[6000] bg-white select-none flex flex-col font-sans">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Top Banner Section */}
        <div className="relative bg-[#FDE8E8] pt-10 pb-8 px-6 overflow-hidden">
          {/* Navigation Icons */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center -ml-1 active:scale-90 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center -mr-1 active:scale-90 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="black"/>
                <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Title */}
          <div className="relative">
            <h1 className="text-[32px] font-bold text-black leading-[1.2] tracking-tight">
              Indique pessoas
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pt-8">
          <h2 className="text-[22px] font-bold text-black leading-[1.2] tracking-tight mb-10">
            Ganhe até R$ 700 para cada amigo que concluir viagens
          </h2>

          {/* List Items */}
          <div className="space-y-10">
            {/* Car Item */}
            <div className="flex items-center">
              <div className="flex flex-col">
                <h3 className="text-[17px] font-bold text-black leading-tight mb-1">
                  Ganhe até R$ 700 por viagens feitas
                </h3>
                <p className="text-[15px] font-medium text-[#545454]">
                  R$ 700 por 70 viagens
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#EEEEEE]"></div>

            {/* Delivery Item */}
            <div className="flex items-center">
              <div className="flex flex-col">
                <h3 className="text-[17px] font-bold text-black leading-tight mb-1">
                  Ganhe até R$ 300 por entregas feitas
                </h3>
                <p className="text-[15px] font-medium text-[#545454]">
                  R$ 300 por 30 entregas
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="mt-12">
            <button className="w-full py-4 bg-[#EEEEEE] rounded-xl text-black font-bold text-[17px] active:scale-[0.98] transition-all">
              Ver todas as vantagens
            </button>
          </div>

          {/* Status Section */}
          <div className="mt-14">
            <h2 className="text-[26px] font-bold text-black mb-5">Status</h2>
            
            <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
              <div className="flex mb-6">
                {/* Pessoas Indicadas */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 11C10.9853 11 13 8.98528 13 6.5C13 4.01472 10.9853 2 8.5 2C6.01472 2 4 4.01472 4 6.5C4 8.98528 6.01472 11 8.5 11Z" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2521 22.1614 16.5523C21.6184 15.8524 20.8581 15.3516 20 15.13" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 2.13C17.8606 2.35031 18.6232 2.85071 19.1676 3.55117C19.712 4.25162 20.0078 5.11404 20.0078 6.005C20.0078 6.89596 19.712 7.75838 19.1676 8.45883C18.6232 9.15929 17.8606 9.65969 17 9.88" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[15px] font-medium text-[#545454]">Pessoas indicadas</span>
                  </div>
                  <span className="text-[30px] font-bold text-black">0</span>
                </div>

                {/* Divider Line */}
                <div className="w-[1px] bg-gray-100 mx-2"></div>

                {/* Você Ganhou */}
                <div className="flex-1 pl-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 9H20M4 9H2" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[15px] font-medium text-[#545454]">Você ganhou</span>
                  </div>
                  <span className="text-[30px] font-bold text-black">R$ 0</span>
                </div>
              </div>

              <button className="w-full py-3.5 bg-[#F3F3F7] rounded-xl text-black font-bold text-[16px] active:scale-[0.98] transition-all">
                Mostrar convites
              </button>
            </div>

            <p className="text-[17px] text-black leading-[1.4] mt-10 font-medium pb-4">
              A pessoa que você indicou tem 30 dias para concluir as viagens após aceitar o convite em Rio de Janeiro. As vantagens podem ser diferentes se a pessoa estiver em outra cidade.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Footer with Button */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <button 
          onClick={() => setShowInviteModal(true)}
          className="w-full py-4.5 bg-black text-white rounded-xl font-bold text-[18px] active:scale-[0.98] transition-all"
        >
          Convidar
        </button>
      </div>

      {/* Invite Modal (Bottom Sheet) */}
      <AnimatePresence>
        {showInviteModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-black/50 z-[7000]"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white z-[7001] rounded-t-[24px] px-6 pt-8 pb-10 flex flex-col items-center"
            >
              {/* Handle bar */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6" />

              <h3 className="text-[24px] font-bold text-black mb-8">Enviar convite</h3>

              <div className="w-full space-y-4">
                <button className="w-full py-5 bg-[#F3F3F7] rounded-2xl text-black font-bold text-[18px] active:scale-[0.98] transition-all">
                  Indicar a partir dos seus contatos
                </button>
                
                <button 
                  onClick={() => {
                    setShowInviteModal(false);
                    setShowShareSheet(true);
                  }}
                  className="w-full py-5 bg-black text-white rounded-2xl font-bold text-[18px] active:scale-[0.98] transition-all"
                >
                  Compartilhar seu link
                </button>

                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="w-full py-4 text-black font-bold text-[18px] mt-2 active:scale-[0.95] transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ShareSheet 
        isOpen={showShareSheet} 
        onClose={() => setShowShareSheet(false)} 
      />
    </div>
  );
};

export default Referrals;
