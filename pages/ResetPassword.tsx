
import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface ResetPasswordProps {
  onBack: () => void;
  onUpdate: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack, onUpdate }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid = currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={onBack} className="p-1 -ml-1">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="ml-4 text-[18px] font-medium text-gray-900">Conta da Uber</h1>
      </div>

      <div className="px-6 pt-8 flex-1 overflow-y-auto pb-10">
        <h2 className="text-[28px] font-bold text-gray-900 mb-4">Senha</h2>
        <p className="text-gray-600 text-[15px] leading-relaxed mb-8">
          Sua senha deve ter pelo menos 8 caracteres, e pelo menos um número e um caractere não numérico
        </p>

        {/* Current Password */}
        <div className="mb-6">
          <label className="block text-gray-700 text-[14px] font-medium mb-2">
            Senha atual
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#F3F3F3] rounded-lg px-4 py-3.5 text-[16px] outline-none focus:ring-2 focus:ring-black/5 transition-all"
              placeholder=""
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Input 1 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-[14px] font-medium mb-2">
            Nova senha
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#F3F3F3] rounded-lg px-4 py-3.5 text-[16px] outline-none focus:ring-2 focus:ring-black/5 transition-all"
              placeholder=""
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Input 2 */}
        <div className="mb-10">
          <label className="block text-gray-700 text-[14px] font-medium mb-2">
            Confirme a nova senha
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#F3F3F3] rounded-lg px-4 py-3.5 text-[16px] outline-none focus:ring-2 focus:ring-black/5 transition-all"
              placeholder=""
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Update Button */}
        <div className="flex justify-center">
          <button
            onClick={onUpdate}
            disabled={!isFormValid}
            className={`w-full max-w-[200px] py-3.5 rounded-full text-[16px] font-medium transition-all ${
              isFormValid 
                ? 'bg-black text-white active:scale-95' 
                : 'bg-[#EEEEEE] text-[#999999] cursor-not-allowed'
            }`}
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
