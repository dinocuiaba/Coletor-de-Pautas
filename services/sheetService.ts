import { BriefingData } from "../types";

// =================================================================================
// CONFIGURAÇÃO:
// URL do Google Apps Script Web App
// =================================================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwOmS_vIMrDoQdu5XHssHXNlb6hdd7OVlKMUW_yvbQS5DEGE-VHOL3z3hyJKLzzLCX4LA/exec";

export const sendToSheet = async (data: BriefingData): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL) {
    alert("ERRO DE CONFIGURAÇÃO: URL do script não definida.");
    return false;
  }

  try {
    // Usamos mode: 'no-cors' para enviar dados para o Google Script sem bloqueio do navegador.
    // O Google retornará uma resposta opaca (status 0), mas o appendRow funcionará.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return true;
  } catch (error) {
    console.error("Erro ao enviar para planilha:", error);
    return false;
  }
};