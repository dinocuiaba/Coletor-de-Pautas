export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export interface BriefingData {
  // Contact Info
  servidor_nome: string;
  servidor_cargo: string;
  servidor_telefone: string;
  
  // Quotes Info
  aspas_sim_nao: string; // "Sim" or "Não"
  aspas_quem_fala?: string; // Name and Role of the person quoted
  
  // Event Info (5W2H)
  o_que: string;
  quem: string;
  como: string;
  quando: string;
  por_que: string;
  para_quem: string;
  objetivos_esperados: string;
  riscos_nao_execucao: string;
  observacoes_adicionais?: string;

  // Internal ASCOM use only
  sugestao_materia?: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  CHATTING = 'CHATTING',
  GENERATING_REPORT = 'GENERATING_REPORT',
  REPORT_VIEW = 'REPORT_VIEW',
}