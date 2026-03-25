import React, { useState } from 'react';

interface PasswordLoginProps {
  userName: string;
  onBack: () => void;
  onForgotPassword: () => void;
  onNext: (password: string) => void;
}

const PasswordLogin: React.FC<PasswordLoginProps> = ({ userName, onBack, onForgotPassword, onNext }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleNext = () => {
    if (password.trim() && !isLoading) {
      setIsLoading(true);
      
      // Dismiss keyboard
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // 3.5 seconds delay before proceeding
      setTimeout(() => {
        onNext(password);
      }, 3500);
    }
  };

  const handleForgotPassword = () => {
    if (!isForgotLoading) {
      setIsForgotLoading(true);
      
      // Dismiss keyboard
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // 3 seconds delay before proceeding
      setTimeout(() => {
        setIsForgotLoading(false);
        onForgotPassword();
      }, 3000);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col px-6 pt-12 pb-8 text-black font-sans relative overflow-hidden">
      {/* Title */}
      <h1 className="text-[24px] font-bold leading-tight mb-10">
        Que bom que você voltou,<br />
        {userName}.
      </h1>

      {/* Password Input */}
      <div className="relative mb-8">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Insira sua senha"
          className="w-full border-2 border-black rounded-xl py-4 px-5 text-lg focus:outline-none pr-14"
          disabled={isLoading || isForgotLoading}
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-black"
          disabled={isLoading || isForgotLoading}
        >
          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xl`}></i>
        </button>
      </div>

      {/* Options */}
      <div className="flex flex-col items-start gap-3">
        <button 
          onClick={handleForgotPassword}
          disabled={isForgotLoading || isLoading}
          className="bg-[#F3F3F3] px-5 py-2 rounded-full font-semibold text-[15px] active:scale-95 transition-transform flex items-center justify-center min-w-[160px] h-[36px] disabled:opacity-70"
        >
          {isForgotLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Esqueci minha senha"
          )}
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto flex justify-between items-center pt-6">
        <button 
          onClick={onBack}
          disabled={isLoading}
          className="w-12 h-12 bg-[#F3F3F3] rounded-full flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
        >
          <i className="fa-solid fa-arrow-left text-lg"></i>
        </button>

        <button 
          onClick={handleNext}
          disabled={!password.trim() || isLoading}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base transition-all ${
            password.trim() && !isLoading
              ? 'bg-black text-white active:scale-95' 
              : 'bg-[#F3F3F3] text-[#A6A6A6] cursor-not-allowed'
          }`}
        >
          Avançar
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-1"></div>
          ) : (
            <i className="fa-solid fa-arrow-right ml-1"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordLogin;
