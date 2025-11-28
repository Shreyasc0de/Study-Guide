import React, { useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Link, List, ListOrdered, Quote, Code, 
  Image, Video, FileText, Eye, EyeOff, Type, Heading1, Heading2, 
  Heading3, AlignLeft, AlignCenter, AlignRight, Highlighter, 
  Table, CheckSquare, BookOpen, Lightbulb, AlertCircle, Star
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  showPreview?: boolean;
  enableEducationalFeatures?: boolean;
}

// Markdown parsing for preview
const parseMarkdown = (text: string): string => {
  return text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-800 dark:text-white mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">$1</h1>')
    
    // Emphasis
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/_(.*?)_/g, '<u class="underline">$1</u>')
    .replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500">$1</del>')
    
    // Code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/```([\\s\\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">$1</code></pre>')
    
    // Lists
    .replace(/^\\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^\\d+\\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-pink-500 dark:border-pink-400 pl-4 py-2 bg-pink-50 dark:bg-pink-900/20 italic text-gray-700 dark:text-gray-300 my-4">$1</blockquote>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-pink-600 dark:text-pink-400 underline hover:text-pink-800 dark:hover:text-pink-300" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Educational components
    .replace(/!\[TIP\]\s*(.*$)/gim, '<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 rounded-lg p-4 my-4"><div class="flex items-start"><span class="text-blue-600 dark:text-blue-400 mr-2">💡</span><div><strong class="text-blue-800 dark:text-blue-300">Tip:</strong> <span class="text-blue-700 dark:text-blue-300">$1</span></div></div></div>')
    .replace(/!\[WARNING\]\s*(.*$)/gim, '<div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-lg p-4 my-4"><div class="flex items-start"><span class="text-yellow-600 dark:text-yellow-400 mr-2">⚠️</span><div><strong class="text-yellow-800 dark:text-yellow-300">Warning:</strong> <span class="text-yellow-700 dark:text-yellow-300">$1</span></div></div></div>')
    .replace(/!\[NOTE\]\s*(.*$)/gim, '<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded-lg p-4 my-4"><div class="flex items-start"><span class="text-green-600 dark:text-green-400 mr-2">📝</span><div><strong class="text-green-800 dark:text-green-300">Note:</strong> <span class="text-green-700 dark:text-green-300">$1</span></div></div></div>')
    .replace(/!\[IMPORTANT\]\s*(.*$)/gim, '<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-lg p-4 my-4"><div class="flex items-start"><span class="text-red-600 dark:text-red-400 mr-2">❗</span><div><strong class="text-red-800 dark:text-red-300">Important:</strong> <span class="text-red-700 dark:text-red-300">$1</span></div></div></div>')
    
    // Line breaks
    .replace(/\\n/g, '<br>');
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  height = "300px",
  showPreview = true,
  enableEducationalFeatures = true
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  // Toolbar actions
  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    if (!textareaRef) return;
    
    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end);
    onChange(newText);
    
    // Set cursor position
    setTimeout(() => {
      const newPosition = start + before.length + textToInsert.length;
      textareaRef.setSelectionRange(newPosition, newPosition);
      textareaRef.focus();
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    if (!textareaRef) return;
    
    const start = textareaRef.selectionStart;
    const newText = value.substring(0, start) + text + value.substring(start);
    onChange(newText);
    
    setTimeout(() => {
      const newPosition = start + text.length;
      textareaRef.setSelectionRange(newPosition, newPosition);
      textareaRef.focus();
    }, 0);
  };

  // Toolbar buttons configuration
  const toolbarSections: Array<{
    name: string;
    buttons: Array<{
      icon: any;
      action: () => void;
      title: string;
      color?: string;
    }>;
  }> = [
    {
      name: 'Formatting',
      buttons: [
        { icon: Bold, action: () => insertText('**', '**', 'bold text'), title: 'Bold (Ctrl+B)' },
        { icon: Italic, action: () => insertText('*', '*', 'italic text'), title: 'Italic (Ctrl+I)' },
        { icon: Underline, action: () => insertText('_', '_', 'underlined text'), title: 'Underline' },
        { icon: Code, action: () => insertText('`', '`', 'code'), title: 'Inline Code' },
      ]
    },
    {
      name: 'Headers',
      buttons: [
        { icon: Heading1, action: () => insertAtCursor('# '), title: 'Header 1' },
        { icon: Heading2, action: () => insertAtCursor('## '), title: 'Header 2' },
        { icon: Heading3, action: () => insertAtCursor('### '), title: 'Header 3' },
      ]
    },
    {
      name: 'Lists & Blocks',
      buttons: [
        { icon: List, action: () => insertAtCursor('* '), title: 'Bullet List' },
        { icon: ListOrdered, action: () => insertAtCursor('1. '), title: 'Numbered List' },
        { icon: Quote, action: () => insertAtCursor('> '), title: 'Blockquote' },
        { icon: CheckSquare, action: () => insertAtCursor('- [ ] '), title: 'Task List' },
      ]
    },
    {
      name: 'Media & Links',
      buttons: [
        { icon: Link, action: () => insertText('[', '](https://)', 'link text'), title: 'Link' },
        { icon: Image, action: () => insertText('![', '](image-url)', 'alt text'), title: 'Image' },
        { icon: Video, action: () => insertAtCursor('[![Video](thumbnail-url)](video-url)'), title: 'Video' },
        { icon: Table, action: () => insertAtCursor('\\n| Header 1 | Header 2 |\\n|----------|----------|\\n| Cell 1   | Cell 2   |\\n'), title: 'Table' },
      ]
    }
  ];

  // Educational components section
  const educationalButtons = enableEducationalFeatures ? [
    {
      name: 'Educational',
      buttons: [
        { icon: Lightbulb, action: () => insertAtCursor('![TIP] '), title: 'Tip Box', color: 'text-blue-600' },
        { icon: AlertCircle, action: () => insertAtCursor('![WARNING] '), title: 'Warning Box', color: 'text-yellow-600' },
        { icon: BookOpen, action: () => insertAtCursor('![NOTE] '), title: 'Note Box', color: 'text-green-600' },
        { icon: Star, action: () => insertAtCursor('![IMPORTANT] '), title: 'Important Box', color: 'text-red-600' },
      ]
    }
  ] : [];

  const allToolbarSections = [...toolbarSections, ...educationalButtons];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!textareaRef || document.activeElement !== textareaRef) return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            insertText('**', '**', 'bold text');
            break;
          case 'i':
            e.preventDefault();
            insertText('*', '*', 'italic text');
            break;
          case 'k':
            e.preventDefault();
            insertText('[', '](https://)', 'link text');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [textareaRef, value]);

  return (
    <div className="border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg overflow-hidden bg-white dark:bg-[#0D1F5B]">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-[#1E4DB7]/30 p-3 bg-gray-50 dark:bg-[#1E4DB7]/10">
        <div className="flex flex-wrap items-center gap-1">
          {allToolbarSections.map((section, sectionIndex) => (
            <React.Fragment key={section.name}>
              {sectionIndex > 0 && (
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              )}
              {section.buttons.map((button, buttonIndex) => {
                const Icon = button.icon;
                return (
                  <button
                    key={buttonIndex}
                    onClick={button.action}
                    title={button.title}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-[#1E4DB7]/20 transition-colors ${
                      button.color || 'text-gray-600 dark:text-gray-300'
                    } hover:text-gray-800 dark:hover:text-white`}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </React.Fragment>
          ))}
          
          {/* Preview Toggle */}
          {showPreview && (
            <>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                title={isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
                className={`p-2 rounded transition-colors ${
                  isPreviewMode
                    ? 'bg-pink-100 dark:bg-[#1E4DB7]/30 text-pink-600 dark:text-[#A3CFFF]'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1E4DB7]/20'
                }`}
              >
                {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative" style={{ height }}>
        {isPreviewMode ? (
          <div 
            className="p-4 h-full overflow-y-auto prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }}
          />
        ) : (
          <textarea
            ref={setTextareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 resize-none border-none outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm leading-relaxed"
            spellCheck={false}
          />
        )}
      </div>

      {/* Footer with tips */}
      <div className="border-t border-gray-200 dark:border-[#1E4DB7]/30 p-2 bg-gray-50 dark:bg-[#1E4DB7]/10">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-4">
          <span>💡 <strong>Ctrl+B</strong> Bold</span>
          <span>💡 <strong>Ctrl+I</strong> Italic</span>
          <span>💡 <strong>Ctrl+K</strong> Link</span>
          <span>💡 Use <strong>![TIP]</strong>, <strong>![NOTE]</strong>, <strong>![WARNING]</strong> for callouts</span>
        </div>
      </div>
    </div>
  );
};