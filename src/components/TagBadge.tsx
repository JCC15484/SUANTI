import { cn } from '../lib/utils';

interface TagBadgeProps {
  tag: string;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

const TagBadge = ({ tag, className, onClick, active }: TagBadgeProps) => {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium',
        'bg-surface text-text-secondary border border-border',
        onClick && 'cursor-pointer hover:border-primary/50 hover:text-primary transition-colors',
        active && 'bg-primary/10 text-primary border-primary/30',
        className
      )}
    >
      {tag}
    </span>
  );
};

export default TagBadge;
