import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Trophy, 
  Users, 
  TrendingUp, 
  BookOpen,
  ChevronRight,
  Sparkles,
  Target,
  Brain,
  Award,
  BarChart3,
  FileText
} from 'lucide-react';
import ProblemCard from '../components/ProblemCard';
import StatCard from '../components/StatCard';
import type { QuestionListItem } from '../types';
import { api } from '../utils/api';
import { useUserStore } from '../store/useUserStore';

const Home = () => {
  const [problems, setProblems] = useState<QuestionListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { progress, setProgress } = useUserStore();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, progressRes] = await Promise.all([
          api.getProblems(),
          api.getUserProgress(),
        ]);
        setProblems(problemsRes.problems.slice(0, 6));
        setTotalCount(problemsRes.total);
        setProgress(progressRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [setProgress]);
  
  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-text-secondary">155 道精选题目 · 财务分析 + Python</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
              <span className="text-text-primary">智能刷题，</span>
              <br />
              <span className="gradient-text animate-gradient">高效备考提升</span>
            </h1>
            
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              精选财务分析与Python编程题目，支持单选、多选、判断多种题型。
              <br className="hidden md:block" />
              沉浸式刷题体验，让每一道题都算数。
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/problems" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center">
                <Zap className="w-5 h-5" />
                开始刷题
              </Link>
              <Link to="/exam" className="btn-secondary text-lg px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center border-primary/30 hover:border-primary/50">
                <FileText className="w-5 h-5 text-primary" />
                模拟考试
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="总题数"
              value={totalCount}
              subtitle="覆盖多种题型"
              icon={<BookOpen className="w-10 h-10 text-primary" />}
              accent="primary"
            />
            <StatCard
              title="已解决"
              value={progress?.totalSolved ?? 0}
              subtitle="继续加油"
              icon={<Trophy className="w-10 h-10 text-success" />}
              accent="success"
            />
            <StatCard
              title="总积分"
              value={progress?.totalScore ?? 0}
              subtitle="累计得分"
              icon={<Award className="w-10 h-10 text-warning" />}
              accent="warning"
            />
            <StatCard
              title="正确率"
              value={progress && progress.submissions.length > 0 
                ? `${Math.round((progress.solvedProblems.length / Math.max(progress.submissions.length, 1)) * 100)}%`
                : '--'}
              subtitle="答题正确率"
              icon={<TrendingUp className="w-10 h-10 text-primary" />}
              accent="primary"
            />
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold font-display text-text-primary mb-2">
                精选题目
              </h2>
              <p className="text-text-secondary">从题库中精选，开始你的刷题之旅</p>
            </div>
            <Link 
              to="/problems" 
              className="hidden md:flex items-center gap-2 text-primary hover:text-cyan-300 transition-colors"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-5 h-44 animate-pulse">
                  <div className="h-4 w-20 bg-surface-light rounded mb-3" />
                  <div className="h-6 w-3/4 bg-surface-light rounded mb-4" />
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-surface-light rounded" />
                    <div className="h-6 w-16 bg-surface-light rounded" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-6 w-16 bg-surface-light rounded-full" />
                    <div className="h-4 w-12 bg-surface-light rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((problem, index) => (
                <ProblemCard 
                  key={problem.id} 
                  problem={problem} 
                  delay={index * 100}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <section className="py-16 bg-surface/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-text-primary mb-2">
              题型分类
            </h2>
            <p className="text-text-secondary">按题型筛选，针对性练习</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/problems?type=single"
              className="glass-card p-8 hover:scale-105 hover:-translate-y-1 transition-all duration-300 
                         text-center bg-gradient-to-br from-blue-500/10 to-transparent group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-blue-400 transition-colors">
                单选题
              </h3>
              <p className="text-sm text-muted">从四个选项中选择唯一正确答案</p>
            </Link>
            
            <Link
              to="/problems?type=multiple"
              className="glass-card p-8 hover:scale-105 hover:-translate-y-1 transition-all duration-300 
                         text-center bg-gradient-to-br from-purple-500/10 to-transparent group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-purple-400 transition-colors">
                多选题
              </h3>
              <p className="text-sm text-muted">从多个选项中选择所有正确答案</p>
            </Link>
            
            <Link
              to="/problems?type=judge"
              className="glass-card p-8 hover:scale-105 hover:-translate-y-1 transition-all duration-300 
                         text-center bg-gradient-to-br from-amber-500/10 to-transparent group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-amber-400 transition-colors">
                判断题
              </h3>
              <p className="text-sm text-muted">判断题目描述的正确与否</p>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-text-primary mb-2">
              为什么选择我们
            </h2>
            <p className="text-text-secondary">打造极致的刷题体验</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">精选题库</h3>
              <p className="text-text-secondary">
                精选财务分析与Python编程题目，覆盖核心知识点，助力高效备考。
              </p>
            </div>
            
            <div className="glass-card p-8 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">即时反馈</h3>
              <p className="text-text-secondary">
                提交答案后即时显示结果，清晰标注对错，附带详细解析。
              </p>
            </div>
            
            <div className="glass-card p-8 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-warning" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">进度跟踪</h3>
              <p className="text-text-secondary">
                实时记录刷题进度和得分，支持题目收藏，方便复习回顾。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-slate-900" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">智刷题</span>
            </div>
            <p className="text-muted text-sm">
              © 2024 智刷题. 让学习更有力量。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
