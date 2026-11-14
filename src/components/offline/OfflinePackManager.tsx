'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import {
  CheckCircle2,
  CloudOff,
  Database,
  DownloadCloud,
  HardDrive,
  Loader2,
  RefreshCw,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react';

import { ENEM_DISCIPLINES } from '@/domain/constants';
import type { DisciplineId } from '@/domain/types';
import { fetchOfflinePack } from '@/lib/api';
import {
  getOfflineMeta,
  hasOfflinePack,
  type OfflineMeta,
  removeOfflinePack,
} from '@/lib/offline-storage';

interface OfflinePackManagerProps {
  className?: string;
  discipline?: DisciplineId;
}

function subscribeToOnlineStatus(callback: () => void): () => void {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function getServerOnlineSnapshot(): boolean {
  return true;
}

export function OfflinePackManager({ className = '', discipline }: OfflinePackManagerProps) {
  const isOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineSnapshot,
    getServerOnlineSnapshot,
  );
  const [loadingDiscipline, setLoadingDiscipline] = useState<string | null>(null);
  const [meta, setMeta] = useState<OfflineMeta>({ lastUpdated: '', disciplinesDownloaded: {} });
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lê o cache local (localStorage) após a montagem; derivar no render causaria mismatch de SSR.
    setMeta(getOfflineMeta());
  }, []);

  const handleDownload = async (disc: DisciplineId) => {
    setLoadingDiscipline(disc);
    setFeedback(null);
    try {
      const pack = await fetchOfflinePack(disc);
      setMeta(getOfflineMeta());
      if (pack) {
        setFeedback(`Pacote de ${disc} baixado com sucesso (${pack.sizeKb} KB).`);
      }
    } catch {
      setFeedback(`Erro ao baixar pacote offline de ${disc}.`);
    } finally {
      setLoadingDiscipline(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleRemove = (disc: DisciplineId) => {
    removeOfflinePack(disc);
    setMeta(getOfflineMeta());
    setFeedback(`Pacote de ${disc} removido do cache offline.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className={`offline-pack-manager ${className}`}>
      <div className="offline-manager-header">
        <div className="offline-status-pill">
          {isOnline ? (
            <>
              <Wifi size={14} className="text-positive" />
              <span>Conexão ativa</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="text-negative" />
              <span>Modo Offline Ativo (Lendo do Cache Local)</span>
            </>
          )}
        </div>

        <div className="offline-storage-info">
          <HardDrive size={14} />
          <span>
            {Object.keys(meta.disciplinesDownloaded).length} de 4 áreas no cache local
          </span>
        </div>
      </div>

      {feedback ? (
        <div className="offline-feedback-msg" role="status">
          <CheckCircle2 size={14} />
          <span>{feedback}</span>
        </div>
      ) : null}

      <div className="offline-discipline-grid">
        {ENEM_DISCIPLINES.filter((d) => (!discipline ? true : d.id === discipline)).map((d) => {
          const isDownloaded = Boolean(meta.disciplinesDownloaded[d.id]);
          const details = meta.disciplinesDownloaded[d.id];
          const isLoading = loadingDiscipline === d.id;

          return (
            <div key={d.id} className="offline-card">
              <div className="offline-card-meta">
                <strong>{d.name}</strong>
                {isDownloaded ? (
                  <span className="offline-card-badge is-saved">
                    <CheckCircle2 size={12} />
                    {details?.sizeKb ? `${details.sizeKb} KB` : 'Salvo no navegador'}
                  </span>
                ) : (
                  <span className="offline-card-badge is-pending">
                    <CloudOff size={12} />
                    Não baixado
                  </span>
                )}
              </div>

              <div className="offline-card-actions">
                <button
                  type="button"
                  className="btn btn--secondary btn-sm"
                  onClick={() => handleDownload(d.id)}
                  disabled={isLoading}
                  title="Baixa apostilas, módulos e questões para estudar sem internet"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="spinner" />
                  ) : isDownloaded ? (
                    <RefreshCw size={14} />
                  ) : (
                    <DownloadCloud size={14} />
                  )}
                  <span>{isDownloaded ? 'Sincronizar' : 'Baixar Pacote Offline'}</span>
                </button>

                {isDownloaded ? (
                  <button
                    type="button"
                    className="btn btn--ghost btn-sm text-negative"
                    onClick={() => handleRemove(d.id)}
                    title="Liberar espaço no navegador"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
