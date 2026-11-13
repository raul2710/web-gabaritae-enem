import type { DisciplineId, ModuloDidatico, OfflinePack, PixInfo, Question, TheoryModule } from '@/domain/types';

const PREFIX = 'gabaritae_offline_';
const PACK_KEY = (discipline: string) => `${PREFIX}pack_${discipline}`;
const PIX_KEY = `${PREFIX}pix_official`;
const META_KEY = `${PREFIX}metadata`;

export interface OfflineMeta {
  lastUpdated: string;
  disciplinesDownloaded: Record<string, { downloadedAt: string; sizeKb: number; modulosCount: number; questionsCount: number }>;
}

const memoryStore = new Map<string, string>();

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch {
    // fallback para memoryStore
  }
  return memoryStore.get(key) ?? null;
}

function safeSetItem(key: string, value: string): boolean {
  try {
    memoryStore.set(key, value);
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
      window.localStorage.setItem(key, value);
    }
    return true;
  } catch {
    return true; // salvo no memoryStore
  }
}

function safeRemoveItem(key: string): void {
  try {
    memoryStore.delete(key);
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.removeItem === 'function') {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export function saveOfflinePack(pack: OfflinePack): boolean {
  const json = JSON.stringify(pack);
  const success = safeSetItem(PACK_KEY(pack.discipline), json);

  if (success) {
    // Também atualiza o Pix offline se vier junto no pacote
    if (pack.pix) {
      saveOfflinePix(pack.pix);
    }

    const meta = getOfflineMeta();
    meta.lastUpdated = new Date().toISOString();
    meta.disciplinesDownloaded[pack.discipline] = {
      downloadedAt: new Date().toISOString(),
      sizeKb: pack.sizeKb || Math.round(json.length / 1024),
      modulosCount: pack.modulosDidaticos?.length ?? 0,
      questionsCount: pack.questions?.length ?? 0,
    };
    safeSetItem(META_KEY, JSON.stringify(meta));
  }

  return success;
}

export function getOfflinePack(discipline: DisciplineId): OfflinePack | null {
  const raw = safeGetItem(PACK_KEY(discipline));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OfflinePack;
  } catch {
    return null;
  }
}

export function hasOfflinePack(discipline: DisciplineId): boolean {
  return safeGetItem(PACK_KEY(discipline)) !== null;
}

export function getOfflineMeta(): OfflineMeta {
  const raw = safeGetItem(META_KEY);
  if (!raw) {
    return {
      lastUpdated: '',
      disciplinesDownloaded: {},
    };
  }
  try {
    return JSON.parse(raw) as OfflineMeta;
  } catch {
    return { lastUpdated: '', disciplinesDownloaded: {} };
  }
}

export function saveOfflinePix(pix: PixInfo): boolean {
  return safeSetItem(PIX_KEY, JSON.stringify(pix));
}

export function getOfflinePix(): PixInfo | null {
  const raw = safeGetItem(PIX_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PixInfo;
  } catch {
    return null;
  }
}

export function removeOfflinePack(discipline: DisciplineId): void {
  safeRemoveItem(PACK_KEY(discipline));
  const meta = getOfflineMeta();
  delete meta.disciplinesDownloaded[discipline];
  safeSetItem(META_KEY, JSON.stringify(meta));
}

export function clearOfflineCache(): void {
  memoryStore.clear();
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.clear === 'function') {
      window.localStorage.clear();
    }
  } catch {
    // ignore
  }
}

export function getAllSavedOfflineModulos(): ModuloDidatico[] {
  const disciplines: DisciplineId[] = ['matematica', 'natureza', 'humanas', 'linguagens'];
  const all: ModuloDidatico[] = [];

  for (const disc of disciplines) {
    const pack = getOfflinePack(disc);
    if (pack?.modulosDidaticos) {
      all.push(...pack.modulosDidaticos);
    }
  }

  return all;
}

export function getAllSavedOfflineQuestions(): Question[] {
  const disciplines: DisciplineId[] = ['matematica', 'natureza', 'humanas', 'linguagens'];
  const all: Question[] = [];

  for (const disc of disciplines) {
    const pack = getOfflinePack(disc);
    if (pack?.questions) {
      all.push(...pack.questions);
    }
  }

  return all;
}

export function getAllSavedOfflineApostilas(): Record<DisciplineId, TheoryModule[]> {
  const disciplines: DisciplineId[] = ['matematica', 'natureza', 'humanas', 'linguagens'];
  const result: Record<DisciplineId, TheoryModule[]> = {
    matematica: [],
    natureza: [],
    humanas: [],
    linguagens: [],
  };

  for (const disc of disciplines) {
    const pack = getOfflinePack(disc);
    if (pack?.theory) {
      result[disc] = pack.theory;
    }
  }

  return result;
}
