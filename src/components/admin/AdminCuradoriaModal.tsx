'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  FileCode,
  FileText,
  Loader2,
  Send,
  ShieldAlert,
  UploadCloud,
  X,
} from 'lucide-react';

import type { ImportResult } from '@/domain/types';
import { importModuloJson, importModuloMarkdown } from '@/lib/api';

interface AdminCuradoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AdminCuradoriaModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminCuradoriaModalProps) {
  const [activeTab, setActiveTab] = useState<'markdown' | 'json'>('markdown');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      let res: ImportResult;
      if (activeTab === 'markdown') {
        res = await importModuloMarkdown(content);
      } else {
        try {
          const parsed = JSON.parse(content);
          res = await importModuloJson(parsed);
        } catch {
          res = {
            success: false,
            message: 'O conteúdo informado não é um JSON válido. Verifique a sintaxe.',
          };
        }
      }

      setResult(res);
      if (res.success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadExampleTemplate = () => {
    if (activeTab === 'markdown') {
      setContent(
        `# GABARITAÊ ENEM · MÓDULO DIDÁTICO
# MOD-MAT-EXEMPLO: Geometria Espacial e Volume de Prismas

**Área:** Matemática
**Disciplina:** Matemática
**Competência:** Competência de Área 2
**Habilidade:** Habilidade 7 - Identificar características de figuras geométricas tridimensionais.
**Recorrência:** Alta
**Fontes:**
- https://download.inep.gov.br/educacao_basica/enem/provas/2023/CAD_ENEM_2023_DIA_2_AZUL.pdf

## Fundamentação Teórica
O volume de um prisma reto de base qualquer é dado por:
$$V = A_b \\cdot h$$

## Como Costuma Cair
Cobrado em embalagens e reservatórios.

## Distratores Comuns
Confundir área total da superfície com o volume interno.

## Item de Fixação
ENEM 2023 - Caderno Azul - Questão 136
Gabarito: A
Resolução: Aplicando a fórmula do prisma regular.`,
      );
    } else {
      setContent(
        JSON.stringify(
          {
            id: 'MOD-NAT-EXEMPLO',
            tituloTematico: 'Termologia e Calorimetria',
            area: 'Ciências da Natureza',
            disciplina: 'Física',
            competencia: 'Competência de Área 5',
            habilidade: 'Habilidade 17',
            recorrencia: 'Alta',
            fontesCanonicas: [
              'https://download.inep.gov.br/educacao_basica/enem/provas/2023/CAD_ENEM_2023_DIA_2_AZUL.pdf',
            ],
            fundamentacaoTeorica: 'A equação fundamental da calorimetria é $Q = m \\cdot c \\cdot \\Delta T$.',
            elementoVisualOriginal: {
              urlImagem: 'https://download.inep.gov.br/educacao_basica/enem/provas/2023/CAD_ENEM_2023_DIA_2_AZUL.pdf',
              altTextAnalitico: 'Curva de aquecimento da água com patamares de fusão e ebulição.',
            },
            esquemaConceitual: {
              objetivoPedagogico: 'Calcular trocas de calor sem mudança de fase.',
              promptIngles: 'Heating curve of water diagram with clear latent heat plateaus.',
              promptPortugues: 'Diagrama de curva de aquecimento com patamares de calor latente.',
              roteiroEstrutural: {
                elementoCentral: 'Q = m * c * DeltaT',
                fluxosERelacoes: 'Calor sensível altera temperatura; Calor latente altera estado físico',
                legendaExplicativa: 'Durante a mudança de estado, a temperatura permanece constante.',
              },
            },
            comoCostumaCair: 'Mistura de líquidos em calorímetro ideal.',
            distratoresComuns: 'Esquecer a mudança de fase.',
            itemFixacao: {
              referencia: 'ENEM 2023 - Questão 95',
              ano: 2023,
              aplicacao: 'Regular',
              corCaderno: 'Azul',
              numeroQuestao: 95,
              enunciado: 'Um bloco de ferro de 200g...',
              alternativas: ['10 cal', '20 cal', '30 cal', '40 cal', '50 cal'],
              gabaritoOficial: 'A',
              resolucaoComentada: 'Basta aplicar $Q = m \\cdot c \\cdot \\Delta T$.',
            },
            apostilaId: null,
            questionId: null,
          },
          null,
          2,
        ),
      );
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="curadoria-title">
      <div className="modal-content admin-curadoria-modal">
        <header className="modal-header">
          <div className="modal-header-info">
            <span className="badge badge--primary">
              <UploadCloud size={14} aria-hidden="true" />
              Painel de Curadoria Admin
            </span>
            <h2 id="curadoria-title" className="modal-title">
              Importar Módulo Didático (Validador Inep)
            </h2>
            <p className="modal-subtitle">
              Envio com verificação estrita de Whitelist das fontes canônicas e sintaxe KaTeX
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </header>

        {/* Abas */}
        <div className="admin-tabs" role="tablist">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'markdown' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('markdown')}
            role="tab"
            aria-selected={activeTab === 'markdown'}
          >
            <FileText size={16} />
            <span>Importar Markdown (.md)</span>
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'json' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('json')}
            role="tab"
            aria-selected={activeTab === 'json'}
          >
            <FileCode size={16} />
            <span>Importar JSON (.json)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-curadoria-form">
          <div className="admin-editor-header">
            <label htmlFor="editor-input" className="admin-editor-label">
              Cole o conteúdo {activeTab === 'markdown' ? 'Markdown (.md)' : 'JSON (.json)'}:
            </label>
            <button
              type="button"
              className="btn btn--ghost btn-sm"
              onClick={loadExampleTemplate}
            >
              Carregar Template de Exemplo
            </button>
          </div>

          <textarea
            id="editor-input"
            className="admin-textarea"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              activeTab === 'markdown'
                ? '# Cole aqui o texto formatado em Markdown do Módulo Didático...'
                : '{\n  "id": "MOD-...",\n  "tituloTematico": "..."\n}'
            }
            required
          />

          {/* Resultado / Erros da Whitelist */}
          {result ? (
            <div
              className={`admin-result-banner ${
                result.success ? 'admin-result--success' : 'admin-result--error'
              }`}
              role="alert"
            >
              <div className="admin-result-header">
                {result.success ? (
                  <CheckCircle2 size={18} className="text-positive" />
                ) : (
                  <AlertOctagon size={18} className="text-negative" />
                )}
                <strong>{result.message}</strong>
              </div>

              {/* Erros específicos da Whitelist Estrita */}
              {result.rejectedUrls && result.rejectedUrls.length > 0 ? (
                <div className="admin-whitelist-errors">
                  <div className="whitelist-warning-title">
                    <ShieldAlert size={14} />
                    <span>URLs Rejeitadas pela Whitelist Estrita do Inep:</span>
                  </div>
                  <ul className="whitelist-error-list">
                    {result.rejectedUrls.map((url, idx) => (
                      <li key={idx}>
                        <code>{url}</code> — Somente domínios homologados (.gov.br/inep e parceiros oficiais) são permitidos.
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Validando na API...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Enviar para API REST Gabaritaê</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
