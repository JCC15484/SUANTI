import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, Circle, Star, BookOpen } from 'lucide-react';
import type { QuestionListItem, QuestionType } from '../types';
import DifficultyBadge from './DifficultyBadge';
import TagBadge from './TagBadge';
import { cn } from '../lib/utils';
import { useUserStore } from '../store/useUserStore';

const typeLabels: Record<QuestionType, string> = {
  single: '单选',
  multiple: '多选',
  judge: '判断',
};

interface ProblemCardProps {
  problem: QuestionListItem;
  delay?: number;
}

const ProblemCard = ({ problem, delay = 0 }: ProblemCardProps) => {
  const { isSolved, isFavorite } = useUserStore();
  const solved = isSolved(problem.id);
  const favorite = isFavorite(problem.id);
  
  const StatusIcon = solved ? CheckCircle : Circle;
  
  return (
    <Link
      to={`/problems/${problem.id}`}
      className="glass-card glow-border p-5 hover:scale-[1.02] hover:-translate-y-1 
                 transition-all duration-300 group block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-muted text-sm font-mono">#{problem.id}</span>
          <StatusIcon className={cn(
            'w-5 h-5',
            solved ? 'text-success' : 'text-muted'
          )} />
        </div>
        {favorite && (
          <Star className="w-4 h-4 text-warning fill-warning" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors line-clamp-2 h-14">
        {problem.title}
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {problem.tags.slice(0, 2).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
        {problem.tags.length > 2 && (
          <span className="text-xs text-muted self-center">+{problem.tags.length - 2}</span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium',
            problem.type === 'single' && 'bg-blue-500/10 text-blue-400',
            problem.type === 'multiple' && 'bg-purple-500/10 text-purple-400',
            problem.type === 'judge' && 'bg-amber-500/10 text-amber-400',
          )}>
            <BookOpen className="w-3 h-3" />
            {typeLabels[problem.type]}
          </span>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted group-hover:text-text-secondary transition-colors">
          <span>{problem.score}分</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default ProblemCard;
