import React, { useState } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatInterface } from './components/ChatInterface';
import { ReportView } from './components/ReportView';
import { startChatSession, sendMessageToGemini, generateBriefingJSON } from './services/geminiService';
import { Message, AppState, BriefingData } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reportData, setReportData] = useState<BriefingData | null>(null);

  const handleStartChat = async () => {
    setAppState(AppState.CHATTING);
    const session = startChatSession();
    
    // Initial greeting
    const initialGreeting = "Olá! Sou o assistente virtual da ASCOM do TRE-MT. Estou aqui para ajudar a divulgar as ações do seu cartório ou setor. Sobre qual evento ou atividade você gostaria de falar hoje?";
    
    // We add it to UI but we don't necessarily need to send it to the model history 
    // because the model system instruction already guides it. 
    // However, to keep consistency, we can just let the user answer the UI prompt.
    // Or we can ask the model to greet. Ideally, let's ask the model to start.
    
    // Reset messages
    setMessages([]);
    
    try {
        // Trigger the first message from AI
        const response = await sendMessageToGemini("Olá, vamos iniciar a entrevista.");
        setMessages([{
            id: 'init',
            role: 'model',
            text: response
        }]);
    } catch (e) {
        // Fallback if API fails immediately
        setMessages([{
            id: 'init',
            role: 'model',
            text: initialGreeting
        }]);
    }
  };

  const handleFinishChat = async () => {
    setAppState(AppState.GENERATING_REPORT);
    
    // Concatenate chat history for the prompt
    const historyText = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
    
    try {
      const data = await generateBriefingJSON(historyText);
      setReportData(data);
      setAppState(AppState.REPORT_VIEW);
    } catch (error) {
      console.error("Failed to generate report", error);
      alert("Erro ao gerar o relatório. Por favor, tente novamente.");
      setAppState(AppState.CHATTING);
    }
  };

  const handleReset = () => {
    setAppState(AppState.WELCOME);
    setMessages([]);
    setReportData(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      
      <main className="flex-1 overflow-hidden relative">
        {appState === AppState.WELCOME && (
          <WelcomeScreen onStart={handleStartChat} />
        )}

        {appState === AppState.CHATTING && (
          <ChatInterface 
            messages={messages} 
            setMessages={setMessages} 
            onFinish={handleFinishChat} 
          />
        )}

        {appState === AppState.GENERATING_REPORT && (
          <div className="flex flex-col items-center justify-center h-full bg-white/90 z-50 animate-in fade-in">
             <Loader2 className="w-12 h-12 text-tre-blue animate-spin mb-4" />
             <h3 className="text-xl font-bold text-gray-800">Organizando as informações...</h3>
             <p className="text-gray-500 mt-2">Estamos estruturando o briefing para a ASCOM.</p>
          </div>
        )}

        {appState === AppState.REPORT_VIEW && reportData && (
          <ReportView data={reportData} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;