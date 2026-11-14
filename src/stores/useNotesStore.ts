'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { StudyNote, StudyNoteDiscipline } from '@/domain/types';

export interface StudyNoteInput {
  title: string;
  discipline: StudyNoteDiscipline;
  subject: string;
  content: string;
  keyPoints?: string[];
  pinned?: boolean;
  sourceModuleId?: string;
}

interface NotesState {
  byUser: Record<string, StudyNote[]>;
  addNote: (userId: string, input: StudyNoteInput) => StudyNote;
  updateNote: (userId: string, noteId: string, input: Partial<StudyNoteInput>) => void;
  deleteNote: (userId: string, noteId: string) => void;
  togglePin: (userId: string, noteId: string) => void;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      byUser: {},

      addNote: (userId, input) => {
        const now = new Date().toISOString();
        const newNote: StudyNote = {
          id: generateId(),
          title: input.title.trim() || 'Resumo sem título',
          discipline: input.discipline,
          subject: input.subject.trim() || 'Geral',
          content: input.content.trim(),
          keyPoints: (input.keyPoints ?? []).map((item) => item.trim()).filter(Boolean),
          pinned: Boolean(input.pinned),
          sourceModuleId: input.sourceModuleId,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          const existing = state.byUser[userId] ?? [];
          return {
            byUser: {
              ...state.byUser,
              [userId]: [newNote, ...existing],
            },
          };
        });

        return newNote;
      },

      updateNote: (userId, noteId, input) =>
        set((state) => {
          const existing = state.byUser[userId];
          if (!existing) return state;

          const updated = existing.map((note) => {
            if (note.id !== noteId) return note;
            return {
              ...note,
              title: input.title !== undefined ? input.title.trim() || note.title : note.title,
              discipline: input.discipline ?? note.discipline,
              subject: input.subject !== undefined ? input.subject.trim() || 'Geral' : note.subject,
              content: input.content !== undefined ? input.content.trim() : note.content,
              keyPoints:
                input.keyPoints !== undefined
                  ? input.keyPoints.map((item) => item.trim()).filter(Boolean)
                  : note.keyPoints,
              pinned: input.pinned !== undefined ? input.pinned : note.pinned,
              updatedAt: new Date().toISOString(),
            };
          });

          return {
            byUser: {
              ...state.byUser,
              [userId]: updated,
            },
          };
        }),

      deleteNote: (userId, noteId) =>
        set((state) => {
          const existing = state.byUser[userId];
          if (!existing) return state;

          return {
            byUser: {
              ...state.byUser,
              [userId]: existing.filter((note) => note.id !== noteId),
            },
          };
        }),

      togglePin: (userId, noteId) =>
        set((state) => {
          const existing = state.byUser[userId];
          if (!existing) return state;

          return {
            byUser: {
              ...state.byUser,
              [userId]: existing.map((note) =>
                note.id === noteId
                  ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() }
                  : note,
              ),
            },
          };
        }),
    }),
    {
      name: 'gabaritae:web:notes:v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ byUser: state.byUser }),
    },
  ),
);

