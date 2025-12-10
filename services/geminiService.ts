import { GoogleGenAI, Chat, Type, Schema } from "@google/genai";
import { BriefingData } from "../types";

const SYSTEM_INSTRUCTION = `
Você é um Jornalista Assessor de Imprensa experiente do Tribunal Regional Eleitoral de Mato Grosso (TRE-MT).
Sua função é entrevistar servidores para coletar dados para matérias no site institucional.

FASE 1: IDENTIFICAÇÃO (OBRIGATÓRIO INICIAR POR AQUI)
Antes de perguntar sobre o evento ou ação, você DEVE coletar os dados de quem está passando as informações:
1. Nome completo do servidor.
2. Cargo/Função.
3. Telefone de contato (para dúvidas da redação).

FASE 2: O FATO (BRIEFING - 5W2H)
Após a identificação, passe para a apuração do evento/ação. Faça perguntas de forma fluida para cobrir os seguintes pontos (não precisa ser nessa ordem exata, mas precisa cobrir tudo):
1. O que? (Ação ou evento)
2. Quem? (Responsáveis, organizadores)
3. Como? (Formato, metodologia)
4. Quando? (Datas e horários)
5. Por que? (Motivação)
6. Para quem? (Público-alvo)
7. Objetivos esperados?
8. Riscos da não execução?

FASE 3: ASPAS/CITAÇÃO (FINALIZAÇÃO)
Somente APÓS coletar os dados do evento, pergunte se desejam incluir uma fala (aspas) na matéria.
- Se SIM: Pergunte o Nome e Cargo da autoridade ou pessoa que dará a declaração.
- Se NÃO: Agradeça e encerre a entrevista.

REGRAS DE COMPORTAMENTO:
- Seja cordial e profissional.
- Faça uma pergunta de cada vez para não sobrecarregar o servidor.
- Não aceite respostas muito vagas, peça detalhes gentilmente (ex: "Poderia detalhar melhor como será essa ação?").
- O objetivo é gerar insumos para a redação, não escrever a matéria final.

Exemplo de início: "Olá! Sou o assistente da ASCOM. Para iniciarmos, poderia me informar seu nome completo, cargo e um telefone de contato?"
`;

let chatSession: Chat | null = null;
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const startChatSession = () => {
  const ai = getAI();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }
  const result = await chatSession.sendMessage({ message });
  return result.text || "";
};

export const generateBriefingJSON = async (chatHistory: string): Promise<BriefingData> => {
  const ai = getAI();

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      // Contact
      servidor_nome: { type: Type.STRING, description: "Nome do servidor entrevistado." },
      servidor_cargo: { type: Type.STRING, description: "Cargo do servidor entrevistado." },
      servidor_telefone: { type: Type.STRING, description: "Telefone de contato do servidor." },
      
      // Quotes
      aspas_sim_nao: { type: Type.STRING, description: "Se deseja aspas na matéria (Sim/Não)." },
      aspas_quem_fala: { type: Type.STRING, description: "Nome e cargo de quem dará a declaração (se houver aspas)." },

      // Event
      o_que: { type: Type.STRING, description: "O fato principal, evento ou ação." },
      quem: { type: Type.STRING, description: "Quem está realizando, organizando ou participando." },
      como: { type: Type.STRING, description: "Como será realizado, formato, detalhes logísticos." },
      quando: { type: Type.STRING, description: "Datas, horários e duração." },
      por_que: { type: Type.STRING, description: "A razão ou justificativa da ação." },
      para_quem: { type: Type.STRING, description: "Público-alvo ou beneficiários." },
      objetivos_esperados: { type: Type.STRING, description: "Resultados que se espera alcançar." },
      riscos_nao_execucao: { type: Type.STRING, description: "Consequências negativas caso não ocorra (se houver)." },
      observacoes_adicionais: { type: Type.STRING, description: "Outros detalhes relevantes mencionados." },

      // Internal Draft
      sugestao_materia: { 
        type: Type.STRING, 
        description: "Redija uma matéria jornalística completa e pronta para publicação no site do TRE-MT baseada nos dados. Inclua Título, Linha Fina e o Texto completo. O texto deve ser formal, institucional e informativo. Adicione proativamente informações de serviço úteis (documentos necessários, locais de atendimento, links padrão do TRE) se o contexto pedir." 
      },
    },
    required: ["servidor_nome", "o_que", "quem", "quando", "como", "sugestao_materia"],
  };

  const prompt = `
  Analise a seguinte transcrição de entrevista entre o Assessor ASCOM (AI) e o Servidor (User).
  Extraia as informações estruturadas.
  
  IMPORTANTE: No campo 'sugestao_materia', você deve atuar como o redator final. Escreva a notícia completa baseada no que foi coletado. 
  Se faltarem detalhes técnicos (ex: lista de documentos para alistamento), use seu conhecimento geral sobre a Justiça Eleitoral para adicionar essas informações de serviço de forma útil ao cidadão.
  
  --- TRANSCRICAO ---
  ${chatHistory}
  -------------------
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  return JSON.parse(response.text || "{}") as BriefingData;
};