
import React from 'react';

interface PayoutInfoProps {
  bankAccount: string;
  onBack: () => void;
}

const BankIcon = () => (
  <div className="w-[32px] h-[32px] bg-[#276EF1] rounded flex items-center justify-center shrink-0">
    <i className="fa-solid fa-building-columns text-white text-[14px]"></i>
  </div>
);

const PayoutInfo: React.FC<PayoutInfoProps> = ({ bankAccount, onBack }) => {
  return (
    <div className="h-full bg-white flex flex-col select-none overflow-hidden">
      {/* Header fixo no topo */}
      <div className="pt-8 px-6 pb-2 bg-white sticky top-0 z-50 shrink-0 border-b border-gray-50">
        <button onClick={onBack} className="p-2 -ml-4 active:opacity-40 transition-opacity">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Área de conteúdo com rolagem (scroll) habilitada */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-6 pt-6 flex flex-col gap-10">
          
          {/* Seção 1: Repasse de ganhos (Original) */}
          <div className="flex flex-col">
            <h1 className="text-[28px] font-black text-black tracking-tighter leading-tight mb-6">
              Repasse de ganhos
            </h1>
            
            <div className="flex items-start gap-4 active:bg-gray-50 -mx-2 p-2 rounded-xl transition-colors cursor-pointer group">
              <BankIcon />
              <div className="flex-1 flex flex-col gap-0.5 pr-4">
                 <span className="text-[16px] font-bold text-black leading-tight tracking-tight">
                   Conta bancária - {bankAccount}
                 </span>
                 <p className="text-[14px] font-medium text-[#545454] leading-tight tracking-tight">
                   Os ganhos serão transferidos para essa conta
                 </p>
              </div>
              <div className="pt-1">
                <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
              </div>
            </div>
          </div>

          {/* Seção 2: Formas de pagamento conectadas (Original) */}
          <div className="flex flex-col">
            <h2 className="text-[22px] font-black text-black tracking-tighter leading-tight mb-4">
              Formas de pagamento conectadas
            </h2>

            <div className="flex flex-col">
              <div className="flex items-center gap-4 py-4 active:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-b border-gray-100 last:border-0">
                <BankIcon />
                <div className="flex-1">
                  <span className="text-[16px] font-bold text-black leading-tight tracking-tight">
                    Conta bancária - {bankAccount}
                  </span>
                </div>
                <div>
                  <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÕES ADICIONAIS PARA GARANTIR ROLAGEM E REALISMO */}
          
          <div className="flex flex-col gap-6">
            <h2 className="text-[22px] font-black text-black tracking-tighter leading-tight">
              Histórico e Configurações
            </h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between py-4 border-b border-gray-100 active:opacity-50 transition-opacity cursor-pointer">
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-clock-rotate-left text-[18px] text-black w-6 text-center"></i>
                  <span className="text-[16px] font-bold text-black">Ver histórico de repasses</span>
                </div>
                <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-100 active:opacity-50 transition-opacity cursor-pointer">
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-calendar-check text-[18px] text-black w-6 text-center"></i>
                  <span className="text-[16px] font-bold text-black">Cronograma de pagamentos</span>
                </div>
                <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-100 active:opacity-50 transition-opacity cursor-pointer">
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-shield-halved text-[18px] text-black w-6 text-center"></i>
                  <span className="text-[16px] font-bold text-black">Segurança e Verificação</span>
                </div>
                <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
              </div>
            </div>
          </div>

          <div className="bg-[#F3F3F7] rounded-2xl p-6 mb-4">
            <h3 className="text-[17px] font-bold text-black mb-2">Sobre os repasses</h3>
            <p className="text-[14px] text-gray-600 leading-relaxed">
              Os ganhos acumulados de segunda-feira (04:00) a segunda-feira (03:59) são processados automaticamente e enviados para sua conta cadastrada. O prazo para compensação bancária é de até 2 dias úteis.
            </p>
            <button className="text-[14px] font-bold text-[#276EF1] mt-4">Saiba mais</button>
          </div>

          <div className="flex flex-col gap-4 pb-20">
             <div className="flex items-center justify-between py-2 active:opacity-50 cursor-pointer">
                <span className="text-[15px] font-bold text-black">Ajuda com pagamentos</span>
                <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
             </div>
             <div className="flex items-center justify-between py-2 active:opacity-50 cursor-pointer">
                <span className="text-[15px] font-bold text-black">Termos e Condições</span>
                <i className="fa-solid fa-chevron-right text-[12px] text-gray-300"></i>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PayoutInfo;
