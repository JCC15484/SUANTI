import { useEffect, useState } from 'react';
import { 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Clock,
  Award,
  User,
  BookOpen
} from 'lucide-react';
import StatCard from '../components/StatCard';
import DifficultyBadge from '../components/DifficultyBadge';
import { useUserStore } from '../store/useUserStore';
import { api } from '../utils/api';
import type { SubmissionResult, QuestionType } from '../types';
import { cn } from '../lib/utils';

const typeLabels: Record<QuestionType, string> = {
  single: '单选题',
  multiple: '多选题',
  judge: '判断题',
};

const Profile = () => {
  const { progress, setProgress } = useUserStore();
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'correct' | 'wrong'>('all');
  const [totalProblems, setTotalProblems] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, submissionsRes, problemsRes] = await Promise.all([
          api.getUserProgress(),
          api.getUserSubmissions(),
          api.getProblems(),
        ]);
        setProgress(progressRes);
        setSubmissions(submissionsRes);
        setTotalProblems(problemsRes.total);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    
    fetchData();
  }, [setProgress]);
  
  const filteredSubmissions = submissions.filter(s => {
    if (activeTab === 'correct') return s.status === 'correct';
    if (activeTab === 'wrong') return s.status === 'wrong';
    return true;
  });
  
  const getStatusInfo = (status: SubmissionResult['status']) => {
    switch (status) {
      case 'correct':
        return { label: '正确', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' };
      case 'wrong':
        return { label: '错误', icon: XCircle, color: 'text-danger', bg: 'bg-danger/10' };
      default:
        return { label: '未知', icon: XCircle, color: 'text-muted', bg: 'bg-surface-light' };
    }
  };
  
  const easyTotal = Math.round(totalProblems * 0.5);
  const mediumTotal = Math.round(totalProblems * 0.35);
  const hardTotal = Math.round(totalProblems * 0.15);
  
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
              <User className="w-12 h-12 text-slate-900" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold font-display text-text-primary mb-1">
                刷题达人
              </h1>
              <p className="text-text-secondary mb-4">热爱学习，不断进步</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-warning" />
                  <span className="text-text-secondary">已解决 <span className="text-text-primary font-semibold">{progress?.totalSolved ?? 0}</span> 题</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-text-secondary">累计积分 <span className="text-text-primary font-semibold">{progress?.totalScore ?? 0}</span> 分</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-success" />
                  <span className="text-text-secondary">共提交 <span className="text-text-primary font-semibold">{submissions.length}</span> 次</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="总解题数"
            value={progress?.totalSolved ?? 0}
            subtitle={`/ ${totalProblems} 题`}
            icon={<Trophy className="w-10 h-10 text-primary" />}
            accent="primary"
          />
          <StatCard
            title="简单"
            value={progress?.easySolved ?? 0}
            subtitle={`/ ${easyTotal} 题`}
            icon={<Target className="w-10 h-10 text-success" />}
            accent="success"
          />
          <StatCard
            title="中等"
            value={progress?.mediumSolved ?? 0}
            subtitle={`/ ${mediumTotal} 题`}
            icon={<TrendingUp className="w-10 h-10 text-warning" />}
            accent="warning"
          />
          <StatCard
            title="困难"
            value={progress?.hardSolved ?? 0}
            subtitle={`/ ${hardTotal} 题`}
            icon={<Calendar className="w-10 h-10 text-danger" />}
            accent="danger"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-text-primary mb-6">刷题进度</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">简单难度</span>
                  <span className="text-success font-medium">
                    {progress?.easySolved ?? 0} / {easyTotal}
                  </span>
                </div>
                <div className="h-3 bg-surface-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(((progress?.easySolved ?? 0) / Math.max(easyTotal, 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">中等难度</span>
                  <span className="text-warning font-medium">
                    {progress?.mediumSolved ?? 0} / {mediumTotal}
                  </span>
                </div>
                <div className="h-3 bg-surface-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-warning to-amber-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(((progress?.mediumSolved ?? 0) / Math.max(mediumTotal, 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">困难难度</span>
                  <span className="text-danger font-medium">
                    {progress?.hardSolved ?? 0} / {hardTotal}
                  </span>
                </div>
                <div className="h-3 bg-surface-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-danger to-rose-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(((progress?.hardSolved ?? 0) / Math.max(hardTotal, 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-surface-light"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min(((progress?.totalSolved ?? 0) / Math.max(totalProblems, 1)) * 440, 440)} 440`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold gradient-text">
                    {Math.round(((progress?.totalSolved ?? 0) / Math.max(totalProblems, 1)) * 100)}%
                  </span>
                  <span className="text-sm text-muted">完成度</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">近期活动</h2>
            
            <div className="space-y-4">
              {submissions.slice(0, 5).map((sub, index) => {
                const statusInfo = getStatusInfo(sub.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div key={sub.id} className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', statusInfo.bg)}>
                      <StatusIcon className={cn('w-4 h-4', statusInfo.color)} />
                    </div>
                    <div>
                      <p className="text-sm text-text-primary">
                        第 #{sub.problemId} 题 {statusInfo.label}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(sub.submittedAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                );
              })}
              {submissions.length === 0 && (
                <p className="text-sm text-muted text-center py-4">暂无答题记录</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">提交记录</h2>
            
            <div className="flex gap-2">
              {[
                { value: 'all', label: '全部' },
                { value: 'correct', label: '正确' },
                { value: 'wrong', label: '错误' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value as typeof activeTab)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                    activeTab === tab.value
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-text-secondary hover:bg-surface-light'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-text-secondary">暂无提交记录</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubmissions.map((submission) => {
                const statusInfo = getStatusInfo(submission.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div 
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-surface/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn('p-2 rounded-lg', statusInfo.bg)}>
                        <StatusIcon className={cn('w-5 h-5', statusInfo.color)} />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          第 #{submission.problemId} 题
                        </p>
                        <p className="text-sm text-muted">
                          {new Date(submission.submittedAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className={cn('text-sm font-medium', statusInfo.color)}>
                        {statusInfo.label}
                      </span>
                      <span className="text-sm text-muted hidden sm:block">
                        得分：{submission.score}
                      </span>
                      <span className="text-sm text-muted hidden md:block">
                        答案：{submission.userAnswer.sort().join('、')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
