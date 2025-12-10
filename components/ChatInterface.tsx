import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Send, CheckCircle, Bot, User } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onFinish: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, onFinish }) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Auto focus input on mount and after bot response
    if (!isSending) {
       inputRef.current?.focus();
    }
  }, [messages, isSending]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Desculpe, tive um problema ao processar sua resposta. Pode tentar novamente?",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-tre-blue text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-50 border border-blue-100 text-gray-800 rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isSending && (
           <div className="flex justify-start w-full animate-pulse">
             <div className="flex max-w-[80%] gap-2">
                <div className="w-8 h-8 rounded-full bg-tre-blue/50 flex-shrink-0"></div>
                <div className="bg-gray-100 h-10 w-24 rounded-2xl rounded-tl-none"></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="w-full bg-white border-t border-gray-100 p-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua resposta..."
                    disabled={isSending}
                    className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-tre-blue/50 focus:border-tre-blue transition-all disabled:bg-gray-50"
                />
                
                {/* Send Button */}
                <Button 
                    onClick={handleSend} 
                    disabled={!inputText.trim() || isSending}
                    className="rounded-full w-12 h-12 !px-0 flex items-center justify-center flex-shrink-0"
                    title="Enviar mensagem"
                >
                    <Send size={20} className={isSending ? "opacity-0" : "ml-0.5"} />
                </Button>

                {/* Finish Button - Green, Next to Send */}
                <button
                    onClick={onFinish}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full h-12 px-4 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 flex-shrink-0"
                    title="Finalizar entrevista e gerar pauta"
                >
                    <CheckCircle size={20} />
                    <span className="hidden sm:inline font-bold text-sm">FINALIZAR</span>
                </button>
            </div>
            
            <div className="flex justify-center items-center px-1">
                <p className="text-xs text-gray-400">Pressione Enter para enviar</p>
            </div>
        </div>
      </div>
    </div>
  );
};