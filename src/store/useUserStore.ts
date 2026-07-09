import { create } from 'zustand';
import type { UserProgress, SubmissionResult } from '../types';

interface UserState {
  progress: UserProgress | null;
  loading: boolean;
  
  setProgress: (progress: UserProgress) => void;
  addSubmission: (submission: SubmissionResult) => void;
  toggleFavorite: (problemId: number) => void;
  isSolved: (problemId: number) => boolean;
  isFavorite: (problemId: number) => boolean;
}

const defaultProgress: UserProgress = {
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  submissions: [],
  solvedProblems: [],
  favoriteProblems: [],
  totalScore: 0,
};

export const useUserStore = create<UserState>((set, get) => ({
  progress: defaultProgress,
  loading: false,
  
  setProgress: (progress) => set({ progress }),
  
  addSubmission: (submission) => {
    set((state) => {
      if (!state.progress) return state;
      
      const isNewlySolved = 
        submission.status === 'correct' && 
        !state.progress.solvedProblems.includes(submission.problemId);
      
      const newSolvedProblems = isNewlySolved 
        ? [...state.progress.solvedProblems, submission.problemId]
        : state.progress.solvedProblems;
      
      const newTotalScore = isNewlySolved
        ? state.progress.totalScore + submission.score
        : state.progress.totalScore;
      
      return {
        progress: {
          ...state.progress,
          submissions: [submission, ...state.progress.submissions],
          solvedProblems: newSolvedProblems,
          totalSolved: newSolvedProblems.length,
          totalScore: newTotalScore,
        },
      };
    });
  },
  
  toggleFavorite: (problemId) => {
    set((state) => {
      if (!state.progress) return state;
      
      const isFav = state.progress.favoriteProblems.includes(problemId);
      const newFavorites = isFav
        ? state.progress.favoriteProblems.filter(id => id !== problemId)
        : [...state.progress.favoriteProblems, problemId];
      
      return {
        progress: {
          ...state.progress,
          favoriteProblems: newFavorites,
        },
      };
    });
  },
  
  isSolved: (problemId) => {
    const state = get();
    return state.progress?.solvedProblems.includes(problemId) ?? false;
  },
  
  isFavorite: (problemId) => {
    const state = get();
    return state.progress?.favoriteProblems.includes(problemId) ?? false;
  },
}));
