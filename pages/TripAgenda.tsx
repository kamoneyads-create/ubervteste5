
import React from 'react';
import { TripRequest } from '../types';

interface TripAgendaProps {
  trip: TripRequest;
  onBack: () => void;
  onStopNewRequests: () => void;
  onOpenSupport: () => void;
}

const TripAgenda: React.FC<TripAgendaProps> = ({ trip, onBack, onStopNewRequests, onOpenSupport }) => {
  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <button onClick={onBack} className="p-2">
          <i className="fa-solid fa-xmark text-xl text-black"></i>
        </button>
        <h1 className="text-lg font-medium text-black">Agenda de viagens</h1>
        <button className="p-2">
          <i className="fa-solid fa-list-ul text-xl text-black"></i>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-50">
          {/* Pickup */}
          <div className="flex items-center p-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-[#0E8345] rounded-full flex items-center justify-center mr-3">
              <i className="fa-solid fa-user text-white text-xs"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-black text-sm">Partida</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-xs">{trip.type}</span>
              </div>
              <p className="text-gray-900 font-medium text-sm">{trip.passengerName.toUpperCase()}</p>
            </div>
            <button className="p-1" onClick={onOpenSupport}>
              <i className="fa-solid fa-ellipsis-vertical text-gray-400"></i>
            </button>
          </div>

          {/* Destination */}
          <div className="flex items-center p-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <i className="fa-solid fa-user text-gray-400 text-xs"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-black text-sm">Chegada</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-xs">{trip.type}</span>
              </div>
              <p className="text-gray-900 font-medium text-sm">{trip.passengerName.toUpperCase()}</p>
            </div>
            <button className="p-1">
              <i className="fa-solid fa-ellipsis-vertical text-gray-400"></i>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="text-[#276EF1] font-bold text-base">
            Registro de viagens
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <button className="p-3">
            <i className="fa-solid fa-sliders text-2xl text-black"></i>
          </button>
          
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={onStopNewRequests}
              className="w-16 h-16 bg-[#E31C3D] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <i className="fa-solid fa-hand text-white text-2xl"></i>
            </button>
            <p className="text-center text-gray-600 font-medium leading-tight max-w-[130px] text-xs">
              Interromper novas solicitações
            </p>
          </div>

          <button className="p-3">
            <i className="fa-solid fa-magnifying-glass text-2xl text-black"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripAgenda;
