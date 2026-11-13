// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import {
  fetchModulos,
  fetchOfflinePack,
  fetchPix,
  getExportNotebookLmUrl,
  getModuloById,
  getModuloMarkdownDownloadUrl,
  resolveApiUrl,
} from '../api';
import {
  clearOfflineCache,
  getOfflinePack,
  getOfflinePix,
  saveOfflinePack,
  saveOfflinePix,
} from '../offline-storage';
import type { OfflinePack, PixInfo } from '@/domain/types';

describe('Gabaritaê ENEM API Client & Offline Storage', () => {
  beforeEach(() => {
    clearOfflineCache();
  });

  describe('resolveApiUrl', () => {
    it('mantém URLs absolutas inalteradas', () => {
      expect(resolveApiUrl('https://inep.gov.br/arquivo.pdf')).toBe(
        'https://inep.gov.br/arquivo.pdf',
      );
    });

    it('adiciona a base da API para caminhos relativos', () => {
      const resolved = resolveApiUrl('/modulos');
      expect(resolved).toMatch(/\/modulos$/);
    });

    it('gera URLs corretas de download Markdown e export NotebookLM', () => {
      const singleUrl = getModuloMarkdownDownloadUrl('MOD-01');
      expect(singleUrl).toContain('/modulos/MOD-01/markdown');

      const areaUrl = getExportNotebookLmUrl('Matemática');
      expect(areaUrl).toContain('/modulos/export/notebooklm?area=');
    });
  });

  describe('fetchModulos & Fallback', () => {
    it('retorna módulos didáticos com fundamentação e item de fixação', async () => {
      const modulos = await fetchModulos();
      expect(modulos.length).toBeGreaterThan(0);

      const modulo = modulos[0];
      expect(modulo.id).toBeDefined();
      expect(modulo.fundamentacaoTeorica).toBeDefined();
      expect(modulo.esquemaConceitual).toBeDefined();
      expect(modulo.itemFixacao).toBeDefined();
      expect(modulo.itemFixacao.gabaritoOficial).toMatch(/^[A-E]$/);
    });

    it('filtra módulos por área e recorrência', async () => {
      const mat = await fetchModulos({ area: 'Matemática' });
      expect(mat.every((m) => m.area === 'Matemática')).toBe(true);

      const alta = await fetchModulos({ recorrencia: 'Alta' });
      expect(alta.every((m) => m.recorrencia === 'Alta')).toBe(true);
    });

    it('getModuloById retorna o módulo detalhado e markdown NotebookLM', async () => {
      const detail = await getModuloById('MOD-MAT-C3H11-01');
      expect(detail).not.toBeNull();
      expect(detail?.modulo.id).toBe('MOD-MAT-C3H11-01');
      expect(detail?.notebookLmMarkdown).toContain('Funções Exponenciais');
    });
  });

  describe('Offline Storage & Pacotes', () => {
    it('salva e recupera pacote offline da disciplina', () => {
      const fakePack: OfflinePack = {
        id: 'pack-mat-test',
        discipline: 'matematica',
        theory: [],
        questions: [],
        modulosDidaticos: [],
        pix: {
          pixKey: 'teste@pix.com',
          keyType: 'E-mail',
          merchantName: 'Gabaritaê',
          merchantCity: 'Brasília',
          amount: 19.9,
          txId: 'TESTE123',
          pixCopiaECola: '000201...',
        },
        sizeKb: 42,
      };

      const saved = saveOfflinePack(fakePack);
      expect(saved).toBe(true);

      const loaded = getOfflinePack('matematica');
      expect(loaded).not.toBeNull();
      expect(loaded?.id).toBe('pack-mat-test');
      expect(loaded?.sizeKb).toBe(42);
    });

    it('fetchPix recupera dados oficiais BACEN com fallback e QR Code copia e cola', async () => {
      const pix = await fetchPix(19.9, 'APOIOENEM');
      expect(pix.pixKey).toBeDefined();
      expect(pix.pixCopiaECola).toContain('BR.GOV.BCB.PIX');
      expect(pix.merchantName).toBe('Gabaritaê ENEM Educação');
    });
  });
});
