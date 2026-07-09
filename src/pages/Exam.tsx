import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Shuffle,
  FileText,
  Trophy,
  RotateCcw,
  AlertCircle,
  Grid3x3,
  Award,
  Target,
  Minus,
  Plus,
} from 'lucide-react';
import type { Question, QuestionType } from '../types';
import { api } from '../utils/api';
import { cn } from '../lib/utils';

type ExamState = 'setup' | 'taking' | 'result';

const typeLabels: Record<QuestionType, string> = {
  single: '单选题',
  multiple: '多选题',
  judge: '判断题',
};

const typeColors: Record<QuestionType, string> = {
  single: 'bg-blue-500/10 text-blue-400',
  multiple: 'bg-purple-500/10 text-purple-400',
  judge: 'bg-amber-500/10 text-amber-400',
};

// 打乱数组
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 打乱选项并重新映射答案
function shuffleOptions(question: Question): Question {
  const oldOptions = [...question.options];
  const shuffled = shuffleArray(oldOptions);
  const newLabels = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, shuffled.length);
  const labelMap: Record<string, string> = {};
  shuffled.forEach((opt, i) => {
    labelMap[opt.label] = newLabels[i];
  });
  const newOptions = shuffled.map((opt, i) => ({
    ...opt,
    label: newLabels[i],
  }));
  const newAnswer = question.answer.map(a => labelMap[a]);
  return { ...question, options: newOptions, answer: newAnswer };
}

const Exam = () => {
  const [examState, setExamState] = useState<ExamState>('setup');
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [questionCount, setQuestionCount] = useState(50);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [distribution, setDistribution] = useState({ single: 0, multiple: 0, judge: 0 });

  // 计时器
  useEffect(() => {
    if (examState !== 'taking') return;
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [examState, startTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startExam = async () => {
    setLoading(true);
    try {
      const res = await api.getExamQuestions(questionCount);
      let qs = res.questions;
      if (shuffleEnabled) {
        qs = qs.map(shuffleOptions);
      }
      setQuestions(qs);
      setDistribution(res.distribution);
      setAnswers({});
      setCurrentIndex(0);
      setStartTime(Date.now());
      setElapsedTime(0);
      setExamState('taking');
    } catch (error) {
      console.error('Failed to start exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (questionId: number, label: string, type: QuestionType) => {
    if (type === 'single' || type === 'judge') {
      setAnswers(prev => ({ ...prev, [questionId]: [label] }));
    } else {
      setAnswers(prev => {
        const current = prev[questionId] || [];
        const updated = current.includes(label)
          ? current.filter(l => l !== label)
          : [...current, label];
        return { ...prev, [questionId]: updated };
      });
    }
  };

  const answeredCount = Object.values(answers).filter(a => a.length > 0).length;
  const currentQuestion = questions[currentIndex];

  // 计算题型分区信息
  const sections = questions.length > 0 ? (() => {
    let singleEnd = 0;
    let multipleEnd = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].type === 'single') singleEnd = i + 1;
    }
    for (let i = singleEnd; i < questions.length; i++) {
      if (questions[i].type === 'multiple') multipleEnd = i + 1;
    }
    return {
      single: { start: 0, end: singleEnd, count: singleEnd },
      multiple: { start: singleEnd, end: multipleEnd, count: multipleEnd - singleEnd },
      judge: { start: multipleEnd, end: questions.length, count: questions.length - multipleEnd },
    };
  })() : null;

  // 结果计算
  const examResults = examState === 'result' ? (() => {
    let correctCount = 0;
    let wrongCount = 0;
    let totalScore = 0;
    let maxScore = 0;
    const details: { question: Question; userAnswer: string[]; isCorrect: boolean }[] = [];
    questions.forEach(q => {
      maxScore += q.score;
      const userAns = answers[q.id] || [];
      const isCorrect = userAns.length > 0 &&
        userAns.length === q.answer.length &&
        userAns.every(a => q.answer.includes(a));
      if (isCorrect) {
        correctCount++;
        totalScore += q.score;
      } else {
        wrongCount++;
      }
      details.push({ question: q, userAnswer: userAns, isCorrect });
    });
    return { correctCount, wrongCount, totalScore, maxScore, details };
  })() : null;

  const handleSubmit = () => {
    setExamState('result');
  };

  const restartExam = () => {
    setExamState('setup');
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setElapsedTime(0);
  };

  // ===== 设置页 =====
  if (examState === 'setup') {
    // 预估题型分布
    const estSingle = Math.round(questionCount * 0.4);
    const estMultiple = Math.round(questionCount * 0.3);
    const estJudge = questionCount - estSingle - estMultiple;

    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="glass-card p-8 md:p-12 max-w-2xl w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
            <FileText className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold font-display gradient-text mb-3">模拟考试</h1>
          <p className="text-text-secondary mb-8">
            随机抽取题目，按 单选 → 多选 → 判断 顺序作答
          </p>

          {/* 题数选择 */}
          <div className="mb-6">
            <label className="text-sm font-medium text-text-primary block mb-3">题目数量</label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuestionCount(Math.max(1, questionCount - 5))}
                className="p-2 rounded-lg bg-surface border border-border hover:bg-surface-light transition-colors"
              >
                <Minus className="w-5 h-5 text-text-secondary" />
              </button>
              <div className="flex items-center gap-1">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={questionCount}
                  onChange={e => setQuestionCount(parseInt(e.target.value))}
                  className="w-48 accent-primary"
                />
              </div>
              <button
                onClick={() => setQuestionCount(Math.min(100, questionCount + 5))}
                className="p-2 rounded-lg bg-surface border border-border hover:bg-surface-light transition-colors"
              >
                <Plus className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            <div className="text-3xl font-bold text-primary mt-2">{questionCount}</div>
            <div className="text-xs text-muted mt-1">道题（1 ~ 100）</div>
          </div>

          {/* 题型分布预览 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500/10 rounded-xl p-3">
              <div className="text-xl font-bold text-blue-400">{estSingle}</div>
              <div className="text-xs text-muted">单选题 40%</div>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-3">
              <div className="text-xl font-bold text-purple-400">{estMultiple}</div>
              <div className="text-xs text-muted">多选题 30%</div>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-3">
              <div className="text-xl font-bold text-amber-400">{estJudge}</div>
              <div className="text-xs text-muted">判断题 30%</div>
            </div>
          </div>

          {/* 选项乱序开关 */}
          <button
            onClick={() => setShuffleEnabled(!shuffleEnabled)}
            className={cn(
              'w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all mb-8 cursor-pointer',
              shuffleEnabled
                ? 'border-primary bg-primary/10'
                : 'border-border bg-surface hover:border-primary/30'
            )}
          >
            <div className="flex items-center gap-3">
              <Shuffle className={cn('w-5 h-5', shuffleEnabled ? 'text-primary' : 'text-muted')} />
              <div className="text-left">
                <div className="font-medium text-text-primary">选项乱序</div>
                <div className="text-xs text-muted">打乱每道题的选项顺序</div>
              </div>
            </div>
            <div className={cn(
              'w-12 h-6 rounded-full transition-colors relative',
              shuffleEnabled ? 'bg-primary' : 'bg-border'
            )}>
              <div className={cn(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                shuffleEnabled ? 'translate-x-6' : 'translate-x-0.5'
              )} />
            </div>
          </button>

          <button
            onClick={startExam}
            disabled={loading}
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                加载中...
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                开始考试
              </>
            )}
          </button>

          <Link to="/problems" className="inline-block mt-4 text-sm text-muted hover:text-primary transition-colors">
            返回题库
          </Link>
        </div>
      </div>
    );
  }

  // ===== 结果页 =====
  if (examState === 'result' && examResults) {
    const { correctCount, wrongCount, totalScore, maxScore, details } = examResults;
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const passed = accuracy >= 60;

    // 按题型分组统计
    const singleDetails = details.filter(d => d.question.type === 'single');
    const multipleDetails = details.filter(d => d.question.type === 'multiple');
    const judgeDetails = details.filter(d => d.question.type === 'judge');
    const singleCorrect = singleDetails.filter(d => d.isCorrect).length;
    const multipleCorrect = multipleDetails.filter(d => d.isCorrect).length;
    const judgeCorrect = judgeDetails.filter(d => d.isCorrect).length;

    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 成绩卡片 */}
          <div className="glass-card p-8 mb-6 text-center animate-fade-in-up">
            <div className={cn(
              'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center',
              passed ? 'bg-success/20' : 'bg-danger/20'
            )}>
              {passed ? (
                <Trophy className="w-10 h-10 text-success" />
              ) : (
                <AlertCircle className="w-10 h-10 text-danger" />
              )}
            </div>
            <h1 className="text-4xl font-bold font-display mb-2">
              <span className={passed ? 'text-success' : 'text-danger'}>
                {passed ? '恭喜通过' : '继续努力'}
              </span>
            </h1>
            <div className="flex items-center justify-center gap-8 mt-6">
              <div>
                <div className="text-3xl font-bold text-text-primary">{totalScore}</div>
                <div className="text-sm text-muted">总分 / {maxScore.toFixed(1)}</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-success">{correctCount}</div>
                <div className="text-sm text-muted">答对</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-danger">{wrongCount}</div>
                <div className="text-sm text-muted">答错</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">{accuracy}%</div>
                <div className="text-sm text-muted">正确率</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              用时 {formatTime(elapsedTime)}
            </div>
          </div>

          {/* 题型得分统计 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-4 text-center">
              <div className="text-xs text-blue-400 mb-1">单选题</div>
              <div className="text-lg font-bold text-text-primary">{singleCorrect} / {singleDetails.length}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-xs text-purple-400 mb-1">多选题</div>
              <div className="text-lg font-bold text-text-primary">{multipleCorrect} / {multipleDetails.length}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-xs text-amber-400 mb-1">判断题</div>
              <div className="text-lg font-bold text-text-primary">{judgeCorrect} / {judgeDetails.length}</div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 mb-6">
            <button onClick={restartExam} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
              <RotateCcw className="w-5 h-5" />
              再考一次
            </button>
            <Link to="/problems" className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3">
              <FileText className="w-5 h-5" />
              返回题库
            </Link>
          </div>

          {/* 题目详情 */}
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <Grid3x3 className="w-5 h-5 text-primary" />
            题目详情
          </h2>
          <div className="space-y-4">
            {details.map(({ question, userAnswer, isCorrect }, idx) => (
              <div
                key={question.id}
                className={cn(
                  'glass-card p-5 border-l-4',
                  isCorrect ? 'border-l-success' : 'border-l-danger'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-danger" />
                    )}
                    <span className="text-muted font-mono text-sm">第 {idx + 1} 题</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded', typeColors[question.type])}>
                      {typeLabels[question.type]}
                    </span>
                  </div>
                  <span className={cn(
                    'text-sm font-medium',
                    isCorrect ? 'text-success' : 'text-danger'
                  )}>
                    {isCorrect ? `+${question.score}` : '0'} 分
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-3 whitespace-pre-line">{question.content}</p>
                <div className="space-y-1.5 mb-3">
                  {question.options.map(opt => {
                    const isCorrectOpt = question.answer.includes(opt.label);
                    const isUserOpt = userAnswer.includes(opt.label);
                    return (
                      <div
                        key={opt.label}
                        className={cn(
                          'flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg',
                          isCorrectOpt && 'bg-success/10 text-success',
                          isUserOpt && !isCorrectOpt && 'bg-danger/10 text-danger',
                          !isCorrectOpt && !isUserOpt && 'text-muted'
                        )}
                      >
                        <span className="font-mono w-5">{opt.label}.</span>
                        <span className="flex-1">{opt.content}</span>
                        {isCorrectOpt && <CheckCircle className="w-4 h-4" />}
                        {isUserOpt && !isCorrectOpt && <XCircle className="w-4 h-4" />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 text-sm pt-2 border-t border-border/50">
                  <span className="text-muted">
                    你的答案：
                    <span className={isCorrect ? 'text-success' : 'text-danger'}>
                      {userAnswer.length > 0 ? userAnswer.sort().join('、') : '未作答'}
                    </span>
                  </span>
                  <span className="text-muted">
                    正确答案：
                    <span className="text-success">{question.answer.sort().join('、')}</span>
                  </span>
                </div>
                {question.explanation && (
                  <div className="mt-2 pt-2 border-t border-border/50 flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{question.explanation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== 答题页 =====
  if (!currentQuestion) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion.id] || [];

  const getOptionStyle = (label: string) => {
    const isSelected = currentAnswer.includes(label);
    if (isSelected) return 'border-primary bg-primary/10';
    return 'border-border hover:border-primary/50 hover:bg-primary/5';
  };

  // 当前题型分区信息
  const currentSection = sections ? (() => {
    if (currentIndex < sections.single.end) return { type: 'single' as QuestionType, label: '单选题', color: 'text-blue-400' };
    if (currentIndex < sections.multiple.end) return { type: 'multiple' as QuestionType, label: '多选题', color: 'text-purple-400' };
    return { type: 'judge' as QuestionType, label: '判断题', color: 'text-amber-400' };
  })() : null;

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        {/* 顶部状态栏 */}
        <div className="glass-card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-semibold text-text-primary">模拟考试</span>
            </div>
            {currentSection && (
              <span className={cn('text-sm font-medium', currentSection.color)}>
                {currentSection.label}
              </span>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted" />
              <span className="font-mono text-text-secondary">{formatTime(elapsedTime)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">
              已答 <span className="font-bold text-primary">{answeredCount}</span> / {questions.length}
            </span>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
              title="题号导航"
            >
              <Grid3x3 className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* 进度条 */}
        <div className="h-1.5 bg-surface rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* 题号导航网格 - 按题型分区 */}
        {showGrid && sections && (
          <div className="glass-card p-4 mb-4 animate-fade-in space-y-3">
            {([
              { key: 'single' as const, label: '单选题', range: sections.single, color: 'bg-blue-500', text: 'text-blue-400' },
              { key: 'multiple' as const, label: '多选题', range: sections.multiple, color: 'bg-purple-500', text: 'text-purple-400' },
              { key: 'judge' as const, label: '判断题', range: sections.judge, color: 'bg-amber-500', text: 'text-amber-400' },
            ] as const).filter(s => s.range.count > 0).map(section => (
              <div key={section.key}>
                <div className={cn('text-xs font-medium mb-2', section.text)}>
                  {section.label}（{section.range.count} 题）
                </div>
                <div className="grid grid-cols-10 sm:grid-cols-13 gap-2">
                  {questions.slice(section.range.start, section.range.end).map((q, i) => {
                    const globalIdx = section.range.start + i;
                    const ans = answers[q.id] || [];
                    const hasAns = ans.length > 0;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(globalIdx)}
                        className={cn(
                          'w-8 h-8 rounded-lg text-xs font-medium transition-all',
                          globalIdx === currentIndex && 'ring-2 ring-primary',
                          hasAns
                            ? `${section.color} text-white`
                            : 'bg-surface text-muted hover:bg-surface-light'
                        )}
                      >
                        {globalIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 题目内容 */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold gradient-text font-mono">
                {currentIndex + 1}
              </span>
              <span className={cn('text-xs px-2 py-1 rounded', typeColors[currentQuestion.type])}>
                {typeLabels[currentQuestion.type]}
              </span>
              <span className="text-xs text-muted">{currentQuestion.score} 分</span>
            </div>
            {currentQuestion.type === 'multiple' && (
              <span className="text-xs text-muted">多选题，选择所有正确答案</span>
            )}
          </div>

          <p className="text-text-primary leading-relaxed whitespace-pre-line mb-6">
            {currentQuestion.content}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <button
                key={option.label}
                onClick={() => handleOptionClick(currentQuestion.id, option.label, currentQuestion.type)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 cursor-pointer',
                  getOptionStyle(option.label)
                )}
              >
                <div className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-colors',
                  currentAnswer.includes(option.label)
                    ? 'border-primary bg-primary text-white'
                    : 'border-border text-text-secondary'
                )}>
                  {option.label}
                </div>
                <span className="flex-1 pt-1 text-text-primary">{option.content}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface border border-border text-text-secondary hover:bg-surface-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            上一题
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <Send className="w-5 h-5" />
              交卷
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              下一题
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 最后一题提示 */}
        {currentIndex === questions.length - 1 && answeredCount < questions.length && (
          <div className="mt-4 text-center text-sm text-warning flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            还有 {questions.length - answeredCount} 道题未作答
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;
