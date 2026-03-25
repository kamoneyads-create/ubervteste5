
import React, { useState, useMemo } from 'react';
import { getDriverAdvice } from '../services/geminiService';

const Inbox: React.FC = () => {
  const messageTime = useMemo(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 27);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }, []);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Uber', text: 'Bem-vindo ao Uber Driver! Voce está aprovado para começar a receber solicitaçôes.', time: messageTime, read: false },
  ]);

  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendAiMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput;
    setUserInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setIsLoading(true);

    const response = await getDriverAdvice(msg);
    setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="h-full bg-white flex flex-col pt-12">
      <div className="px-6 pb-4 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Caixa de entrada</h1>
      </div>

      {!aiChatOpen ? (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-6 flex flex-col gap-1 hover:bg-gray-50 cursor-pointer ${!msg.read ? 'bg-blue-50/30' : ''}`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-gray-900">{msg.sender}</span>
                <span className="text-[10px] text-gray-400">{msg.time}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{msg.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-gray-50 relative">
          <div className="p-4 bg-white flex items-center gap-4 shadow-sm">
            <button onClick={() => setAiChatOpen(false)}>
              <i className="fa-solid fa-arrow-left text-gray-800"></i>
            </button>
            <div className="flex flex-col">
              <span className="font-bold text-sm">Assistente Uber IA</span>
              <span className="text-[10px] text-green-500 font-bold">Online agora</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 && (
               <div className="text-center text-gray-400 mt-10">
                 <i className="fa-solid fa-robot text-4xl mb-2"></i>
                 <p className="text-sm">Olá! Sou seu assistente de suporte. Como posso ajudar hoje?</p>
               </div>
            )}
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  chat.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {chat.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm animate-pulse flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSendAiMessage}
              className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
