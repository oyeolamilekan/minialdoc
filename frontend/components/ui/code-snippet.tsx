import React from 'react';

type SupportedLanguage = 'javascript' | 'python' | 'java' | 'ruby' | 'json' | 'curl';

interface CodeSnippetProps {
  /** The code to be displayed */
  code: string;
  /** Programming language for syntax highlighting */
  language: SupportedLanguage;
}

interface LanguageConfig {
  /** Color class for the language label */
  color: string;
  /** Keywords to highlight for the language */
  keywords: string[];
  /** Special syntax patterns for the language */
  patterns?: Array<{
    regex: RegExp;
    className: string;
  }>;
}

type LanguageConfigs = {
  [K in SupportedLanguage]: LanguageConfig;
};

const languageConfigs: LanguageConfigs = {
  javascript: {
    color: 'text-yellow-500',
    keywords: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'],
    patterns: [
      // String literals
      { regex: /'([^'\\]|\\.)*'/g, className: 'text-green-400' },
      { regex: /"([^"\\]|\\.)*"/g, className: 'text-green-400' },
      { regex: /`([^`\\]|\\.)*`/g, className: 'text-green-400' },
      // Variable declarations
      { regex: /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, className: 'text-blue-400' },
      // Function calls
      { regex: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, className: 'text-yellow-400' },
      // Numbers
      { regex: /\b\d+\.?\d*\b/g, className: 'text-purple-400' }
    ]
  },
  python: {
    color: 'text-blue-500',
    keywords: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'for', 'while'],
    patterns: [
      // String literals
      { regex: /'([^'\\]|\\.)*'/g, className: 'text-green-400' },
      { regex: /"([^"\\]|\\.)*"/g, className: 'text-green-400' },
      // Variable assignments
      { regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, className: 'text-blue-400' },
      // Function calls
      { regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, className: 'text-yellow-400' },
      // Numbers
      { regex: /\b\d+\.?\d*\b/g, className: 'text-purple-400' }
    ]
  },
  java: {
    color: 'text-orange-500',
    keywords: ['public', 'private', 'class', 'void', 'return', 'if', 'else', 'for', 'while'],
    patterns: [
      // String literals
      { regex: /"([^"\\]|\\.)*"/g, className: 'text-green-400' },
      // Variable declarations
      { regex: /\b(int|String|boolean|double|float)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, className: 'text-blue-400' },
      // Function calls
      { regex: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, className: 'text-yellow-400' },
      // Numbers
      { regex: /\b\d+\.?\d*\b/g, className: 'text-purple-400' }
    ]
  },
  ruby: {
    color: 'text-red-500',
    keywords: ['def', 'class', 'require', 'return', 'if', 'else', 'end', 'do'],
    patterns: [
      // String literals
      { regex: /'([^'\\]|\\.)*'/g, className: 'text-green-400' },
      { regex: /"([^"\\]|\\.)*"/g, className: 'text-green-400' },
      // Variable assignments
      { regex: /\b(@{1,2}[a-zA-Z_][a-zA-Z0-9_]*)/g, className: 'text-blue-400' },
      // Function calls
      { regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*[\(\{]/g, className: 'text-yellow-400' },
      // Numbers
      { regex: /\b\d+\.?\d*\b/g, className: 'text-purple-400' }
    ]
  },
  json: {
    color: 'text-blue-500',
    keywords: [],
    patterns: [
      { regex: /"([^"]+)"(?=\s*:)/g, className: 'text-purple-400' },
      { regex: /:\s*"([^"]+)"/g, className: 'text-green-400' },
      { regex: /:\s*(-?\d+\.?\d*)/g, className: 'text-blue-400' },
      { regex: /:\s*(true|false|null)/g, className: 'text-yellow-500' },
      { regex: /[{}\[\]]/g, className: 'text-gray-400' },
      { regex: /,$/gm, className: 'text-gray-400' }
    ]
  },
  curl: {
    color: 'text-green-500',
    keywords: ['curl', '-X', '--request', '-H', '--header', '-d', '--data'],
    patterns: [
      { regex: /(GET|POST|PUT|DELETE|PATCH)/g, className: 'text-blue-400' },
      { regex: /'([^']+)'/g, className: 'text-yellow-400' },
      { regex: /((http|https):\/\/[^\s]+)/g, className: 'text-green-400' },
      { regex: /-H\s+'([^']+)'/g, className: 'text-purple-400' },
      { regex: /-d\s+'([^']+)'/g, className: 'text-orange-400' }
    ]
  }
};

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code = '', language }) => {
  const formatLine = (line: string): React.ReactNode[] => {
    if (!line) return [<span key="empty" className="text-gray-300"></span>];

    const config = languageConfigs[language];
    let segments: Array<{ text: string; className?: string }> = [{ text: line }];

    try {
      // Apply patterns first if they exist
      if (config.patterns) {
        config.patterns.forEach(({ regex, className }) => {
          segments = segments.flatMap(segment => {
            if (!segment.className && segment.text) {
              const parts = segment.text.split(regex);
              if (parts.length > 1) {
                return parts.map((part, index) => {
                  const match = segment.text.match(regex)?.[Math.floor(index / 2)];
                  return {
                    text: index % 2 === 0 ? part : match || '',
                    className: index % 2 === 0 ? undefined : className
                  };
                }).filter(part => part.text);
              }
            }
            return [segment];
          });
        });
      }

      // Apply keyword highlighting
      if (config.keywords.length > 0) {
        segments = segments.flatMap(segment => {
          if (!segment.className && segment.text) {
            const words = segment.text.split(/(\b)/);
            return words.map(word => ({
              text: word,
              className: config.keywords.includes(word) ? 'text-purple-500' : undefined
            }));
          }
          return [segment];
        });
      }

      return segments.map((segment, index) => (
        <span key={index} className={segment.className || 'text-gray-300'}>
          {segment.text}
        </span>
      ));
    } catch (error) {
      console.error('Error formatting line:', error);
      return [<span key="error" className="text-gray-300">{line}</span>];
    }
  };

  const lines = (code || '').split('\n');
  const languageColor = languageConfigs[language]?.color || 'text-gray-500';

  return (
    <div className="w-full max-w-full overflow-hidden rounded-lg bg-gray-900 max-h-56">
      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-1 sm:py-2 bg-gray-800">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
        </div>
        <span className={`text-xs sm:text-sm font-mono ${languageColor}`}>
          {language || 'Text'}
        </span>
      </div>

      {/* Code Content */}
      <div className="relative p-2 sm:p-4">
        <pre className="overflow-x-auto max-w-full">
          <code className="block font-mono text-xs sm:text-sm md:text-base text-white">
            {lines.map((line, index) => (
              <div key={index} className="flex min-w-0">
                <span className="flex-shrink-0 w-6 sm:w-8 text-gray-500 select-none">
                  {index + 1}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all">
                  {formatLine(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};