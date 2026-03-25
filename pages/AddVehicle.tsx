
import React, { useState, useRef } from 'react';
import { processVehicleImage } from '../services/geminiService';

interface AddVehicleProps {
  onBack: () => void;
  onAdd?: (name: string, plate: string, image?: string) => void;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ onBack, onAdd }) => {
  const [brand, setBrand] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = brand.trim().length > 0 && plate.trim().length >= 7 && !isProcessing;

  const resizeImage = (base64Str: string, maxDim: number = 512): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';
          ctx.drawImage(img, 0, 0, width, height);
        }
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await resizeImage(reader.result as string, 512);
        const processed = await processVehicleImage(compressed);
        setVehicleImage(processed);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col select-none overflow-hidden">
      {/* Header */}
      <div className="pt-10 px-6 pb-2 flex items-center justify-between bg-white sticky top-0 z-50">
        <button onClick={onBack} className="p-2 -ml-4 active:opacity-40 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-[17px] font-bold text-black absolute left-1/2 -translate-x-1/2">Uber</span>
        <div className="w-6"></div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10 scrollbar-hide">
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-tight mb-6">
          Requisitos do veículo
        </h1>

        <p className="text-[16px] text-gray-700 leading-normal mb-10">
          Para dirigir pelo app da Uber, seu veículo precisa atender aos requisitos mínimos da sua cidade.
        </p>

        <h2 className="text-[20px] font-bold text-black tracking-tight mb-4">
          Informações do veículo
        </h2>

        {/* Foto do Veículo Preview */}
        <div 
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className="w-full h-44 bg-white border-2 border-dashed border-gray-200 rounded-2xl mb-8 flex flex-col items-center justify-center overflow-hidden cursor-pointer relative"
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
              <span className="text-[10px] font-bold text-black uppercase">Processando...</span>
            </div>
          ) : vehicleImage ? (
            <img src={vehicleImage} className="w-full h-full object-contain p-4" alt="Preview" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <i className="fa-solid fa-camera text-gray-300 text-2xl"></i>
              <span className="text-[12px] font-bold text-gray-400">Adicionar foto</span>
            </div>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

        <p className="text-[14px] text-gray-700 mb-2 font-medium">Marca e Modelo</p>
        <div className="w-full h-[58px] bg-[#F3F3F7] rounded-[12px] flex items-center px-4 mb-4 focus-within:ring-2 focus-within:ring-black/5">
          <input 
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[17px] font-medium text-black"
          />
        </div>

        <p className="text-[14px] text-gray-700 mb-2 font-medium">Placa</p>
        <div className="w-full h-[58px] bg-[#F3F3F7] rounded-[12px] flex items-center px-4 mb-8 focus-within:ring-2 focus-within:ring-black/5">
          <input 
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            className="w-full bg-transparent border-none outline-none text-[17px] font-medium text-black"
          />
        </div>

        <div className="h-20"></div>
      </div>

      <div className="p-6 pb-12 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button 
          disabled={!isFormValid}
          onClick={() => {
            setTimeout(() => {
              onAdd?.(brand, plate, vehicleImage || undefined);
            }, 1000);
          }}
          className={`w-full font-bold py-[16px] rounded-[12px] text-[18px] transition-all duration-200 ${
            isFormValid 
              ? 'bg-black text-white active:scale-[0.98]' 
              : 'bg-[#EEEEEE] text-[#A6A6A6] cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default AddVehicle;
