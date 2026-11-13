'use client';

import React, { useState } from 'react';
import { Download, FileDown, Loader2, Sparkles } from 'lucide-react';

import type { ModuloDidatico } from '@/domain/types';
import { getExportNotebookLmUrl, getModuloMarkdownDownloadUrl } from '@/lib/api';

interface NotebookLMButtonProps {
  modulo?: ModuloDidatico;
  area?: string;
  variant?: 'single' | 'area';
  className?: string;
}

export function NotebookLMButton({
  modulo,
  area,
  variant = 'single',
  className = '',
}: NotebookLMButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      if (variant === 'single' && modulo) {
        // Tenta baixar via endpoint oficial da API
        const targetUrl = getModuloMarkdownDownloadUrl(modulo.id);
        const res = await fetch(targetUrl).catch(() => null);

        if (res && res.ok) {
          const blob = await res.blob();
          triggerDownload(blob, `${modulo.id}-notebooklm.md`);
        } else {
          // Fallback offline: gera o Markdown NotebookLM a partir dos dados do módulo
          const mdContent = generateNotebookLmMarkdown(modulo);
          const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
          triggerDownload(blob, `${modulo.id}-notebooklm.md`);
        }
      } else if (variant === 'area' && area) {
        const targetUrl = getExportNotebookLmUrl(area);
        window.open(targetUrl, '_blank');
      }
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn--secondary ${className}`}
      onClick={handleDownload}
      disabled={downloading}
      title="Baixar compêndio em Markdown otimizado para fontes do Google NotebookLM"
    >
      {downloading ? (
        <Loader2 size={16} className="spinner" aria-hidden="true" />
      ) : variant === 'area' ? (
        <FileDown size={16} aria-hidden="true" />
      ) : (
        <Download size={16} aria-hidden="true" />
      )}
      <span>
        {variant === 'area'
          ? `Exportar Caderno .MD (${area}) para NotebookLM`
          : 'Baixar .MD para Google NotebookLM'}
      </span>
    </button>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateNotebookLmMarkdown(modulo: ModuloDidatico): string {
  return `# GABARITAÊ ENEM · MÓDULO DIDÁTICO CURADO
# ${modulo.tituloTematico}

**ID:** ${modulo.id}  
**Área do Conhecimento:** ${modulo.area}  
**Disciplina:** ${modulo.disciplina}  
**Matriz Inep:** ${modulo.competencia} · ${modulo.habilidade}  
**Recorrência Estatística:** ${modulo.recorrencia}  

---

## 1. FUNDAMENTAÇÃO TEÓRICA E MODELAGEM CIENTÍFICA
${modulo.fundamentacaoTeorica}

---

## 2. RADAR ANTI-PEGADINHAS DO ENEM
### Como Costuma Cair na Prova
${modulo.comoCostumaCair}

### Distratores Comuns e Armadilhas
${modulo.distratoresComuns}

---

## 3. ESQUEMA CONCEITUAL DIDÁTICO
- **Objetivo Pedagógico:** ${modulo.esquemaConceitual.objetivoPedagogico}
- **Elemento Central:** ${modulo.esquemaConceitual.roteiroEstrutural.elementoCentral}
- **Fluxos e Relações:** ${modulo.esquemaConceitual.roteiroEstrutural.fluxosERelacoes}
- **Legenda Explicativa:** ${modulo.esquemaConceitual.roteiroEstrutural.legendaExplicativa}

---

## 4. ITEM DE FIXAÇÃO HOMOLOGADO
**Referência:** ${modulo.itemFixacao.referencia}  
**Enunciado:**  
${modulo.itemFixacao.enunciado}

**Alternativas:**
${modulo.itemFixacao.alternativas.map((alt, i) => `${String.fromCharCode(65 + i)}) ${alt}`).join('\n')}

**Gabarito Oficial:** ${modulo.itemFixacao.gabaritoOficial}  
**Resolução Comentada:**  
${modulo.itemFixacao.resolucaoComentada}

---

## 5. FONTES CANÔNICAS (WHITELIST INEP)
${modulo.fontesCanonicas.map((url) => `- ${url}`).join('\n')}
`;
}
