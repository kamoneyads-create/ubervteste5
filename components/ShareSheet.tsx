
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareSheet: React.FC<ShareSheetProps> = ({ isOpen, onClose }) => {
  const apps = [
    { name: 'AirDrop', icon: (
      <div className="w-16 h-16 bg-white rounded-[18px] flex items-center justify-center shadow-sm">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="#007AFF" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="6" stroke="#007AFF" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="9" stroke="#007AFF" strokeWidth="1.5"/>
        </svg>
      </div>
    )},
    { name: 'Mensagens', icon: (
      <div className="w-16 h-16 bg-[#34C759] rounded-[18px] flex items-center justify-center shadow-sm">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.03 2 11c0 2.485 1.12 4.73 2.94 6.33L4 21l4.67-1.33c1.03.21 2.11.33 3.33.33 5.523 0 10-4.03 10-9s-4.477-9-10-9z"/>
        </svg>
      </div>
    )},
    { name: 'WhatsApp', icon: (
      <div className="w-16 h-16 bg-[#25D366] rounded-[18px] flex items-center justify-center shadow-sm">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.602 6.04L0 24l6.105-1.602a11.832 11.832 0 005.937 1.604h.005c6.634 0 12.032-5.396 12.035-12.032a11.799 11.799 0 00-3.489-8.492"/>
        </svg>
      </div>
    )},
    { name: 'Gmail', icon: (
      <div className="w-16 h-16 bg-white rounded-[18px] flex items-center justify-center shadow-sm overflow-hidden">
        <svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335"/>
        </svg>
      </div>
    )},
    { name: 'Telegram', icon: (
      <div className="w-16 h-16 bg-[#24A1DE] rounded-[18px] flex items-center justify-center shadow-sm">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.441-.169.575-.456.768-.661.787-.446.041-.785-.293-1.217-.577-.677-.443-1.059-.718-1.716-1.151-.76-.5-2.674-1.737-.547-2.674.556-.245 3.391-1.554 3.447-1.792.007-.03.013-.141-.054-.201-.066-.06-.163-.04-.233-.024-.099.022-1.684 1.071-4.756 3.144-.45.309-.857.461-1.221.453-.401-.008-1.173-.226-1.747-.412-.705-.23-1.266-.351-1.217-.741.025-.203.305-.411.84-.624 3.294-1.433 5.491-2.379 6.591-2.838 3.14-1.31 3.792-1.538 4.218-1.545.094-.002.303.021.439.132.115.094.147.22.155.308.009.09.011.257-.001.373z"/>
        </svg>
      </div>
    )},
  ];

  const actions = [
    { name: 'Copiar', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    )},
    { name: 'Nova Nota Rápida', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    )},
    { name: 'Salvar em Arquivos', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
    )},
    { name: 'Abrir no Acrobat', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    )},
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[8000]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] z-[8001] rounded-t-[20px] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-2 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-black rounded-xl flex flex-col items-center justify-center border border-white/10">
                  <span className="text-white text-[10px] font-bold leading-none mb-0.5">Uber</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 bg-[#3A3A3C] rounded-full flex items-center justify-center text-[#AEAEB2]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Apps Horizontal Scroll */}
            <div className="overflow-x-auto scrollbar-hide px-4 py-4 flex gap-5">
              {apps.map((app, index) => (
                <div key={index} className="flex flex-col items-center gap-1.5 min-w-[64px]">
                  {app.icon}
                  <span className="text-[#F2F2F7] text-[11px] font-medium">{app.name}</span>
                </div>
              ))}
            </div>

            {/* Actions List */}
            <div className="px-4 pb-8 space-y-0.5">
              <div className="bg-[#2C2C2E] rounded-2xl overflow-hidden">
                {actions.map((action, index) => (
                  <button 
                    key={index}
                    className={`w-full px-4 py-4 flex justify-between items-center active:bg-[#3A3A3C] transition-colors ${index !== actions.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <span className="text-white text-[17px] font-medium">{action.name}</span>
                    <div className="text-white">
                      {action.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareSheet;
