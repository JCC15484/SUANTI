import type { Difficulty } from '../types';
import { cn } from '../lib/utils';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const difficultyConfig = {
  easy: {
    label: '简单',
    className: 'bg-success/10 text-success border-success/20',
  },
  medium: {
    label: '中等',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  hard: {
    label: '困难',
    className: 'bg-danger/10 text-danger border-danger/20',
  },
};

const DifficultyBadge = ({ difficulty, className }: DifficultyBadgeProps) => {
  const config = difficultyConfig[difficulty];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
};

export default DifficultyBadge;
