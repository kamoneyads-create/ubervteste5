
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TripRequest } from '../types';

interface TripSupportProps {
  trip: TripRequest;
  onBack: () => void;
  onCancelTrip: () => void;
  onOpenChat: () => void;
}

const TripSupport: React.FC<TripSupportProps> = ({ trip, onBack, onCancelTrip, onOpenChat }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const options = [
    { text: "Aceitei por engano", icon: "fa-xmark", action: () => setShowCancelModal(true) },
    { text: "Tive problemas no trajeto até o local de partida", icon: "fa-xmark", action: () => setShowCancelModal(true) },
    { text: "Errei o caminho", icon: "fa-xmark", action: () => setShowCancelModal(true) },
    { text: "Não vale a pena ir até o local de partida", icon: "fa-xmark", action: () => setShowCancelModal(true) },
    { text: "O local de embarque não é seguro", icon: "fa-xmark", action: () => setShowCancelModal(true) },
    { text: "Problema no veículo", icon: "fa-xmark", action: () => setShowCancelModal(true) },
    { text: "Não aceitou ser gravado", icon: "fa-microphone", action: () => setShowCancelModal(true) },
    { text: "Mais problemas", icon: "fa-ellipsis-vertical", action: () => setShowCancelModal(true) }
  ];

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3">
        <button onClick={onBack} className="p-2 -ml-2">
          <i className="fa-solid fa-arrow-left text-xl text-black"></i>
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-6 flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-black tracking-tight uppercase">
            {trip.passengerName.split(' ')[0]}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-black">{trip.rating.toFixed(2).replace('.', ',')}</span>
              <i className="fa-solid fa-star text-black text-xs"></i>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-base font-medium text-black">{trip.type}</span>
          </div>
          <div className="mt-2">
            <div className="inline-flex items-center gap-2 bg-[#F3F3F7] px-2 py-1 rounded-lg border border-gray-100">
              <div className="w-4 h-4 bg-[#276EF1] rounded-full flex items-center justify-center">
                <i className="fa-solid fa-check text-white text-[8px]"></i>
              </div>
              <span className="text-xs font-bold text-gray-600">Verificado</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onOpenChat}
          className="w-12 h-12 bg-[#F3F3F7] rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-comment-dots text-black text-xl"></i>
        </button>
      </div>

      {/* Address Section */}
      <div className="px-6 flex gap-4 mb-6">
        <div className="mt-1">
          <i className="fa-solid fa-location-dot text-black text-lg"></i>
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium text-black leading-tight">
            {trip.pickup}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-100 mb-4"></div>

      {/* Options Section */}
      <div className="px-6 flex-1 overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-600 mb-4 leading-tight">
          Aconteceu alguma coisa? Escolha o problema:
        </h2>

        <div className="flex flex-col">
          {options.map((option, index) => (
            <button 
              key={index}
              className="flex items-center gap-4 py-4 border-b border-gray-50 active:bg-gray-50 transition-colors text-left"
              onClick={option.action}
            >
              <i className={`fa-solid ${option.icon} text-xl text-black w-6 text-center`}></i>
              <span className="text-base font-bold text-black leading-snug flex-1">
                {option.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="absolute inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-[110] bg-white rounded-t-[32px] px-6 pt-10 pb-12 flex flex-col items-center text-center"
            >
              <div className="mb-6">
                <svg width="84" height="84" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9.5" stroke="#E31C3D" strokeWidth="3" />
                  <path d="M18.5 5.5L5.5 18.5" stroke="#E31C3D" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="text-3xl font-black text-black mb-10 tracking-tight">
                Quer cancelar a viagem?
              </h3>

              <div className="w-full flex flex-col gap-4">
                <button 
                  onClick={onCancelTrip}
                  className="w-full py-5 bg-[#E31C3D] text-white font-bold text-xl rounded-xl shadow-lg active:scale-[0.98] transition-all uppercase tracking-tight"
                >
                  Cancelar viagem
                </button>
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-5 bg-[#F3F3F7] text-black font-bold text-xl rounded-xl active:scale-[0.98] transition-all uppercase tracking-tight"
                >
                  Continuar viagem
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripSupport;
