import type { QuestionListItem, Question, SubmissionResult, UserProgress } from '../types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  
  return res.json();
}

export const api = {
  getProblems: (params?: { difficulty?: string; tag?: string; type?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.difficulty) query.set('difficulty', params.difficulty);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.type) query.set('type', params.type);
    if (params?.search) query.set('search', params.search);
    const queryStr = query.toString();
    return request<{ problems: QuestionListItem[]; total: number; allTags: string[]; allTypes: string[] }>(
      `/problems${queryStr ? `?${queryStr}` : ''}`
    );
  },
  
  getProblem: (id: number) => 
    request<Question>(`/problems/${id}`),
  
  submitAnswer: (id: number, userAnswer: string[]) => 
    request<SubmissionResult>(`/problems/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ userAnswer }),
    }),
  
  getUserProgress: () => 
    request<UserProgress>(`/user/progress`),
  
  getUserSubmissions: (problemId?: number) => {
    const query = problemId ? `?problemId=${problemId}` : '';
    return request<SubmissionResult[]>(`/user/submissions${query}`);
  },
  
  addSubmission: (submission: SubmissionResult) =>
    request<{ success: boolean; progress: UserProgress }>(`/user/submissions`, {
      method: 'POST',
      body: JSON.stringify(submission),
    }),
  
  toggleFavorite: (id: number) => 
    request<{ favorite: boolean; favoriteProblems: number[] }>(`/user/favorites/${id}`, {
      method: 'POST',
    }),

  getExamQuestions: (count = 50) => 
    request<{ questions: Question[]; total: number; distribution: { single: number; multiple: number; judge: number } }>(`/exam/random?count=${count}`),

  getExamStats: () => 
    request<{ total: number; single: number; multiple: number; judge: number }>(`/exam/stats`),
};
