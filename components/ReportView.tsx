import React, { useState } from 'react';
import { BriefingData } from '../types';
import { Button } from './Button';
import { CheckCircle, RotateCcw, Send, FileSpreadsheet, Loader2, User, MessageSquareQuote } from 'lucide-react';
import { sendToSheet } from '../services/sheetService';

interface ReportViewProps {
  data: BriefingData;
  onReset: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ data, onReset }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendToASCOM = async () => {
    setIsSending(true);
    const success = await sendToSheet(data);
    
    if (success) {
        setIsSent(true);
    } else {
        alert("Houve um problema ao tentar enviar. Verifique a conexão ou a configuração da planilha.");
    }
    setIsSending(false);
  };

  const DataItem = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
    <div className={`border-b border-gray-100 last:border-0 py-3 ${highlight ? 'bg-blue-50/50 -mx-6 px-6' : ''}`}>
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</h4>
      <p className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
        {value || <span className="text-gray-400 italic">Não informado</span>}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500">
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          
          <div className={`${isSent ? 'bg-green-600' : 'bg-green-50 border-b border-green-100'} p-6 transition-colors duration-500 flex items-center gap-3`}>
            {isSent ? (
               <CheckCircle className="text-white w-8 h-8 animate-in zoom-in spin-in-12" />
            ) : (
               <CheckCircle className="text-green-600 w-8 h-8" />
            )}
            <div>
              <h2 className={`text-xl font-bold ${isSent ? 'text-white' : 'text-gray-800'}`}>
                {isSent ? 'Enviado com Sucesso!' : 'Coleta Finalizada'}
              </h2>
              <p className={`text-sm ${isSent ? 'text-green-100' : 'text-gray-600'}`}>
                {isSent ? 'Os dados foram salvos na planilha da ASCOM.' : 'Confira os dados antes de enviar.'}
              </p>
            </div>
          </div>

          <div className="p-6 relative">
            {isSent && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
                   <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 text-center max-w-sm mx-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Pauta Registrada</h3>
                        <p className="text-gray-600 text-sm mb-6">A equipe da ASCOM recebeu os dados. Você pode iniciar uma nova coleta ou fechar o app.</p>
                        <Button onClick={onReset} variant="outline" className="w-full">
                            Nova Coleta
                        </Button>
                   </div>
                </div>
            )}
          
            {/* Contact Section */}
            <div className="mb-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                    <User className="w-4 h-4 text-tre-blue" />
                    <h3 className="text-sm font-bold text-tre-blue uppercase">Dados do Responsável</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <span className="text-xs text-gray-500 block">Nome</span>
                        <span className="text-sm font-medium text-gray-800">{data.servidor_nome}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Cargo</span>
                        <span className="text-sm font-medium text-gray-800">{data.servidor_cargo}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Telefone</span>
                        <span className="text-sm font-medium text-gray-800">{data.servidor_telefone}</span>
                    </div>
                </div>
            </div>

            {/* Quotes Section */}
            <div className="mb-6 bg-yellow-50 rounded-lg border border-yellow-100 p-4">
                <div className="flex items-center gap-2 mb-3 border-b border-yellow-200 pb-2">
                    <MessageSquareQuote className="w-4 h-4 text-tre-gold" />
                    <h3 className="text-sm font-bold text-yellow-700 uppercase">Sugestão de Fonte/Aspas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs text-gray-500 block">Haverá aspas?</span>
                        <span className="text-sm font-medium text-gray-800">{data.aspas_sim_nao}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Quem fala (Nome/Cargo)</span>
                        <span className="text-sm font-medium text-gray-800">{data.aspas_quem_fala || "-"}</span>
                    </div>
                </div>
            </div>

            {/* Event Data */}
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Dados do Evento/Ação</h3>
            <DataItem label="1. O que? (Fato/Ação)" value={data.o_que} />
            <DataItem label="2. Quem? (Envolvidos)" value={data.quem} />
            <DataItem label="3. Como? (Formato/Detalhes)" value={data.como} />
            <DataItem label="4. Quando? (Data/Hora)" value={data.quando} />
            <DataItem label="5. Por que? (Motivo)" value={data.por_que} />
            <DataItem label="6. Para quem? (Público-Alvo)" value={data.para_quem} />
            <DataItem label="7. Objetivos Esperados" value={data.objetivos_esperados} />
            <DataItem label="8. Riscos (Se não executar)" value={data.riscos_nao_execucao} />
            <DataItem label="Observações Adicionais" value={data.observacoes_adicionais || ""} />
          </div>

          {!isSent && (
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
                 <Button variant="outline" onClick={onReset} disabled={isSending} className="w-full sm:w-auto">
                    <RotateCcw size={16} /> Refazer
                 </Button>
                 
                 <Button 
                    onClick={handleSendToASCOM} 
                    isLoading={isSending}
                    className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white shadow-md hover:shadow-lg transition-all"
                 >
                    {!isSending && <FileSpreadsheet size={18} />}
                    Enviar Resumo para ASCOM
                 </Button>
              </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>As informações são confidenciais e de uso interno do TRE-MT.</p>
        </div>

      </div>
    </div>
  );
};