import { writeAsStringAsync, documentDirectory, readAsStringAsync } from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Platform } from "react-native";

const COLORS = {
  primary_700: '#095513',
  primary_600: '#0b5e15',
  primary_300: '#26d423',
  primary_200: '#14a61b',
  primary_050: '#D1F3DB',
  error_500: '#DC2626',
  white: '#FFFFFF',
  black: '#000000',
  n_900: '#101B18',
  n_150: '#E2E8E5',
  n_100: '#EEF3F1',
  n_050: '#F7FAF9',
  n_400: '#6A7B74',
  n_200: '#C9D6D1',
};

export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  data: string | number | any;
  categoria?: string;
}

export interface Receita {
  id: string;
  descricao: string;
  valor: number;
  data: string | number | any;
  categoria?: string;
  origem?: string;
}

export async function generateCompleteReport(
  despesas: Despesa[],
  receitas: Receita[],
  dataInicio: string,
  dataFim: string,
  userName: string
): Promise<void> {
  try {
    const htmlContent = generateHTMLReport(despesas, receitas, dataInicio, dataFim, userName);

    if (Platform.OS === 'web') {
      // Web: download direto como HTML
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-financeiro-${Date.now()}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      } else {
      // Mobile: gerar PDF em base64 e compartilhar
      try {
        // Gerar nome com data formatada
        const agora = new Date();
        const dia = String(agora.getDate()).padStart(2, '0');
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const ano = agora.getFullYear();
        const fileName = `relatorio-financeiro-${dia}-${mes}-${ano}.pdf`;
        const filePath = `${documentDirectory}${fileName}`;

        // Gerar PDF em base64
        const pdf = await Print.printToFileAsync({
          html: htmlContent,
          base64: true,
        });

        if (pdf?.uri) {
          // Ler o PDF gerado e salvar com nome customizado
          const base64Data = await readAsStringAsync(pdf.uri, {
            encoding: 'base64',
          });

          await writeAsStringAsync(filePath, base64Data, {
            encoding: 'base64',
          });

          // Compartilhar o PDF com nome correto
          await Sharing.shareAsync(filePath, {
            mimeType: 'application/pdf',
            dialogTitle: 'Compartilhar Relatório',
          });
        } else {
          throw new Error('Falha ao gerar PDF');
        }
      } catch (pdfError) {
        console.error("Erro ao gerar PDF:", pdfError);
        // Fallback para HTML se PDF falhar
        const fileName = `relatorio-completo-${Date.now()}.html`;
        const filePath = `${documentDirectory}${fileName}`;
        await writeAsStringAsync(filePath, htmlContent);
        await Sharing.shareAsync(filePath, {
          mimeType: "text/html",
          dialogTitle: "Compartilhar Relatório",
        });
      }
    }
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    throw error;
  }
}

// Para manter compatibilidade com chamadas antigas
export const generateExpensesReport = generateCompleteReport;

function generateHTMLReport(
  despesas: Despesa[],
  receitas: Receita[],
  dataInicio: string,
  dataFim: string,
  userName: string
): string {
  const totalDespesas = despesas.reduce((sum, d) => sum + (d.valor || 0), 0);
  const totalReceitas = receitas.reduce((sum, r) => sum + (r.valor || 0), 0);
  const saldo = totalReceitas - totalDespesas;
  
  const categoriasD = agruparPorCategoria(despesas);
  const origemR = agruparPorOrigem(receitas);

  const linhasDespesas = despesas
    .map((d) => `
      <tr>
        <td>${formatarData(d.data)}</td>
        <td>${d.descricao}</td>
        <td><span class="category-badge">${d.categoria || "Sem categoria"}</span></td>
        <td style="text-align: right;">R$ ${d.valor.toFixed(2)}</td>
      </tr>
    `)
    .join("");

  const linhasReceitas = receitas
    .map((r) => `
      <tr>
        <td>${formatarData(r.data)}</td>
        <td>${r.descricao}</td>
        <td><span class="category-badge success">${r.origem || "Sem origem"}</span></td>
        <td style="text-align: right; color: ${COLORS.primary_600}; font-weight: 600;">R$ ${r.valor.toFixed(2)}</td>
      </tr>
    `)
    .join("");

  const linhasCategoriasD = Object.entries(categoriasD)
    .map(([cat, val]) => `
      <tr>
        <td>${cat}</td>
        <td style="text-align: right; font-weight: 700;">R$ ${val.toFixed(2)}</td>
      </tr>
    `)
    .join("");

  const linhasOrigemR = Object.entries(origemR)
    .map(([origem, val]) => `
      <tr>
        <td>${origem}</td>
        <td style="text-align: right; font-weight: 700; color: ${COLORS.primary_600};">R$ ${val.toFixed(2)}</td>
      </tr>
    `)
    .join("");

  const graficoCategoriasD = gerarGraficoCategoriasD(categoriasD);
  const graficoOrigemR = gerarGraficoOrigemR(origemR);

  const agora = new Date();
  const dataAtual = agora.toLocaleDateString('pt-BR');
  const horaAtual = agora.toLocaleTimeString('pt-BR');

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório Financeiro - Conta Certa</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 portrait; margin: 10mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: ${COLORS.white};
          padding: 0;
          color: ${COLORS.n_900};
          width: 210mm;
          height: 297mm;
        }
        .container { max-width: 100%; margin: 0; background: ${COLORS.white}; overflow: hidden; }
        .header { background: linear-gradient(135deg, ${COLORS.primary_700} 0%, ${COLORS.primary_600} 100%); padding: 40px 30px; text-align: center; color: ${COLORS.white}; page-break-after: avoid; }
        .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 5px; }
        .header p { font-size: 13px; opacity: 0.9; margin-bottom: 5px; }
        .header-info { font-size: 11px; opacity: 0.85; }
        .content { padding: 30px; }
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 5px; page-break-after: avoid; }
        .summary-card { padding: 20px; border-radius: 12px; text-align: center; page-break-after: avoid; }
        .summary-card.receita { background: linear-gradient(135deg, ${COLORS.primary_300}20 0%, ${COLORS.primary_200}20 100%); border: 2px solid ${COLORS.primary_300}; }
        .summary-card.despesa { background: linear-gradient(135deg, ${COLORS.error_500}20 0%, ${COLORS.error_500}30 100%); border: 2px solid ${COLORS.error_500}; }
        .summary-card.saldo { background: linear-gradient(135deg, rgba(100, 150, 100, 0.1) 0%, rgba(70, 120, 70, 0.1) 100%); border: 2px solid ${COLORS.primary_600}; }
        .summary-card label { display: block; font-size: 11px; color: ${COLORS.n_400}; margin-bottom: 8px; font-weight: 600; }
        .summary-card .value { font-size: 22px; font-weight: 700; }
        .summary-card.receita .value { color: ${COLORS.primary_600}; }
        .summary-card.despesa .value { color: ${COLORS.error_500}; }
        .summary-card.saldo .value { color: ${saldo >= 0 ? COLORS.primary_600 : COLORS.error_500}; }
        .section { margin-bottom: 15px; page-break-inside: avoid; }
        .section-title { background: linear-gradient(135deg, ${COLORS.primary_700} 0%, ${COLORS.primary_600} 100%); color: ${COLORS.white}; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .graphics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 15px; page-break-inside: avoid; }
        .graphic-container { text-align: center; page-break-inside: avoid; }
        .graphic-container h3 { font-size: 13px; margin-bottom: 12px; color: ${COLORS.n_900}; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px; }
        th { background: ${COLORS.n_050}; color: ${COLORS.n_900}; padding: 10px; text-align: left; font-weight: 700; border-bottom: 2px solid ${COLORS.primary_300}; }
        td { padding: 9px 10px; border-bottom: 1px solid ${COLORS.n_150}; color: ${COLORS.n_900}; }
        .total-row { background: ${COLORS.n_050}; font-weight: 700; border-top: 2px solid ${COLORS.primary_300}; }
        .category-badge { display: inline-block; background: ${COLORS.primary_050}; color: ${COLORS.primary_700}; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; border: 1px solid ${COLORS.primary_300}; }
        .category-badge.success { background: ${COLORS.primary_050}; color: ${COLORS.primary_600}; border-color: ${COLORS.primary_300}; }
        .footer { margin-top: 15px; padding-top: 15px; border-top: 1px solid ${COLORS.n_200}; text-align: center; color: ${COLORS.n_400}; font-size: 10px; page-break-before: avoid; }
        .footer p { margin: 4px 0; }
        svg { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌱 Relatório Financeiro</h1>
          <p>Conta Certa — Seu Assistente Financeiro</p>
          <div class="header-info">
            <div>👤 ${userName} | 📅 ${dataInicio} a ${dataFim}</div>
            <div style="margin-top: 6px;">🕐 ${dataAtual} às ${horaAtual}</div>
          </div>
        </div>

        <div class="content">
          <div class="summary-grid">
            <div class="summary-card receita">
              <label>💰 Receitas</label>
              <div class="value">R$ ${totalReceitas.toFixed(2)}</div>
            </div>
            <div class="summary-card despesa">
              <label>💸 Despesas</label>
              <div class="value">R$ ${totalDespesas.toFixed(2)}</div>
            </div>
            <div class="summary-card saldo">
              <label>📊 Saldo</label>
              <div class="value">${saldo >= 0 ? '+' : ''}R$ ${saldo.toFixed(2)}</div>
            </div>
          </div>

          ${receitas.length > 0 ? `
            <div class="section">
              <div class="section-title">📈 Receitas</div>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th style="text-align: center; width: 100px;">Tipo</th>
                    <th style="text-align: right; width: 120px;">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  ${linhasReceitas}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right;">TOTAL RECEITAS:</td>
                    <td style="text-align: right; color: ${COLORS.primary_600};">R$ ${totalReceitas.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}

          ${despesas.length > 0 ? `
            <div class="section">
              <div class="section-title">💸 Despesas</div>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th style="text-align: center; width: 100px;">Categoria</th>
                    <th style="text-align: right; width: 120px;">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  ${linhasDespesas}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right;">TOTAL DESPESAS:</td>
                    <td style="text-align: right;">R$ ${totalDespesas.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}

          <div class="graphics-grid">
            ${Object.keys(origemR).length > 0 ? `
              <div class="graphic-container">
                <h3>Receitas por Tipo</h3>
                ${graficoOrigemR}
              </div>
            ` : ''}
            ${Object.keys(categoriasD).length > 0 ? `
              <div class="graphic-container">
                <h3>Despesas por Categoria</h3>
                ${graficoCategoriasD}
              </div>
            ` : ''}
          </div>

          ${Object.keys(origemR).length > 0 ? `
            <div class="section">
              <div class="section-title">📊 Resumo de Receitas por Tipo</div>
              <table>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th style="text-align: right;">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  ${linhasOrigemR}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${Object.keys(categoriasD).length > 0 ? `
            <div class="section">
              <div class="section-title">📊 Resumo de Despesas por Categoria</div>
              <table>
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th style="text-align: right;">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  ${linhasCategoriasD}
                </tbody>
              </table>
            </div>
          ` : ''}

          <div class="footer">
            <p>Este documento foi gerado automaticamente pelo Conta Certa.</p>
            <p>© 2025 Conta Certa — Seu Assistente Financeiro</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function gerarGraficoCategoriasD(categorias: Record<string, number>): string {
  const total = Object.values(categorias).reduce((a, b) => a + b, 0);
  const cores = ['#26d423', '#14a61b', '#095513', '#0b5e15', '#D1F3DB'];
  const items = Object.entries(categorias);
  const uniqueId = Math.random().toString(36).substr(2, 9);
  
  let svg = `<svg width="200" height="200" viewBox="0 0 200 200" style="margin: 0 auto; display: block;" id="pie-${uniqueId}">`;
  let currentAngle = -90;
  
  items.forEach(([ , valor], index) => {
    const percentage = valor / total;
    const angle = percentage * 360;
    const cor = cores[index % cores.length];
    
    const x1 = 100 + 65 * Math.cos((currentAngle * Math.PI) / 180);
    const y1 = 100 + 65 * Math.sin((currentAngle * Math.PI) / 180);
    const x2 = 100 + 65 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
    const y2 = 100 + 65 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
    
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M 100 100 L ${x1} ${y1} A 65 65 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    svg += `<path id="segment-${uniqueId}-${index}" d="${path}" fill="${cor}" stroke="${COLORS.white}" stroke-width="2"/>`;
    currentAngle += angle;
  });
  
  svg += `<circle id="center-${uniqueId}" cx="100" cy="100" r="40" fill="${COLORS.white}"/>`;
  svg += '</svg>';
  svg += `<div id="legend-${uniqueId}" style="margin-top: 10px; font-size: 11px;">`;
  items.forEach(([cat, valor], index) => {
    const cor = cores[index % cores.length];
    const itemId = `legend-item-${uniqueId}-${index}-${Math.random().toString(36).substr(2, 5)}`;
    svg += `<div id="${itemId}" style="margin: 4px 0;"><span style="display: inline-block; width: 10px; height: 10px; background: ${cor}; border-radius: 2px; margin-right: 6px;"></span><span style="font-size: 10px;">${cat}: R$ ${valor.toFixed(2)}</span></div>`;
  });
  svg += '</div>';
  
  return svg;
}

function gerarGraficoCategoriasR(categorias: Record<string, number>): string {
  return gerarGraficoCategoriasD(categorias);
}

function gerarGraficoOrigemR(origem: Record<string, number>): string {
  return gerarGraficoCategoriasD(origem);
}

function agruparPorCategoria(items: { categoria?: string; valor: number }[]): Record<string, number> {
  return items.reduce(
    (acc, item) => {
      const cat = item.categoria || "Sem categoria";
      acc[cat] = (acc[cat] || 0) + item.valor;
      return acc;
    },
    {} as Record<string, number>
  );
}

function agruparPorOrigem(items: { origem?: string; valor: number }[]): Record<string, number> {
  return items.reduce(
    (acc, item) => {
      const origem = item.origem || "Sem origem";
      acc[origem] = (acc[origem] || 0) + item.valor;
      return acc;
    },
    {} as Record<string, number>
  );
}

function formatarData(dataStr: string): string {
  if (!dataStr) return "Data inválida";
  
  try {
    let date: Date;
    
    if (typeof dataStr === 'object' && dataStr !== null) {
      if ('_seconds' in dataStr) {
        date = new Date(dataStr._seconds * 1000);
      } else if ('toDate' in dataStr) {
        date = dataStr.toDate();
      } else {
        date = new Date(JSON.stringify(dataStr));
      }
    } else if (typeof dataStr === 'string' && (dataStr.includes('T') || (dataStr.length === 10 && dataStr.includes('-')))) {
      date = new Date(dataStr);
    } else if (typeof dataStr === 'string' && /^\d+$/.test(dataStr)) {
      const num = parseInt(dataStr);
      date = new Date(num > 1000000000000 ? num : num * 1000);
    } else if (typeof dataStr === 'string') {
      date = new Date(dataStr);
    } else {
      return "Formato inválido";
    }
    
    if (isNaN(date.getTime())) return "Data inválida";
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Erro ao formatar data:", dataStr, error);
    return "Data inválida";
  }
}
