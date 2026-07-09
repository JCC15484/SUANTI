import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  accent?: 'primary' | 'success' | 'warning' | 'danger';
}

const accentStyles = {
  primary: 'from-primary/20 to-transparent border-primary/20',
  success: 'from-success/20 to-transparent border-success/20',
  warning: 'from-warning/20 to-transparent border-warning/20',
  danger: 'from-danger/20 to-transparent border-danger/20',
};

const StatCard = ({ title, value, subtitle, icon, className, accent = 'primary' }: StatCardProps) => {
  return (
    <div className={cn(
      'glass-card p-6 relative overflow-hidden',
      'bg-gradient-to-br',
      accentStyles[accent],
      className
    )}>
      {icon && (
        <div className="absolute top-4 right-4 opacity-30">
          {icon}
        </div>
      )}
      <p className="text-text-secondary text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold font-display text-text-primary mb-1">{value}</p>
      {subtitle && (
        <p className="text-muted text-sm">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
