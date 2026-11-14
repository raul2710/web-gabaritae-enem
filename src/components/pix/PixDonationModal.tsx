'use client';

import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Heart,
  Loader2,
  QrCode,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import QRCode from 'qrcode';

import type { PixInfo } from '@/domain/types';
import { fetchPix } from '@/lib/api';

interface PixDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PixDonationModal({
  isOpen,
  onClose,
}: PixDonationModalProps) {
  const [pixData, setPixData] = useState<PixInfo | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCopiaECola, setCopiedCopiaECola] = useState(false);
  const loading = isOpen && pixData === null;

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    fetchPix('APOIOENEM')
      .then(async (data) => {
        if (!isMounted) return;

        // Gera o QR Code visual a partir do código Pix Copia e Cola
        if (data.pixCopiaECola) {
          try {
            const url = await QRCode.toDataURL(data.pixCopiaECola, {
              width: 256,
              margin: 1,
              color: {
                dark: '#164b96',
                light: '#ffffff',
              },
            });
            if (isMounted) setQrCodeDataUrl(url);
          } catch (err) {
            console.error('Erro ao gerar QRCode:', err);
          }
        }

        if (isMounted) setPixData(data);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyKey = async () => {
    if (!pixData?.pixKey) return;
    try {
      await navigator.clipboard.writeText(pixData.pixKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyCopiaECola = async () => {
    if (!pixData?.pixCopiaECola) return;
    try {
      await navigator.clipboard.writeText(pixData.pixCopiaECola);
      setCopiedCopiaECola(true);
      setTimeout(() => setCopiedCopiaECola(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="pix-modal-title">
      <div className="modal-content pix-modal">
        <header className="modal-header">
          <div className="modal-header-info">
            <span className="badge badge--primary">
              <Heart size={14} className="text-negative fill-current" aria-hidden="true" />
              Apoio via Pix
            </span>
            <h2 id="pix-modal-title" className="modal-title">
              Pix de Raul Danielli
            </h2>
            <p className="modal-subtitle">
              O valor cai direto na conta de Raul Danielli.
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

        {loading ? (
          <div className="pix-loading">
            <Loader2 size={32} className="spinner" />
            <p>Gerando o QR Code Pix...</p>
          </div>
        ) : pixData ? (
          <div className="pix-body">
            {/* Bloco do QR Code e Identificação */}
            <div className="pix-qr-container">
              {qrCodeDataUrl ? (
                <div className="pix-qr-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code Pix de Raul Danielli"
                    className="pix-qr-img"
                  />
                  <div className="pix-qr-stamp">
                    <ShieldCheck size={14} />
                    <span>Pix</span>
                  </div>
                </div>
              ) : null}

              {/* Dados do recebedor */}
              <div className="pix-meta-card">
                <div className="pix-meta-row">
                  <span className="pix-meta-label">Recebedor:</span>
                  <strong className="pix-meta-val">{pixData.merchantName}</strong>
                </div>
                <div className="pix-meta-row">
                  <span className="pix-meta-label">Valor:</span>
                  <strong className="pix-meta-val text-primary">
                    Livre (você escolhe no banco)
                  </strong>
                </div>
              </div>
            </div>

            {/* Chave Pix Direta */}
            <div className="pix-key-section">
              <label className="pix-section-label">
                Chave Pix:
              </label>
              <div className="pix-copy-input-group">
                <input
                  type="text"
                  readOnly
                  value={pixData.pixKey}
                  className="pix-input"
                  aria-label="Chave Pix"
                />
                <button
                  type="button"
                  className="btn btn--secondary btn-sm"
                  onClick={handleCopyKey}
                >
                  {copiedKey ? (
                    <>
                      <Check size={14} className="text-positive" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar Chave</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Código Pix Copia e Cola */}
            <div className="pix-code-section">
              <label className="pix-section-label">
                Código Pix Copia e Cola:
              </label>
              <textarea
                readOnly
                rows={4}
                value={pixData.pixCopiaECola}
                className="pix-textarea"
                aria-label="Código Pix Copia e Cola"
              />

              <button
                type="button"
                className="btn btn--primary btn-block copy-pix-btn"
                onClick={handleCopyCopiaECola}
              >
                {copiedCopiaECola ? (
                  <>
                    <Check size={18} />
                    <span>Código Pix Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <QrCode size={18} />
                    <span>Copiar Pix Copia e Cola</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-muted">Não foi possível carregar os dados do Pix no momento.</p>
        )}

        <div className="modal-footer">
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
