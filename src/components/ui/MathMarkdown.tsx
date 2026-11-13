'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Converte blocos LaTeX inline ($...$) e display ($$...$$) usando KaTeX,
 * e formata markdown estrutural (títulos, listas, negrito, blockquotes).
 */
export function MathMarkdown({ content, className = '' }: MathMarkdownProps) {
  const html = useMemo(() => {
    if (!content) return '';
    return parseMarkdownWithLatex(content);
  }, [content]);

  return (
    <div
      className={`math-markdown ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Pipeline de parsing seguro:
 * 1. Isola e processa blocos display $$...$$
 * 2. Isola e processa fórmulas inline $...$
 * 3. Processa Markdown básico (títulos, negrito, itálico, listas, tabelas e citações)
 */
function parseMarkdownWithLatex(raw: string): string {
  // Mapas para proteger o HTML gerado pelo KaTeX de modificações de regex subsequentes
  const mathPlaceholders: string[] = [];

  const stash = (html: string) => {
    const placeholder = `@@MATH_PLACEHOLDER_${mathPlaceholders.length}@@`;
    mathPlaceholders.push(html);
    return placeholder;
  };

  // 1. Processa display math $$...$$
  let text = raw.replace(/\$\$([\s\S]+?)\$\$/g, (_, equation) => {
    try {
      const rendered = katex.renderToString(equation.trim(), {
        displayMode: true,
        throwOnError: false,
      });
      return stash(`<div class="math-display">${rendered}</div>`);
    } catch {
      return stash(`<pre class="math-error"><code>$$${escapeHtml(equation)}$$</code></pre>`);
    }
  });

  // 2. Processa inline math $...$
  text = text.replace(/\$([^\$\n\r]+?)\$/g, (_, equation) => {
    try {
      const rendered = katex.renderToString(equation.trim(), {
        displayMode: false,
        throwOnError: false,
      });
      return stash(`<span class="math-inline">${rendered}</span>`);
    } catch {
      return stash(`<code class="math-error">$${escapeHtml(equation)}$</code>`);
    }
  });

  // 3. Processa Markdown básico linha por linha
  const lines = text.split('\n');
  const output: string[] = [];
  let inList = false;
  let inBlockquote = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Citações (> citação)
    if (line.startsWith('> ')) {
      if (!inBlockquote) {
        output.push('<blockquote>');
        inBlockquote = true;
      }
      line = line.replace(/^>\s*/, '');
    } else if (inBlockquote && line.trim() === '') {
      output.push('</blockquote>');
      inBlockquote = false;
    }

    // Títulos (###, ##, #)
    if (/^####\s+(.+)$/.test(line)) {
      output.push(`<h4>${parseInline(line.replace(/^####\s+/, ''))}</h4>`);
      continue;
    }
    if (/^###\s+(.+)$/.test(line)) {
      output.push(`<h3>${parseInline(line.replace(/^###\s+/, ''))}</h3>`);
      continue;
    }
    if (/^##\s+(.+)$/.test(line)) {
      output.push(`<h2>${parseInline(line.replace(/^##\s+/, ''))}</h2>`);
      continue;
    }
    if (/^#\s+(.+)$/.test(line)) {
      output.push(`<h1>${parseInline(line.replace(/^#\s+/, ''))}</h1>`);
      continue;
    }

    // Listas (- item ou * item)
    if (/^[-*]\s+(.+)$/.test(line)) {
      if (!inList) {
        output.push('<ul>');
        inList = true;
      }
      output.push(`<li>${parseInline(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    } else if (inList) {
      output.push('</ul>');
      inList = false;
    }

    // Linha vazia
    if (line.trim() === '') {
      continue;
    }

    // Parágrafo comum
    output.push(`<p>${parseInline(line)}</p>`);
  }

  if (inList) output.push('</ul>');
  if (inBlockquote) output.push('</blockquote>');

  let result = output.join('\n');

  // Restaura os placeholders KaTeX
  mathPlaceholders.forEach((mathHtml, idx) => {
    result = result.replace(`@@MATH_PLACEHOLDER_${idx}@@`, mathHtml);
  });

  return result;
}

function parseInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
