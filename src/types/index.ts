export type QuestionType = 'single' | 'multiple' | 'judge';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ProblemStatus = 'unsolved' | 'attempted' | 'solved';

export interface Option {
  label: string;
  content: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  content: string;
  options: Option[];
  answer: string[];
  explanation: string;
  tags: string[];
  difficulty: Difficulty;
  score: number;
}

export interface QuestionListItem {
  id: number;
  title: string;
  type: QuestionType;
  tags: string[];
  difficulty: Difficulty;
  score: number;
  status?: ProblemStatus;
}

export interface SubmissionResult {
  id: string;
  problemId: number;
  problemTitle?: string;
  status: 'correct' | 'wrong';
  userAnswer: string[];
  correctAnswer: string[];
  score: number;
  difficulty?: Difficulty;
  type?: QuestionType;
  submittedAt: string;
  timestamp?: number;
}

export interface UserProgress {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  submissions: SubmissionResult[];
  solvedProblems: number[];
  favoriteProblems: number[];
  totalScore: number;
}
