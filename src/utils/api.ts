import type { QuestionListItem, Question, SubmissionResult, UserProgress } from '../types';
import { questions } from '../data/questions';

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getQuestionListItems(): QuestionListItem[] {
  return questions.map(q => ({
    id: q.id,
    title: q.title,
    difficulty: q.difficulty,
    tags: q.tags,
    type: q.type,
    score: q.score,
  }));
}

function getAllTags(): string[] {
  const tagSet = new Set<string>();
  questions.forEach(q => q.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet);
}

function checkAnswer(question: Question, userAnswer: string[]): boolean {
  if (userAnswer.length !== question.answer.length) return false;
  const sortedUser = [...userAnswer].sort();
  const sortedCorrect = [...question.answer].sort();
  return sortedUser.every((val, idx) => val === sortedCorrect[idx]);
}

const STORAGE_KEYS = {
  PROGRESS: 'suanti_progress',
  SUBMISSIONS: 'suanti_submissions',
  FAVORITES: 'suanti_favorites',
};

function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        totalSolved: data.totalSolved || 0,
        easySolved: data.easySolved || 0,
        mediumSolved: data.mediumSolved || 0,
        hardSolved: data.hardSolved || 0,
        totalScore: data.totalScore || 0,
        submissions: data.submissions || [],
        solvedProblems: data.solvedProblems || [],
        favoriteProblems: data.favoriteProblems || [],
      };
    }
  } catch {}
  return {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalScore: 0,
    submissions: [],
    solvedProblems: [],
    favoriteProblems: [],
  };
}

function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

function loadSubmissions(): SubmissionResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveSubmissions(submissions: SubmissionResult[]): void {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
}

function loadFavorites(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: number[]): void {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

export const api = {
  getProblems: (params?: { difficulty?: string; tag?: string; type?: string; search?: string }) => {
    let result = getQuestionListItems();
    
    if (params?.difficulty && params.difficulty !== 'all') {
      result = result.filter(p => p.difficulty === params.difficulty);
    }
    
    if (params?.tag && params.tag !== 'all') {
      result = result.filter(p => p.tags.includes(params.tag));
    }
    
    if (params?.type && params.type !== 'all') {
      result = result.filter(p => p.type === params.type);
    }
    
    if (params?.search) {
      const searchStr = String(params.search).toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchStr) ||
        p.id.toString().includes(searchStr)
      );
    }
    
    const allTags = getAllTags();
    const allTypes: ('single' | 'multiple' | 'judge')[] = ['single', 'multiple', 'judge'];
    
    return Promise.resolve({
      problems: result,
      total: result.length,
      allTags,
      allTypes,
    });
  },
  
  getProblem: (id: number) => {
    const question = questions.find(q => q.id === id);
    if (!question) {
      return Promise.reject(new Error('题目不存在'));
    }
    return Promise.resolve(question);
  },
  
  submitAnswer: (id: number, userAnswer: string[]) => {
    const question = questions.find(q => q.id === id);
    if (!question) {
      return Promise.reject(new Error('题目不存在'));
    }
    
    const isCorrect = checkAnswer(question, userAnswer);
    const result: SubmissionResult = {
      id: String(Date.now()),
      problemId: id,
      problemTitle: question.title,
      status: isCorrect ? 'correct' : 'wrong',
      userAnswer,
      correctAnswer: question.answer,
      score: isCorrect ? question.score : 0,
      difficulty: question.difficulty,
      type: question.type,
      submittedAt: new Date().toISOString(),
      timestamp: Date.now(),
    } as SubmissionResult;
    
    const submissions = loadSubmissions();
    submissions.unshift(result);
    saveSubmissions(submissions);
    
    const progress = loadProgress();
    const existingCorrect = submissions.find(s => s.problemId === id && s.status === 'correct');
    if (isCorrect && !existingCorrect) {
      progress.totalSolved++;
      progress.totalScore += question.score;
      if (question.difficulty === 'easy') progress.easySolved++;
      else if (question.difficulty === 'medium') progress.mediumSolved++;
      else if (question.difficulty === 'hard') progress.hardSolved++;
      if (!progress.solvedProblems.includes(id)) {
        progress.solvedProblems.push(id);
      }
      saveProgress(progress);
    }
    
    return Promise.resolve(result);
  },
  
  getUserProgress: () => {
    const progress = loadProgress();
    progress.submissions = loadSubmissions();
    progress.favoriteProblems = loadFavorites();
    return Promise.resolve(progress);
  },
  
  getUserSubmissions: (problemId?: number) => {
    let submissions = loadSubmissions();
    if (problemId) {
      submissions = submissions.filter(s => s.problemId === problemId);
    }
    return Promise.resolve(submissions);
  },
  
  addSubmission: (submission: SubmissionResult) => {
    const submissions = loadSubmissions();
    const exists = submissions.find(s => s.id === submission.id);
    if (!exists) {
      submissions.unshift(submission);
      saveSubmissions(submissions);
    }
    
    const progress = loadProgress();
    const existingCorrect = submissions.find(s => s.problemId === submission.problemId && s.status === 'correct');
    if (submission.status === 'correct' && !existingCorrect) {
      progress.totalSolved++;
      progress.totalScore += submission.score;
      if (submission.difficulty === 'easy') progress.easySolved++;
      else if (submission.difficulty === 'medium') progress.mediumSolved++;
      else if (submission.difficulty === 'hard') progress.hardSolved++;
      if (!progress.solvedProblems.includes(submission.problemId)) {
        progress.solvedProblems.push(submission.problemId);
      }
      saveProgress(progress);
    }
    
    progress.submissions = submissions;
    return Promise.resolve({ success: true, progress });
  },
  
  toggleFavorite: (id: number) => {
    const favorites = loadFavorites();
    const index = favorites.indexOf(id);
    const favorite = index === -1;
    
    if (favorite) {
      favorites.push(id);
    } else {
      favorites.splice(index, 1);
    }
    
    saveFavorites(favorites);
    return Promise.resolve({ favorite, favoriteProblems: favorites });
  },

  getExamQuestions: (count = 50) => {
    const singleQuestions = questions.filter(q => q.type === 'single');
    const multipleQuestions = questions.filter(q => q.type === 'multiple');
    const judgeQuestions = questions.filter(q => q.type === 'judge');
    
    const singleCount = Math.round(count * 0.4);
    const multipleCount = Math.round(count * 0.3);
    const judgeCount = count - singleCount - multipleCount;
    
    const shuffledSingle = shuffleArray(singleQuestions);
    const shuffledMultiple = shuffleArray(multipleQuestions);
    const shuffledJudge = shuffleArray(judgeQuestions);
    
    const selectedSingle = shuffledSingle.slice(0, Math.min(singleCount, shuffledSingle.length));
    const selectedMultiple = shuffledMultiple.slice(0, Math.min(multipleCount, shuffledMultiple.length));
    const selectedJudge = shuffledJudge.slice(0, Math.min(judgeCount, shuffledJudge.length));
    
    const allSelected = [...selectedSingle, ...selectedMultiple, ...selectedJudge];
    
    return Promise.resolve({
      questions: allSelected,
      total: allSelected.length,
      distribution: {
        single: selectedSingle.length,
        multiple: selectedMultiple.length,
        judge: selectedJudge.length,
      },
    });
  },

  getExamStats: () => {
    const single = questions.filter(q => q.type === 'single').length;
    const multiple = questions.filter(q => q.type === 'multiple').length;
    const judge = questions.filter(q => q.type === 'judge').length;
    
    return Promise.resolve({
      total: questions.length,
      single,
      multiple,
      judge,
    });
  },
};
