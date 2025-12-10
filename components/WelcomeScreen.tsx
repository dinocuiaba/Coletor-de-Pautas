import React from 'react';
import { Button } from './Button';
import { MessageSquareText, FileText, Info } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-6 text-center animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="w-16 h-16 bg-tre-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 text-tre-blue">
          <MessageSquareText size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Olá, servidor(a) do TRE-MT</h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Este aplicativo é uma ferramenta oficial para auxiliar a <strong>Assessoria de Comunicação (ASCOM)</strong> na coleta de informações sobre ações e eventos do seu cartório ou setor.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left mb-8">
          <h3 className="text-sm font-bold text-tre-blue flex items-center gap-2 mb-2">
            <Info size={16} /> Como funciona:
          </h3>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>O assistente virtual fará perguntas sobre o evento/ação.</li>
            <li>Responda com naturalidade, fornecendo os detalhes solicitados.</li>
            <li>Ao final, um resumo estruturado será gerado para a ASCOM.</li>
            <li><strong>Atenção:</strong> O sistema apenas coleta os dados, não redige a matéria final.</li>
          </ul>
        </div>

        <Button onClick={onStart} className="w-full md:w-auto min-w-[200px] mx-auto text-lg py-3">
          Iniciar Entrevista
        </Button>
      </div>
      
      <p className="mt-8 text-xs text-gray-400">
        Tribunal Regional Eleitoral de Mato Grosso • Assessoria de Comunicação
      </p>
    </div>
  );
};