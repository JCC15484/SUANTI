import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, CheckCircle, Circle, ChevronRight, List, LayoutGrid, BookOpen } from 'lucide-react';
import DifficultyBadge from '../components/DifficultyBadge';
import TagBadge from '../components/TagBadge';
import ProblemCard from '../components/ProblemCard';
import type { QuestionListItem, Difficulty, QuestionType } from '../types';
import { api } from '../utils/api';
import { cn } from '../lib/utils';
import { useUserStore } from '../store/useUserStore';

const typeLabels: Record<QuestionType, string> = {
  single: '单选题',
  multiple: '多选题',
  judge: '判断题',
};

const Problems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [problems, setProblems] = useState<QuestionListItem[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const difficulty = searchParams.get('difficulty') || 'all';
  const tag = searchParams.get('tag') || 'all';
  const type = searchParams.get('type') || 'all';
  const search = searchParams.get('search') || '';
  
  const { isSolved } = useUserStore();
  
  useEffect(() => {
    setSearchInput(search);
  }, [search]);
  
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const res = await api.getProblems({
          difficulty: difficulty === 'all' ? undefined : difficulty,
          tag: tag === 'all' ? undefined : tag,
          type: type === 'all' ? undefined : type,
          search: search || undefined,
        });
        setProblems(res.problems);
        setAllTags(res.allTags);
        setAllTypes(res.allTypes || ['single', 'multiple', 'judge']);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblems();
  }, [difficulty, tag, type, search]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchInput) {
        prev.set('search', searchInput);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };
  
  const setDifficulty = (d: string) => {
    setSearchParams(prev => {
      if (d === 'all') {
        prev.delete('difficulty');
      } else {
        prev.set('difficulty', d);
      }
      return prev;
    });
  };
  
  const setType = (t: string) => {
    setSearchParams(prev => {
      if (t === 'all') {
        prev.delete('type');
      } else {
        prev.set('type', t);
      }
      return prev;
    });
  };
  
  const setTag = (t: string) => {
    setSearchParams(prev => {
      if (t === 'all') {
        prev.delete('tag');
      } else {
        prev.set('tag', t);
      }
      return prev;
    });
  };
  
  const difficultyOptions = [
    { value: 'all', label: '全部' },
    { value: 'easy', label: '简单' },
    { value: 'medium', label: '中等' },
    { value: 'hard', label: '困难' },
  ];
  
  const typeOptions = [
    { value: 'all', label: '全部题型' },
    { value: 'single', label: '单选题' },
    { value: 'multiple', label: '多选题' },
    { value: 'judge', label: '判断题' },
  ];
  
  const easyCount = useMemo(() => problems.filter(p => p.difficulty === 'easy').length, [problems]);
  const mediumCount = useMemo(() => problems.filter(p => p.difficulty === 'medium').length, [problems]);
  const hardCount = useMemo(() => problems.filter(p => p.difficulty === 'hard').length, [problems]);
  const singleCount = useMemo(() => problems.filter(p => p.type === 'single').length, [problems]);
  const multipleCount = useMemo(() => problems.filter(p => p.type === 'multiple').length, [problems]);
  const judgeCount = useMemo(() => problems.filter(p => p.type === 'judge').length, [problems]);
  
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-text-primary mb-2">
            题库
          </h1>
          <p className="text-text-secondary">
            共 {problems.length} 道题目 · 简单 {easyCount} · 中等 {mediumCount} · 困难 {hardCount}
          </p>
          <p className="text-text-secondary text-sm mt-1">
            单选 {singleCount} · 多选 {multipleCount} · 判断 {judgeCount}
          </p>
        </div>
        
        <div className="glass-card p-4 mb-6 sticky top-16 z-30">
          <div className="flex flex-col lg:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="搜索题目名称或编号..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border
                             focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                             transition-all placeholder:text-muted text-text-primary"
                />
              </div>
            </form>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted flex-shrink-0" />
              <div className="flex gap-1 flex-wrap">
                {difficultyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficulty(opt.value)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      difficulty === opt.value
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'bg-surface text-text-secondary border border-transparent hover:bg-surface-light'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' ? 'bg-surface-light text-primary' : 'text-muted hover:text-text-secondary'
                )}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' ? 'bg-surface-light text-primary' : 'text-muted hover:text-text-secondary'
                )}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted mr-2">题型：</span>
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-all',
                  type === opt.value
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-surface text-text-secondary border border-transparent hover:bg-surface-light'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted mr-2">标签：</span>
            <button
              onClick={() => setTag('all')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                tag === 'all'
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-surface text-text-secondary border border-transparent hover:bg-surface-light'
              )}
            >
              全部
            </button>
            {allTags.slice(0, 20).map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-all',
                  tag === t
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-surface text-text-secondary border border-transparent hover:bg-surface-light'
                )}
              >
                {t}
              </button>
            ))}
            {allTags.length > 20 && (
              <span className="text-xs text-muted px-2 py-1">+{allTags.length - 20} 更多</span>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="glass-card overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-4 border-b border-border/50 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-8 bg-surface-light rounded" />
                  <div className="h-5 flex-1 bg-surface-light rounded" />
                  <div className="h-6 w-16 bg-surface-light rounded-full" />
                  <div className="h-4 w-16 bg-surface-light rounded hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'list' ? (
          <div className="glass-card overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-surface/50 border-b border-border/50 text-sm font-medium text-muted">
              <div className="col-span-1">状态</div>
              <div className="col-span-1">编号</div>
              <div className="col-span-5">题目</div>
              <div className="col-span-2">题型</div>
              <div className="col-span-2">难度</div>
              <div className="col-span-1 text-right">操作</div>
            </div>
            
            {problems.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-text-secondary">没有找到匹配的题目</p>
              </div>
            ) : (
              problems.map((problem, index) => {
                const solved = isSolved(problem.id);
                return (
                  <Link
                    key={problem.id}
                    to={`/problems/${problem.id}`}
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border/30 
                               hover:bg-surface/50 transition-colors items-center group"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="col-span-1">
                      {solved ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted" />
                      )}
                    </div>
                    <div className="col-span-1 text-muted font-mono text-sm">
                      #{problem.id}
                    </div>
                    <div className="col-span-10 md:col-span-5">
                      <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors">
                        {problem.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1 md:hidden">
                        {problem.tags.slice(0, 2).map((t) => (
                          <TagBadge key={t} tag={t} />
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2 hidden md:block">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium',
                        problem.type === 'single' && 'bg-blue-500/10 text-blue-400',
                        problem.type === 'multiple' && 'bg-purple-500/10 text-purple-400',
                        problem.type === 'judge' && 'bg-amber-500/10 text-amber-400',
                      )}>
                        <BookOpen className="w-3 h-3" />
                        {typeLabels[problem.type]}
                      </span>
                    </div>
                    <div className="col-span-2 hidden md:block">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </div>
                    <div className="col-span-1 text-right hidden md:block">
                      <ChevronRight className="w-5 h-5 text-muted ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <ProblemCard 
                key={problem.id} 
                problem={problem as any} 
                delay={index * 50}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
