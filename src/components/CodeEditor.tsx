import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, ChevronDown, Code2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  running?: boolean;
  submitting?: boolean;
  languages?: { value: string; label: string }[];
  onLanguageChange: (lang: string) => void;
}

const defaultLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
];

const CodeEditor = ({
  language,
  value,
  onChange,
  onRun,
  onSubmit,
  onReset,
  running = false,
  submitting = false,
  languages = defaultLanguages,
  onLanguageChange,
}: CodeEditorProps) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const editorRef = useRef<any>(null);
  
  const currentLang = languages.find(l => l.value === language) || languages[0];
  
  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-light hover:bg-border/50 transition-colors text-sm"
            >
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-text-primary">{currentLang.label}</span>
              <ChevronDown className={cn(
                'w-4 h-4 text-muted transition-transform',
                langMenuOpen && 'rotate-180'
              )} />
            </button>
            
            {langMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      onLanguageChange(lang.value);
                      setLangMenuOpen(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm hover:bg-surface-light transition-colors',
                      language === lang.value ? 'text-primary bg-primary/5' : 'text-text-secondary'
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-light transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">重置</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={running}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              running
                ? 'bg-surface-light text-muted cursor-not-allowed'
                : 'bg-surface-light text-text-primary hover:bg-border hover:text-primary'
            )}
          >
            <Play className="w-4 h-4" />
            <span>运行</span>
          </button>
          
          <button
            onClick={onSubmit}
            disabled={submitting}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              submitting
                ? 'bg-primary/50 text-slate-900/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-cyan-500 text-slate-900 hover:shadow-lg hover:shadow-primary/25'
            )}
          >
            <span>提交</span>
          </button>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language === 'typescript' ? 'typescript' : language}
          value={value}
          onChange={(v) => onChange(v || '')}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Menlo', monospace",
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'all',
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
