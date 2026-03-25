
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TripRequest } from '../types';

interface TripChatProps {
  trip: TripRequest;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'driver' | 'passenger';
  timestamp: Date;
}

const TripChat: React.FC<TripChatProps> = ({ trip, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  
  const quickReplies = [
    "Cheguei",
    "Ok, entendi",
    "Estou a caminho",
    "Estou parado no trânsito"
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'driver',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsSeen(false);

    // 1. Show "Seen" after 6 seconds
    setTimeout(() => {
      setIsSeen(true);
    }, 6000);

    // 2. Start "Typing" after 12 seconds
    setTimeout(() => {
      setIsTyping(true);
    }, 12000);

    // 3. Deliver message after 30 seconds
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Tudo bem, estou aguardando.",
        sender: 'passenger',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 30000);
  };

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2">
            <i className="fa-solid fa-arrow-left text-lg text-black"></i>
          </button>
          <h1 className="text-lg font-bold text-black uppercase tracking-tight">
            {trip.passengerName.split(' ')[0]}
          </h1>
        </div>
        <button className="w-9 h-9 bg-[#F3F3F7] rounded-full flex items-center justify-center active:scale-95 transition-transform">
          <i className="fa-solid fa-phone text-black text-base"></i>
        </button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
            <div className="mb-6">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="#F3F3F7" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
              </svg>
            </div>
            <p className="text-gray-500 text-base font-medium leading-tight max-w-[280px]">
              Não envie mensagens de texto enquanto dirige
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={msg.id} className="flex flex-col">
                <div className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-base font-medium ${
                      msg.sender === 'driver' 
                        ? 'bg-[#276EF1] text-white rounded-tr-none' 
                        : 'bg-[#F3F3F7] text-black rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
                {/* Show "Visto" only for the last driver message if no passenger response yet */}
                {msg.sender === 'driver' && index === messages.length - 1 && isSeen && !isTyping && (
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Visto</span>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-start">
                  <div className="bg-[#F3F3F7] px-4 py-2 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">Digitando...</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 pb-6 flex flex-col gap-4 bg-white border-t border-gray-50">
        {/* Quick Replies */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {quickReplies.map((reply, index) => (
            <button 
              key={index}
              onClick={() => handleSendMessage(reply)}
              className="whitespace-nowrap bg-[#F3F3F7] px-4 py-2.5 rounded-full text-black font-bold text-[15px] active:scale-95 transition-transform"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#F3F3F7] rounded-2xl px-4 py-3">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(message); }}>
              <input 
                type="text" 
                placeholder="Mensagem..." 
                className="w-full bg-transparent outline-none text-black text-[16px] font-medium placeholder:text-gray-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </form>
          </div>
          <button 
            onClick={() => handleSendMessage(message)}
            className="w-12 h-12 bg-[#F3F3F7] rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <i className={`fa-solid fa-paper-plane text-xl ${message.trim() ? 'text-[#276EF1]' : 'text-gray-400'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripChat;
