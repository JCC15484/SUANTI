import { Link, useLocation } from 'react-router-dom';
import { Brain, BookOpen, FileText, Trophy, User, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { path: '/', label: '首页', icon: Brain },
    { path: '/problems', label: '题库', icon: BookOpen },
    { path: '/exam', label: '考试', icon: FileText },
    { path: '/profile', label: '我的', icon: User },
  ];
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6 text-slate-900" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">智刷题</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'nav-link flex items-center gap-2',
                isActive(link.path) && 'nav-link-active'
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="搜索题目..."
              className="w-64 pl-10 pr-4 py-2 rounded-xl bg-surface border border-border text-sm
                         focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                         transition-all placeholder:text-muted"
            />
          </div>
          <Link to="/profile" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:border-primary/30 transition-colors">
            <User className="w-5 h-5 text-text-secondary" />
          </Link>
        </div>
        
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-border/50 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'nav-link flex items-center gap-3 py-3',
                  isActive(link.path) && 'nav-link-active'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
