import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  StarOff, 
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  ListChecks,
  Award,
  AlertCircle,
  RotateCcw,
  Send
} from 'lucide-react';
import DifficultyBadge from '../components/DifficultyBadge';
import TagBadge from '../components/TagBadge';
import type { Question, SubmissionResult, QuestionType } from '../types';
import { api } from '../utils/api';
import { useUserStore } from '../store/useUserStore';
import { cn } from '../lib/utils';

const typeLabels: Record<QuestionType, string> = {
  single: '单选题',
  multiple: '多选题',
  judge: '判断题',
};

const tabs = [
  { id: 'description', label: '题目', icon: BookOpen },
  { id: 'submissions', label: '提交记录', icon: ListChecks },
];

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const problemId = parseInt(id || '1');
  
  const [problem, setProblem] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);
  
  const { isFavorite, toggleFavorite: toggleFavStore, addSubmission } = useUserStore();
  const favorite = isFavorite(problemId);
  
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setUserAnswer([]);
      setSubmissionResult(null);
      try {
        const data = await api.getProblem(problemId);
        setProblem(data);
      } catch (error) {
        console.error('Failed to fetch problem:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblem();
  }, [problemId]);
  
  useEffect(() => {
    if (activeTab === 'submissions') {
      api.getUserSubmissions(problemId).then(setSubmissions).catch(console.error);
    }
  }, [activeTab, problemId, submissionResult]);
  
  const handleOptionClick = (label: string) => {
    if (submissionResult) return;
    
    if (problem?.type === 'single' || problem?.type === 'judge') {
      setUserAnswer([label]);
    } else {
      setUserAnswer(prev => 
        prev.includes(label)
          ? prev.filter(l => l !== label)
          : [...prev, label]
      );
    }
  };
  
  const handleSubmit = async () => {
    if (userAnswer.length === 0 || submissionResult) return;
    
    setSubmitting(true);
    try {
      const result = await api.submitAnswer(problemId, userAnswer);
      setSubmissionResult(result);
      addSubmission(result);
      api.addSubmission(result);
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setUserAnswer([]);
    setSubmissionResult(null);
  };
  
  const toggleFavorite = async () => {
    try {
      await api.toggleFavorite(problemId);
      toggleFavStore(problemId);
    } catch (error) {
      console.error('Toggle favorite failed:', error);
    }
  };
  
  const goToPrevious = () => {
    if (problemId > 1) {
      navigate(`/problems/${problemId - 1}`);
    }
  };
  
  const goToNext = () => {
    navigate(`/problems/${problemId + 1}`);
  };
  
  const getOptionStyle = (label: string) => {
    if (!submissionResult) {
      return cn(
        'border-border hover:border-primary/50 hover:bg-primary/5',
        userAnswer.includes(label) && 'border-primary bg-primary/10'
      );
    }
    
    const isCorrect = problem?.answer.includes(label);
    const isSelected = userAnswer.includes(label);
    
    if (isCorrect) {
      return 'border-success bg-success/10';
    }
    if (isSelected && !isCorrect) {
      return 'border-danger bg-danger/10';
    }
    return 'border-border opacity-60';
  };
  
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  
  if (!problem) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">题目不存在</p>
        <Link to="/problems" className="btn-primary">返回题库</Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link 
              to="/problems" 
              className="p-2 rounded-lg hover:bg-surface-light transition-colors text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-muted font-mono text-sm">#{problem.id}</span>
                <h1 className="text-xl font-semibold text-text-primary">
                  {problem.title}
                </h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium',
              problem.type === 'single' && 'bg-blue-500/10 text-blue-400',
              problem.type === 'multiple' && 'bg-purple-500/10 text-purple-400',
              problem.type === 'judge' && 'bg-amber-500/10 text-amber-400',
            )}>
              <BookOpen className="w-3.5 h-3.5" />
              {typeLabels[problem.type]}
            </span>
            <DifficultyBadge difficulty={problem.difficulty} />
            <span className="text-sm text-muted flex items-center gap-1">
              <Award className="w-4 h-4" />
              {problem.score} 分
            </span>
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-lg hover:bg-surface-light transition-colors"
            >
              {favorite ? (
                <Star className="w-5 h-5 text-warning fill-warning" />
              ) : (
                <StarOff className="w-5 h-5 text-muted hover:text-warning transition-colors" />
              )}
            </button>
            <div className="flex items-center border-l border-border pl-2">
              <button
                onClick={goToPrevious}
                disabled={problemId <= 1}
                className="p-2 rounded-lg hover:bg-surface-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-text-secondary" />
              </button>
              <button
                onClick={goToNext}
                className="p-2 rounded-lg hover:bg-surface-light transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-text-secondary border-transparent hover:text-text-primary'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {activeTab === 'description' && (
          <div className="animate-fade-in">
            <div className="flex flex-wrap gap-2 mb-6">
              {problem.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
            
            <div className="glass-card p-6 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">题目内容</h3>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {problem.content}
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              {problem.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleOptionClick(option.label)}
                  disabled={!!submissionResult}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border-2 transition-all',
                    'flex items-start gap-4',
                    getOptionStyle(option.label),
                    !submissionResult && 'cursor-pointer',
                    submissionResult && 'cursor-default'
                  )}
                >
                  <div className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm',
                    userAnswer.includes(option.label) && !submissionResult && 'border-primary bg-primary text-white',
                    !userAnswer.includes(option.label) && !submissionResult && 'border-border text-text-secondary',
                    submissionResult && problem.answer.includes(option.label) && 'border-success bg-success text-white',
                    submissionResult && userAnswer.includes(option.label) && !problem.answer.includes(option.label) && 'border-danger bg-danger text-white',
                    submissionResult && !userAnswer.includes(option.label) && !problem.answer.includes(option.label) && 'border-border/60 text-muted',
                  )}>
                    {option.label}
                  </div>
                  <span className={cn(
                    'flex-1 pt-1',
                    submissionResult && problem.answer.includes(option.label) && 'text-success',
                    submissionResult && userAnswer.includes(option.label) && !problem.answer.includes(option.label) && 'text-danger',
                    !submissionResult && 'text-text-primary'
                  )}>
                    {option.content}
                  </span>
                  {submissionResult && problem.answer.includes(option.label) && (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                  )}
                  {submissionResult && userAnswer.includes(option.label) && !problem.answer.includes(option.label) && (
                    <XCircle className="w-5 h-5 text-danger flex-shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
            
            {submissionResult && (
              <div className={cn(
                'glass-card p-6 mb-6 border-l-4',
                submissionResult.status === 'correct' ? 'border-l-success' : 'border-l-danger'
              )}>
                <div className="flex items-center gap-3 mb-4">
                  {submissionResult.status === 'correct' ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <XCircle className="w-6 h-6 text-danger" />
                  )}
                  <span className={cn(
                    'text-lg font-semibold',
                    submissionResult.status === 'correct' ? 'text-success' : 'text-danger'
                  )}>
                    {submissionResult.status === 'correct' ? '回答正确' : '回答错误'}
                  </span>
                  <span className="ml-auto text-text-secondary">
                    得分：<span className="font-semibold text-text-primary">{submissionResult.score}</span> / {problem.score}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-2 text-sm">
                  <span className="text-muted w-20 flex-shrink-0">你的答案：</span>
                  <span className="text-text-primary">
                    {userAnswer.length > 0 ? userAnswer.sort().join('、') : '未作答'}
                  </span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-muted w-20 flex-shrink-0">正确答案：</span>
                  <span className="text-success font-medium">
                    {problem.answer.sort().join('、')}
                  </span>
                </div>
              </div>
              
              {problem.explanation && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-text-primary mb-1">解析</p>
                      <p className="text-sm text-text-secondary">{problem.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}
            
            <div className="flex gap-3">
              {!submissionResult ? (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={userAnswer.length === 0 || submitting}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all',
                      userAnswer.length > 0 && !submitting
                        ? 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
                        : 'bg-surface-light text-muted cursor-not-allowed'
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        提交答案
                      </>
                    )}
                  </button>
                  {problem.type === 'multiple' && (
                    <p className="text-sm text-muted self-center">
                      多选题，请选择所有正确答案
                    </p>
                  )}
                </>
              ) : (
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleReset}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all bg-surface text-text-primary hover:bg-surface-light border border-border"
                  >
                    <RotateCcw className="w-5 h-5" />
                    重新作答
                  </button>
                  <button
                    onClick={goToNext}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
                  >
                    下一题
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'submissions' && (
          <div className="space-y-3 animate-fade-in">
            {submissions.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-text-secondary">暂无提交记录</p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {sub.status === 'correct' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-danger" />
                      )}
                      <span className={cn(
                        'font-medium',
                        sub.status === 'correct' ? 'text-success' : 'text-danger'
                      )}>
                        {sub.status === 'correct' ? '正确' : '错误'}
                      </span>
                    </div>
                    <span className="text-sm text-muted">
                      {formatTime(sub.submittedAt)}
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    你的答案：<span className="text-text-primary">{sub.userAnswer.sort().join('、')}</span>
                    <span className="mx-2 text-muted">·</span>
                    正确答案：<span className="text-success">{sub.correctAnswer.sort().join('、')}</span>
                    <span className="mx-2 text-muted">·</span>
                    得分：<span className="text-text-primary">{sub.score}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetail;
