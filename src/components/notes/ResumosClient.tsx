'use client';

import {
  AlertTriangle,
  BookmarkCheck,
  BookmarkPlus,
  CheckCircle2,
  Flame,
  NotebookPen,
  Pencil,
  Pin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';

import { Badge } from '@/components/ui/Badge';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ENEM_FLASH_SUMMARIES, type FlashSummaryItem } from '@/data/enemFlashSummaries';
import { NOTE_CATEGORIES } from '@/domain/constants';
import type { SessionUser, StudyNote, StudyNoteDiscipline } from '@/domain/types';
import { useHydrated } from '@/hooks/useHydrated';
import { useNotesStore } from '@/stores/useNotesStore';

interface ResumosClientProps {
  user: SessionUser;
}

const EMPTY_NOTES: StudyNote[] = [];

const CATEGORY_MAP = new Map(NOTE_CATEGORIES.map((cat) => [cat.id, cat]));

const NOTE_DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function formatNoteDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return NOTE_DATE_FORMAT.format(d);
}

export function ResumosClient({ user }: ResumosClientProps) {
  const hydrated = useHydrated();
  const storedNotes = useNotesStore((state) => state.byUser[user.id]);
  const addNote = useNotesStore((state) => state.addNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const togglePin = useNotesStore((state) => state.togglePin);

  const notes = storedNotes ?? EMPTY_NOTES;

  // Modo visual padrão: "Raio-X do que mais cai" (100% pronto sem precisar de API)
  const [activeView, setActiveView] = useState<'flash' | 'caderno'>('flash');
  const [filterDiscipline, setFilterDiscipline] = useState<'todas' | StudyNoteDiscipline>('todas');
  const [filterExamDay, setFilterExamDay] = useState<'todos' | '2º Dia' | '1º Dia'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPinned, setOnlyPinned] = useState(false);

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState<StudyNoteDiscipline>('matematica');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [keyPointsText, setKeyPointsText] = useState('');
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const savedSourceIds = useMemo(
    () => new Set(notes.map((n) => n.sourceModuleId).filter(Boolean)),
    [notes],
  );

  const filteredFlash = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return ENEM_FLASH_SUMMARIES.filter((item) => {
      if (filterDiscipline !== 'todas' && item.discipline !== filterDiscipline) {
        return false;
      }
      if (filterExamDay !== 'todos' && item.examDay !== filterExamDay) {
        return false;
      }
      if (query) {
        const haystack = [
          item.title,
          item.subject,
          item.summary,
          item.goldenTip,
          ...item.keyFormulas,
          ...item.visualDiagram.map((d) => `${d.step} ${d.detail}`),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      }
      return true;
    });
  }, [filterDiscipline, filterExamDay, searchQuery]);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return notes
      .filter((note) => {
        if (filterDiscipline !== 'todas' && note.discipline !== filterDiscipline) {
          return false;
        }
        if (onlyPinned && !note.pinned) {
          return false;
        }
        if (query) {
          const haystack = [note.title, note.subject, note.content, ...note.keyPoints]
            .join(' ')
            .toLowerCase();
          return haystack.includes(query);
        }
        return true;
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [notes, filterDiscipline, onlyPinned, searchQuery]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function resetForm() {
    setEditingNoteId(null);
    setTitle('');
    setDiscipline('matematica');
    setSubject('');
    setContent('');
    setKeyPointsText('');
    setPinned(false);
    setError(null);
  }

  function openNewComposer() {
    resetForm();
    setIsComposerOpen(true);
  }

  function openEditComposer(note: StudyNote) {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setDiscipline(note.discipline);
    setSubject(note.subject);
    setContent(note.content);
    setKeyPointsText(note.keyPoints.join('\n'));
    setPinned(note.pinned);
    setError(null);
    setActiveView('caderno');
    setIsComposerOpen(true);
  }

  function handleSaveFlashCard(item: FlashSummaryItem) {
    if (savedSourceIds.has(item.id)) return;

    const stepsText = item.visualDiagram
      .map((step) => `• ${step.step}: ${step.detail}`)
      .join('\n');

    addNote(user.id, {
      title: item.title,
      discipline: item.discipline,
      subject: item.subject,
      content: `${item.summary}\n\nEsquema Visual:\n${stepsText}\n\nPegadinha / Dica de Ouro:\n${item.goldenTip}`,
      keyPoints: item.keyFormulas,
      pinned: true,
      sourceModuleId: item.id,
    });
    showToast(`"${item.title}" salvo nas suas anotações!`);
  }

  function handleSaveAllVisibleFlash() {
    let added = 0;
    for (const item of filteredFlash) {
      if (!savedSourceIds.has(item.id)) {
        const stepsText = item.visualDiagram
          .map((step) => `• ${step.step}: ${step.detail}`)
          .join('\n');
        addNote(user.id, {
          title: item.title,
          discipline: item.discipline,
          subject: item.subject,
          content: `${item.summary}\n\nEsquema Visual:\n${stepsText}\n\nPegadinha / Dica de Ouro:\n${item.goldenTip}`,
          keyPoints: item.keyFormulas,
          pinned: true,
          sourceModuleId: item.id,
        });
        added++;
      }
    }
    if (added > 0) {
      showToast(`${added} resumos salvos no seu caderno pessoal!`);
    } else {
      showToast('Todos os resumos visíveis já estão salvos no seu caderno.');
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Dê um título ao seu resumo para encontrá-lo facilmente depois.');
      return;
    }
    if (!content.trim()) {
      setError('Escreva o conteúdo ou anotação do seu resumo.');
      return;
    }

    const parsedKeyPoints = keyPointsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (editingNoteId) {
      updateNote(user.id, editingNoteId, {
        title,
        discipline,
        subject: subject.trim() || 'Geral',
        content,
        keyPoints: parsedKeyPoints,
        pinned,
      });
      showToast('Resumo atualizado com sucesso!');
    } else {
      addNote(user.id, {
        title,
        discipline,
        subject: subject.trim() || 'Geral',
        content,
        keyPoints: parsedKeyPoints,
        pinned,
      });
      showToast('Novo resumo salvo no seu caderno!');
    }

    resetForm();
    setIsComposerOpen(false);
    setActiveView('caderno');
  }

  if (!hydrated) {
    return (
      <section className="section">
        <div className="dashboard-skeleton" aria-hidden="true">
          <div className="dashboard-skeleton__block dashboard-skeleton__block--chart" />
          <div className="dashboard-skeleton__block dashboard-skeleton__block--list" />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <header className="dashboard-header">
        <div>
          <span className="section-header__eyebrow">Reta Final ENEM · Revisão Visual</span>
          <h1 className="dashboard-header__title">Resumos & O Que Mais Cai</h1>
          <p className="page-hero__description">
            Guias visuais prontos separados por matéria (fórmulas, esquemas e pegadinhas clássicas)
            + seu caderno pessoal para anotar e salvar.
          </p>
        </div>

        <div className="row">
          {toastMessage ? (
            <Badge tone="positive">
              <CheckCircle2 size={14} aria-hidden="true" />
              {toastMessage}
            </Badge>
          ) : null}
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => (isComposerOpen ? setIsComposerOpen(false) : openNewComposer())}
          >
            {isComposerOpen ? (
              <>
                <X size={16} aria-hidden="true" />
                Fechar editor
              </>
            ) : (
              <>
                <Plus size={16} aria-hidden="true" />
                Criar anotação
              </>
            )}
          </button>
        </div>
      </header>

      {/* Seletor visual de modo: Guia Visual de Véspera vs. Minhas Anotações */}
      <div className="resumos-mode-switch" role="tablist" aria-label="Modo de visualização dos resumos">
        <button
          type="button"
          role="tab"
          aria-selected={activeView === 'flash'}
          className={
            activeView === 'flash'
              ? 'resumos-mode-btn resumos-mode-btn--active'
              : 'resumos-mode-btn'
          }
          onClick={() => setActiveView('flash')}
        >
          <Zap size={18} aria-hidden="true" />
          <div>
            <strong>Raio-X Visual: O Que Mais Cai</strong>
            <span>{ENEM_FLASH_SUMMARIES.length} mapas visuais prontos por matéria</span>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeView === 'caderno'}
          className={
            activeView === 'caderno'
              ? 'resumos-mode-btn resumos-mode-btn--active'
              : 'resumos-mode-btn'
          }
          onClick={() => setActiveView('caderno')}
        >
          <NotebookPen size={18} aria-hidden="true" />
          <div>
            <strong>Meu Caderno de Anotações</strong>
            <span>{notes.length} {notes.length === 1 ? 'resumo salvo' : 'resumos salvos'}</span>
          </div>
        </button>
      </div>

      {/* Editor de Anotação Pessoal */}
      {isComposerOpen && (
        <section className="note-composer card" aria-labelledby="note-composer-title">
          <div className="note-composer__header">
            <div className="row">
              <NotebookPen size={20} aria-hidden="true" style={{ color: 'var(--primary)' }} />
              <h2 id="note-composer-title">
                {editingNoteId ? 'Editar resumo' : 'Criar ou anotar novo resumo'}
              </h2>
            </div>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                resetForm();
                setIsComposerOpen(false);
              }}
            >
              Cancelar
            </button>
          </div>

          <form className="note-composer__form" onSubmit={handleSubmit} noValidate>
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="note-composer__grid">
              <div className="field">
                <label className="field-label" htmlFor="note-title">
                  Título do resumo
                </label>
                <input
                  id="note-title"
                  type="text"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex.: Fórmulas de Eletrodinâmica, Repertórios de Redação..."
                  required
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="note-discipline">
                  Área do conhecimento
                </label>
                <CustomSelect
                  id="note-discipline"
                  value={discipline}
                  onChange={(val) => setDiscipline(val)}
                  options={NOTE_CATEGORIES.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                    accentColor: cat.accent,
                  }))}
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="note-subject">
                  Matéria ou Conteúdo
                </label>
                <input
                  id="note-subject"
                  type="text"
                  className="input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex.: Física · Circuitos, Biologia · Ecologia"
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="note-content">
                Suas anotações
              </label>
              <textarea
                id="note-content"
                className="input note-composer__textarea"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva aqui o resumo com suas próprias palavras, macetes ou passos de resolução..."
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="note-keypoints">
                Fórmulas, macetes ou pontos-chave (opcional · 1 por linha)
              </label>
              <textarea
                id="note-keypoints"
                className="input note-composer__textarea"
                rows={3}
                value={keyPointsText}
                onChange={(e) => setKeyPointsText(e.target.value)}
                placeholder={'Ex.:\nP = U · i\nV = π · r² · h\nDividir km/h por 3,6 para converter em m/s'}
              />
            </div>

            <div className="note-composer__footer">
              <label className="note-pin-checkbox">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
                <Pin size={15} aria-hidden="true" />
                <span>Fixar este resumo no topo</span>
              </label>

              <div className="row">
                <button type="submit" className="btn btn--primary btn--sm">
                  <BookmarkPlus size={16} aria-hidden="true" />
                  {editingNoteId ? 'Salvar alterações' : 'Salvar no meu caderno'}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* Barra de busca e filtros por conteúdo/matéria */}
      <div className="notes-toolbar">
        <div className="notes-search">
          <Search size={16} aria-hidden="true" className="notes-search__icon" />
          <input
            type="search"
            className="input notes-search__input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar conteúdo (ex.: escala, cilindro, chuveiro, eutrofização, redação)..."
            aria-label="Buscar nos resumos"
          />
        </div>

        <div className="notes-filters" role="group" aria-label="Filtrar por área do conhecimento">
          <button
            type="button"
            className={filterDiscipline === 'todas' ? 'chip chip--active' : 'chip'}
            aria-pressed={filterDiscipline === 'todas'}
            onClick={() => setFilterDiscipline('todas')}
          >
            Todas as matérias
          </button>
          {NOTE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={filterDiscipline === cat.id ? 'chip chip--active' : 'chip'}
              aria-pressed={filterDiscipline === cat.id}
              onClick={() => setFilterDiscipline(cat.id)}
            >
              {cat.name}
            </button>
          ))}

          {activeView === 'flash' ? (
            <>
              <button
                type="button"
                className={filterExamDay === '2º Dia' ? 'chip chip--active' : 'chip'}
                aria-pressed={filterExamDay === '2º Dia'}
                onClick={() =>
                  setFilterExamDay((prev) => (prev === '2º Dia' ? 'todos' : '2º Dia'))
                }
              >
                <Flame size={14} aria-hidden="true" />
                Foco 2º Dia (Mat + Natureza)
              </button>
              <button
                type="button"
                className={filterExamDay === '1º Dia' ? 'chip chip--active' : 'chip'}
                aria-pressed={filterExamDay === '1º Dia'}
                onClick={() =>
                  setFilterExamDay((prev) => (prev === '1º Dia' ? 'todos' : '1º Dia'))
                }
              >
                1º Dia (Linguagens + Humanas + Redação)
              </button>
            </>
          ) : (
            <button
              type="button"
              className={onlyPinned ? 'chip chip--active' : 'chip'}
              aria-pressed={onlyPinned}
              onClick={() => setOnlyPinned((prev) => !prev)}
            >
              <Pin size={14} aria-hidden="true" />
              Apenas fixados
            </button>
          )}
        </div>
      </div>

      {/* MODO 1: RAIO-X VISUAL DO QUE MAIS CAI */}
      {activeView === 'flash' ? (
        <>
          <div className="flash-banner">
            <div className="row" style={{ gap: 'var(--space-xs)' }}>
              <Sparkles size={18} aria-hidden="true" style={{ color: 'var(--primary)' }} />
              <span>
                <strong>Revisão Expressa Offline:</strong> Todos os cards abaixo estão separados por
                conteúdo com <strong>esquema visual</strong>, <strong>fórmulas-chave</strong> e{' '}
                <strong>pegadinha clássica do ENEM</strong>.
              </span>
            </div>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={handleSaveAllVisibleFlash}
            >
              <BookmarkPlus size={15} aria-hidden="true" />
              Salvar todos no meu caderno
            </button>
          </div>

          {filteredFlash.length === 0 ? (
            <EmptyState
              icon={<Search size={32} />}
              title="Nenhum resumo visual encontrado para este filtro"
              description="Limpe o campo de busca ou selecione 'Todas as matérias' para ver o guia completo."
            />
          ) : (
            <div className="flash-grid">
              {filteredFlash.map((item) => {
                const cat = CATEGORY_MAP.get(item.discipline);
                const isSaved = savedSourceIds.has(item.id);

                return (
                  <article
                    key={item.id}
                    className="flash-card"
                    style={
                      {
                        '--note-accent': cat?.accent ?? 'var(--primary)',
                        '--note-tint': cat?.tint ?? 'var(--primary-soft)',
                      } as CSSProperties
                    }
                  >
                    <header className="flash-card__top">
                      <div className="row" style={{ gap: 'var(--space-xs)' }}>
                        <span className="note-card__area-badge">
                          {cat?.name ?? item.discipline}
                        </span>
                        <Badge>{item.subject}</Badge>
                        <Badge tone="warning">
                          <Flame size={12} aria-hidden="true" />
                          {item.examDay}
                        </Badge>
                      </div>

                      {isSaved ? (
                        <span className="badge badge--positive">
                          <BookmarkCheck size={13} aria-hidden="true" />
                          Salvo
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn--secondary btn--sm"
                          onClick={() => handleSaveFlashCard(item)}
                        >
                          <BookmarkPlus size={14} aria-hidden="true" />
                          Salvar no caderno
                        </button>
                      )}
                    </header>

                    <h2 className="flash-card__title">{item.title}</h2>
                    <p className="flash-card__summary">{item.summary}</p>

                    <div className="flash-card__incidence">
                      <ProgressBar
                        label="Recorrência na prova"
                        value={item.incidencePercent}
                        max={100}
                        valueText={item.incidence}
                        tone="positive"
                      />
                    </div>

                    {/* Esquema Visual Passo a Passo */}
                    <div className="flash-diagram" aria-label="Esquema visual do conteúdo">
                      <span className="flash-diagram__heading">Esquema Visual Rápido</span>
                      <div className="flash-diagram__steps">
                        {item.visualDiagram.map((node, index) => (
                          <div key={node.step} className="flash-diagram__node">
                            <span className="flash-diagram__badge">{index + 1}</span>
                            <div className="flash-diagram__text">
                              <strong>{node.step}</strong>
                              <span>{node.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fórmulas e Conceitos-Chave */}
                    <div className="theory-formulas">
                      <h3 className="theory-formulas__title">Fórmulas & Regras de Bolso</h3>
                      <ul className="theory-formulas__list">
                        {item.keyFormulas.map((formula) => (
                          <li key={formula} className="theory-formulas__item">
                            <code>{formula}</code>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dica de Ouro / Pegadinha */}
                    <aside className="theory-trap" aria-label="Dica de ouro e pegadinha">
                      <div className="theory-trap__header">
                        <AlertTriangle size={16} aria-hidden="true" />
                        <span className="theory-trap__title">Como o ENEM cobra / Pegadinha</span>
                      </div>
                      <p className="theory-trap__correct">{item.goldenTip}</p>
                    </aside>
                  </article>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* MODO 2: CADERNO DE ANOTAÇÕES DO ALUNO */
        <>
          {filteredNotes.length === 0 ? (
            <EmptyState
              icon={<NotebookPen size={32} />}
              title={
                notes.length === 0
                  ? 'Seu caderno pessoal ainda está vazio'
                  : 'Nenhuma anotação encontrada para este filtro'
              }
              description={
                notes.length === 0
                  ? 'Você pode clicar em "Criar anotação" no topo ou salvar qualquer card da aba "Raio-X Visual: O Que Mais Cai" com 1 clique.'
                  : 'Tente limpar a busca ou escolher outra área do conhecimento.'
              }
              action={
                notes.length === 0 ? (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => setActiveView('flash')}
                  >
                    <Zap size={16} aria-hidden="true" />
                    Ver resumos visuais prontos
                  </button>
                ) : undefined
              }
            />
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => {
                const cat = CATEGORY_MAP.get(note.discipline);
                return (
                  <article
                    key={note.id}
                    className={note.pinned ? 'note-card note-card--pinned' : 'note-card'}
                    style={
                      {
                        '--note-accent': cat?.accent ?? 'var(--primary)',
                        '--note-tint': cat?.tint ?? 'var(--primary-soft)',
                      } as CSSProperties
                    }
                  >
                    <header className="note-card__header">
                      <div className="row" style={{ gap: 'var(--space-xs)' }}>
                        <span className="note-card__area-badge">
                          {cat?.name ?? note.discipline}
                        </span>
                        <Badge>{note.subject}</Badge>
                        {note.pinned ? (
                          <Badge tone="warning">
                            <Pin size={12} aria-hidden="true" />
                            Fixado
                          </Badge>
                        ) : null}
                      </div>

                      <div className="note-card__actions">
                        <button
                          type="button"
                          className="note-card__icon-btn"
                          onClick={() => togglePin(user.id, note.id)}
                          title={note.pinned ? 'Desafixar resumo' : 'Fixar no topo'}
                          aria-label={note.pinned ? 'Desafixar resumo' : 'Fixar no topo'}
                        >
                          <Pin size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="note-card__icon-btn"
                          onClick={() => openEditComposer(note)}
                          title="Editar resumo"
                          aria-label="Editar resumo"
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="note-card__icon-btn note-card__icon-btn--danger"
                          onClick={() => {
                            deleteNote(user.id, note.id);
                            showToast('Resumo removido.');
                          }}
                          title="Excluir resumo"
                          aria-label="Excluir resumo"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </header>

                    <h3 className="note-card__title">{note.title}</h3>

                    <p className="note-card__content">{note.content}</p>

                    {note.keyPoints.length > 0 ? (
                      <div className="note-card__keypoints">
                        <span className="note-card__keypoints-title">Pontos-chave & fórmulas</span>
                        <ul className="note-card__keypoints-list">
                          {note.keyPoints.map((kp, idx) => (
                            <li key={`${note.id}-kp-${idx}`}>{kp}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <footer className="note-card__footer">
                      <span>Atualizado em {formatNoteDate(note.updatedAt)}</span>
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}

