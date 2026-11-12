'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AnswerAttempt } from '@/domain/types';

/**
 * Histórico de tentativas por usuário.
 *
 * Hoje persiste em `localStorage` (modo mock). No modo real este store será
 * substituído por chamadas à API Java (`/attempts`), mantendo a mesma interface.
 */
interface AttemptsState {
  byUser: Record<string, AnswerAttempt[]>;
  /** Substitui a tentativa anterior da mesma questão e coloca a nova no início. */
  recordAttempt: (userId: string, attempt: AnswerAttempt) => void;
  getAttempts: (userId: string) => AnswerAttempt[];
  clearUser: (userId: string) => void;
}

export const useAttemptsStore = create<AttemptsState>()(
  persist(
    (set, get) => ({
      byUser: {},

      recordAttempt: (userId, attempt) =>
        set((state) => {
          const current = state.byUser[userId] ?? [];
          const withoutSameQuestion = current.filter(
            (item) => item.questionId !== attempt.questionId,
          );

          return {
            byUser: {
              ...state.byUser,
              [userId]: [attempt, ...withoutSameQuestion],
            },
          };
        }),

      getAttempts: (userId) => get().byUser[userId] ?? [],

      clearUser: (userId) =>
        set((state) => {
          if (!(userId in state.byUser)) return state;

          const byUser = { ...state.byUser };
          delete byUser[userId];

          return { byUser };
        }),
    }),
    {
      name: 'gabaritae:web:attempts:v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ byUser: state.byUser }),
    },
  ),
);
