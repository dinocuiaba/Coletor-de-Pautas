import { BriefingData } from "../types";

export const downloadCSV = (data: BriefingData) => {
  // Define headers and map data
  const rows = [
    ["Campo", "Conteúdo"],
    ["-- DADOS DE CONTATO --", ""],
    ["Nome do Servidor", data.servidor_nome],
    ["Cargo", data.servidor_cargo],
    ["Telefone", data.servidor_telefone],
    ["-- ASPAS / FONTE --", ""],
    ["Terá Aspas?", data.aspas_sim_nao],
    ["Quem fala (Nome/Cargo)", data.aspas_quem_fala || "-"],
    ["-- DADOS DA PAUTA --", ""],
    ["1. O que? (Fato/Ação)", data.o_que],
    ["2. Quem? (Responsáveis)", data.quem],
    ["3. Como? (Formato/Detalhes)", data.como],
    ["4. Quando? (Data/Hora)", data.quando],
    ["5. Por que? (Motivo)", data.por_que],
    ["6. Para quem? (Público-Alvo)", data.para_quem],
    ["7. Objetivos Esperados", data.objetivos_esperados],
    ["8. Riscos (Se não executar)", data.riscos_nao_execucao],
    ["Observações Adicionais", data.observacoes_adicionais || ""]
  ];

  // Convert to CSV format with proper escaping for Excel
  const csvContent = rows.map(e => {
    return e.map(cell => {
      // Escape quotes and wrap in quotes to handle commas and newlines
      const stringCell = String(cell || "");
      return `"${stringCell.replace(/"/g, '""')}"`;
    }).join(","); // Comma separator
  }).join("\n");

  // Add BOM (Byte Order Mark) so Excel opens UTF-8 correctly
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  link.setAttribute("href", url);
  link.setAttribute("download", `pauta_ascom_tremt_${timestamp}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};