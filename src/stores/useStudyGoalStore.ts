'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { StudyGoal } from '@/domain/types';

interface StudyGoalState {
  byUser: Record<string, StudyGoal>;
  setGoal: (
    userId: string,
    goal: Omit<StudyGoal, 'updatedAt'> & { updatedAt?: string },
  ) => void;
  getGoal: (userId: string) => StudyGoal | undefined;
  clearGoal: (userId: string) => void;
}

export const useStudyGoalStore = create<StudyGoalState>()(
  persist(
    (set, get) => ({
      byUser: {},

      setGoal: (userId, goal) =>
        set((state) => ({
          byUser: {
            ...state.byUser,
            [userId]: {
              focusCourse: goal.focusCourse.trim(),
              targetUniversity: goal.targetUniversity.trim(),
              targetScore: Math.min(1000, Math.max(300, Math.round(Number(goal.targetScore) || 700))),
              updatedAt: goal.updatedAt ?? new Date().toISOString(),
            },
          },
        })),

      getGoal: (userId) => get().byUser[userId],

      clearGoal: (userId) =>
        set((state) => {
          if (!(userId in state.byUser)) return state;
          const byUser = { ...state.byUser };
          delete byUser[userId];
          return { byUser };
        }),
    }),
    {
      name: 'gabaritae:web:goals:v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ byUser: state.byUser }),
    },
  ),
);
