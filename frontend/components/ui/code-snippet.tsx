import React, { useMemo } from 'react';

type SupportedLanguage = 'javascript' | 'python' | 'java' | 'ruby' | 'json' | 'curl';

interface CodeSnippetProps {
  /** The code to be displayed */
  code: string;
  /** Programming language for syntax highlighting */
  language: SupportedLanguage;
}

interface Token {
  text: string;
  type: 'keyword' | 'string' | 'number' | 'function' | 'variable' | 'operator' | 'comment' | 'plain';
}

interface SyntaxTheme {
  keyword: string;
  string: string;
  number: string;
  function: string;
  variable: string;
  operator: string;
  comment: string;
  plain: string;
}

const theme: SyntaxTheme = {
  keyword: 'text-[#FF7B72]',    // Red for keywords
  string: 'text-[#A5D6FF]',     // Light blue for strings
  number: 'text-[#79C0FF]',     // Blue for numbers
  function: 'text-[#D2A8FF]',   // Purple for functions
  variable: 'text-[#FFA657]',   // Orange for variables
  operator: 'text-[#FF7B72]',   // Red for operators
  comment: 'text-[#8B949E]',    // Gray for comments
  plain: 'text-[#E6EDF3]'       // Default text color
};

const languageConfigs = {
  javascript: {
    color: 'text-[#F1E05A]',
    tokenize: (code: string): Token[] => {
      const tokens: Token[] = [];
      let current = 0;

      while (current < code.length) {
        const char = code[current];

        // Handle strings
        if (char === '"' || char === "'" || char === '`') {
          let value = char;
          current++;
          while (current < code.length && code[current] !== char) {
            value += code[current];
            current++;
          }
          value += code[current] || '';
          current++;
          tokens.push({ text: value, type: 'string' });
          continue;
        }

        // Handle numbers
        const number = /^-?\d+(\.\d+)?/;
        const numberMatch = code.slice(current).match(number);
        if (numberMatch) {
          tokens.push({ text: numberMatch[0], type: 'number' });
          current += numberMatch[0].length;
          continue;
        }

        // Handle keywords
        const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'];
        const word = /^[a-zA-Z_$][\w$]*/;
        const wordMatch = code.slice(current).match(word);
        if (wordMatch) {
          const value = wordMatch[0];
          if (keywords.includes(value)) {
            tokens.push({ text: value, type: 'keyword' });
          } else if (code[current + value.length] === '(') {
            tokens.push({ text: value, type: 'function' });
          } else {
            tokens.push({ text: value, type: 'variable' });
          }
          current += value.length;
          continue;
        }

        // Handle operators and other characters
        const operators = ['+', '-', '*', '/', '=', '!', '<', '>', '&', '|', '^', '~', '%'];
        if (operators.includes(char)) {
          tokens.push({ text: char, type: 'operator' });
        } else {
          tokens.push({ text: char, type: 'plain' });
        }
        current++;
      }

      return tokens;
    }
  },
  python: {
    color: 'text-[#3572A5]',
    tokenize: (code: string): Token[] => {
      const tokens: Token[] = [];
      let current = 0;

      while (current < code.length) {
        const char = code[current];

        // Handle comments
        if (char === '#') {
          let value = char;
          current++;
          while (current < code.length && code[current] !== '\n') {
            value += code[current];
            current++;
          }
          tokens.push({ text: value, type: 'comment' });
          continue;
        }

        // Handle strings
        if (char === '"' || char === "'") {
          let value = char;
          const quote = char;
          current++;
          while (current < code.length && code[current] !== quote) {
            value += code[current];
            current++;
          }
          value += code[current] || '';
          current++;
          tokens.push({ text: value, type: 'string' });
          continue;
        }

        // Handle numbers
        const number = /^-?\d+(\.\d+)?/;
        const numberMatch = code.slice(current).match(number);
        if (numberMatch) {
          tokens.push({ text: numberMatch[0], type: 'number' });
          current += numberMatch[0].length;
          continue;
        }

        // Handle keywords
        const keywords = ['def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'is', 'not', 'and', 'or', 'True', 'False', 'None'];
        const word = /^[a-zA-Z_][\w]*/;
        const wordMatch = code.slice(current).match(word);
        if (wordMatch) {
          const value = wordMatch[0];
          if (keywords.includes(value)) {
            tokens.push({ text: value, type: 'keyword' });
          } else if (code[current + value.length] === '(') {
            tokens.push({ text: value, type: 'function' });
          } else {
            tokens.push({ text: value, type: 'variable' });
          }
          current += value.length;
          continue;
        }

        // Handle operators
        const operators = ['+', '-', '*', '/', '=', '<', '>', '!', ':', '%', '**', '//', '+=', '-=', '*=', '/='];
        let found = false;
        for (const op of operators) {
          if (code.slice(current).startsWith(op)) {
            tokens.push({ text: op, type: 'operator' });
            current += op.length;
            found = true;
            break;
          }
        }
        if (found) continue;

        tokens.push({ text: char, type: 'plain' });
        current++;
      }

      return tokens;
    }
  },
  java: {
    color: 'text-[#B07219]',
    tokenize: (code: string): Token[] => {
      const tokens: Token[] = [];
      let current = 0;

      while (current < code.length) {
        const char = code[current];

        // Handle comments
        if (char === '/' && code[current + 1] === '/') {
          let value = '//';
          current += 2;
          while (current < code.length && code[current] !== '\n') {
            value += code[current];
            current++;
          }
          tokens.push({ text: value, type: 'comment' });
          continue;
        }

        // Handle strings
        if (char === '"') {
          let value = char;
          current++;
          while (current < code.length && code[current] !== '"') {
            value += code[current];
            current++;
          }
          value += code[current] || '';
          current++;
          tokens.push({ text: value, type: 'string' });
          continue;
        }

        // Handle numbers
        const number = /^-?\d+(\.\d+)?([fFdDlL])?/;
        const numberMatch = code.slice(current).match(number);
        if (numberMatch) {
          tokens.push({ text: numberMatch[0], type: 'number' });
          current += numberMatch[0].length;
          continue;
        }

        // Handle keywords
        const keywords = ['public', 'private', 'protected', 'class', 'interface', 'void', 'static', 'final', 'return', 'if', 'else', 'for', 'while', 'do', 'try', 'catch', 'throw', 'throws', 'new', 'extends', 'implements', 'package', 'import'];
        const types = ['int', 'long', 'float', 'double', 'boolean', 'char', 'byte', 'short', 'String'];
        const word = /^[a-zA-Z_$][\w$]*/;
        const wordMatch = code.slice(current).match(word);
        if (wordMatch) {
          const value = wordMatch[0];
          if (keywords.includes(value)) {
            tokens.push({ text: value, type: 'keyword' });
          } else if (types.includes(value)) {
            tokens.push({ text: value, type: 'keyword' });
          } else if (code[current + value.length] === '(') {
            tokens.push({ text: value, type: 'function' });
          } else {
            tokens.push({ text: value, type: 'variable' });
          }
          current += value.length;
          continue;
        }

        // Handle operators
        const operators = ['+', '-', '*', '/', '=', '<', '>', '!', '&', '|', '^', '~', '%', '+=', '-=', '*=', '/=', '++', '--'];
        let found = false;
        for (const op of operators) {
          if (code.slice(current).startsWith(op)) {
            tokens.push({ text: op, type: 'operator' });
            current += op.length;
            found = true;
            break;
          }
        }
        if (found) continue;

        tokens.push({ text: char, type: 'plain' });
        current++;
      }

      return tokens;
    }
  },
  ruby: {
    color: 'text-[#701516]',
    tokenize: (code: string): Token[] => {
      const tokens: Token[] = [];
      let current = 0;

      while (current < code.length) {
        const char = code[current];

        // Handle comments
        if (char === '#') {
          let value = char;
          current++;
          while (current < code.length && code[current] !== '\n') {
            value += code[current];
            current++;
          }
          tokens.push({ text: value, type: 'comment' });
          continue;
        }

        // Handle strings
        if (char === '"' || char === "'" || char === '`') {
          let value = char;
          const quote = char;
          current++;
          while (current < code.length && code[current] !== quote) {
            value += code[current];
            current++;
          }
          value += code[current] || '';
          current++;
          tokens.push({ text: value, type: 'string' });
          continue;
        }

        // Handle numbers
        const number = /^-?\d+(\.\d+)?/;
        const numberMatch = code.slice(current).match(number);
        if (numberMatch) {
          tokens.push({ text: numberMatch[0], type: 'number' });
          current += numberMatch[0].length;
          continue;
        }

        // Handle keywords
        const keywords = ['def', 'class', 'module', 'require', 'include', 'extend', 'attr_reader', 'attr_writer', 'attr_accessor', 'if', 'else', 'elsif', 'unless', 'case', 'when', 'while', 'until', 'for', 'do', 'end', 'return', 'yield', 'self', 'true', 'false', 'nil'];
        const word = /^[a-zA-Z_][\w]*/;
        const wordMatch = code.slice(current).match(word);
        if (wordMatch) {
          const value = wordMatch[0];
          if (keywords.includes(value)) {
            tokens.push({ text: value, type: 'keyword' });
          } else if (code[current + value.length] === '(' || code[current + value.length] === ' ' && code[current + value.length + 1] === '{') {
            tokens.push({ text: value, type: 'function' });
          } else if (value.startsWith('@')) {
            tokens.push({ text: value, type: 'variable' });
          } else {
            tokens.push({ text: value, type: 'variable' });
          }
          current += value.length;
          continue;
        }

        // Handle operators
        const operators = ['+', '-', '*', '/', '=', '<', '>', '!', '&', '|', '^', '~', '%', '**', '<<', '>>', '&&', '||', '..', '...'];
        let found = false;
        for (const op of operators) {
          if (code.slice(current).startsWith(op)) {
            tokens.push({ text: op, type: 'operator' });
            current += op.length;
            found = true;
            break;
          }
        }
        if (found) continue;

        tokens.push({ text: char, type: 'plain' });
        current++;
      }

      return tokens;
    }
  },
  curl: {
    color: 'text-[#4D4D4D]',
    tokenize: (code: string): Token[] => {
      const tokens: Token[] = [];
      let current = 0;

      while (current < code.length) {
        const char = code[current];

        // Handle strings
        if (char === '"' || char === "'") {
          let value = char;
          const quote = char;
          current++;
          while (current < code.length && code[current] !== quote) {
            value += code[current];
            current++;
          }
          value += code[current] || '';
          current++;
          tokens.push({ text: value, type: 'string' });
          continue;
        }

        // Handle URLs
        const url = /^(https?:\/\/[^\s]+)/;
        const urlMatch = code.slice(current).match(url);
        if (urlMatch) {
          tokens.push({ text: urlMatch[0], type: 'string' });
          current += urlMatch[0].length;
          continue;
        }

        // Handle options and commands
        const options = ['-X', '--request', '-H', '--header', '-d', '--data', '--data-raw', '--data-binary', '-F', '--form', '-u', '--user'];
        const commands = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
        const word = /^[a-zA-Z_-][\w-]*/;
        const wordMatch = code.slice(current).match(word);
        if (wordMatch) {
          const value = wordMatch[0];
          if (value === 'curl') {
            tokens.push({ text: value, type: 'keyword' });
          } else if (options.includes(value)) {
            tokens.push({ text: value, type: 'function' });
          } else if (commands.includes(value)) {
            tokens.push({ text: value, type: 'operator' });
          } else {
            tokens.push({ text: value, type: 'plain' });
          }
          current += value.length;
          continue;
        }

        tokens.push({ text: char, type: 'plain' });
        current++;
      }

      return tokens;
    }
  },
  json: {
    color: 'text-[#292929]',
    tokenize: (code: string): Token[] => {
      try {
        // Format JSON if valid
        const parsed = JSON.parse(code);
        code = JSON.stringify(parsed, null, 2);
      } catch {}
      
      const tokens: Token[] = [];
      let current = 0;

      while (current < code.length) {
        const char = code[current];

        // Handle strings
        if (char === '"') {
          let value = char;
          current++;
          let isKey = true;
          while (current < code.length && code[current] !== '"') {
            value += code[current];
            current++;
          }
          value += code[current] || '';
          current++;

          // Check if this is a key or value
          let nextNonSpace = current;
          while (nextNonSpace < code.length && /\s/.test(code[nextNonSpace])) nextNonSpace++;
          isKey = code[nextNonSpace] === ':';

          tokens.push({ 
            text: value, 
            type: isKey ? 'function' : 'string'
          });
          continue;
        }

        // Handle numbers
        const number = /^-?\d+(\.\d+)?/;
        const numberMatch = code.slice(current).match(number);
        if (numberMatch) {
          tokens.push({ text: numberMatch[0], type: 'number' });
          current += numberMatch[0].length;
          continue;
        }

        // Handle boolean and null
        const keyword = /^(true|false|null)/;
        const keywordMatch = code.slice(current).match(keyword);
        if (keywordMatch) {
          tokens.push({ text: keywordMatch[0], type: 'keyword' });
          current += keywordMatch[0].length;
          continue;
        }

        // Handle other characters
        tokens.push({ text: char, type: 'plain' });
        current++;
      }

      return tokens;
    }
  }
};

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code = '', language }) => {
  const tokens = useMemo(() => {
    const config = languageConfigs[language as keyof typeof languageConfigs];
    if (!config?.tokenize) return [];
    
    const lines = code.split('\n');
    return lines.map(line => config.tokenize(line));
  }, [code, language]);

  const languageColor = languageConfigs[language as keyof typeof languageConfigs]?.color || 'text-[#8B949E]';

  return (
    <div className="w-full max-w-full overflow-y-auto rounded-lg bg-[#0D1117] max-h-64">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161B22] border-b border-[#30363D]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
        </div>
        <span className={`text-sm font-mono ${languageColor}`}>
          {language || 'Text'}
        </span>
      </div>

      {/* Code Content */}
      <div className="relative p-4 overflow-x-auto">
        <pre className="w-full">
          <code className="block font-mono text-sm text-[#E6EDF3]">
            {tokens.map((lineTokens, lineIndex) => (
              <div key={lineIndex} className="hover:bg-[#1F1F1F] rounded px-2 -mx-2">
                <span className="whitespace-pre overflow-x-auto scrollbar-hide">
                  {lineTokens.map((token, tokenIndex) => (
                    <span key={tokenIndex} className={theme[token.type]}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};