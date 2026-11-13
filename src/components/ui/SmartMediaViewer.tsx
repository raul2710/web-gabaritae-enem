'use client';

import React from 'react';
import { ExternalLink, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

interface SmartMediaViewerProps {
  url?: string | null;
  altText?: string | null;
  caption?: string | null;
  className?: string;
}

/**
 * Visualizador Inteligente de Mídia Didática:
 * - Se for imagem direta (.png, .jpg, .svg, .webp, data:image): renderiza tag <img> com figura.
 * - Se for PDF do Inep (.pdf): exibe selo clicável e card analítico do Alt-Text.
 */
export function SmartMediaViewer({
  url,
  altText,
  caption,
  className = '',
}: SmartMediaViewerProps) {
  if (!url) return null;

  const isPdf = /\.pdf($|\?)/i.test(url);
  const isDirectImage =
    /^data:image\//i.test(url) ||
    /\.(svg|png|jpe?g|webp|gif)($|\?)/i.test(url) ||
    (!isPdf && !url.includes('.gov.br/educacao_basica/enem/provas/'));

  if (isPdf || !isDirectImage) {
    return (
      <div className={`smart-media-pdf-card ${className}`}>
        <div className="smart-media-pdf-header">
          <div className="smart-media-pdf-tag">
            <FileText size={16} aria-hidden="true" />
            <span>Documento Oficial Inep</span>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="smart-media-pdf-action"
            title="Abre o PDF oficial da prova do Inep em nova aba"
          >
            Abrir Prova Oficial do Inep (PDF)
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>

        {altText ? (
          <div className="smart-media-alt-box">
            <div className="smart-media-alt-title">
              <Sparkles size={14} aria-hidden="true" />
              <span>Alt-Text Analítico Curado</span>
            </div>
            <p className="smart-media-alt-description">{altText}</p>
          </div>
        ) : null}

        {caption ? <p className="smart-media-caption">{caption}</p> : null}
      </div>
    );
  }

  return (
    <figure className={`smart-media-figure ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={altText || caption || 'Ilustração do item ou módulo didático'}
        loading="lazy"
        className="smart-media-img"
      />
      {caption || altText ? (
        <figcaption className="smart-media-caption">
          {caption || altText}
        </figcaption>
      ) : null}
    </figure>
  );
}
