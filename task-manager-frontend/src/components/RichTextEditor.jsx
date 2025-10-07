import { useState } from 'react';

function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Detayları yazın...",
  rows = 6,
  label = "Açıklama",
  required = false,
  showCharCount = true,
  maxLength = null,
  id = "rich-text-editor",
  readOnly = false,
  showToolbar = true
}) {
  const [showFormatHelp, setShowFormatHelp] = useState(false);

  // Liste formatını ekle
  const insertListFormat = (type) => {
    if (readOnly) return;
    
    const textarea = document.getElementById(id);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || '';
    
    let newText;
    let cursorPosition;

    if (start === end) {
      const prefix = type === 'bullet' ? '• ' : '1. ';
      const beforeCursor = text.substring(0, start);
      const needsNewline = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
      newText = beforeCursor + (needsNewline ? '\n' : '') + prefix + text.substring(end);
      cursorPosition = start + (needsNewline ? 1 : 0) + prefix.length;
    } else {
      const selectedText = text.substring(start, end);
      const lines = selectedText.split('\n');
      const formattedLines = lines.map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return line;
        const prefix = type === 'bullet' ? '• ' : `${index + 1}. `;
        return prefix + trimmedLine;
      });
      newText = text.substring(0, start) + formattedLines.join('\n') + text.substring(end);
      cursorPosition = start + formattedLines.join('\n').length;
    }

    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  // Hızlı şablon ekle
  const insertTemplate = (template) => {
    if (readOnly) return;
    
    const templates = {
      checklist: '☐ Görev 1\n☐ Görev 2\n☐ Görev 3',
      steps: '1. İlk adım\n2. İkinci adım\n3. Üçüncü adım',
      requirements: '✓ Gereksinim 1\n✓ Gereksinim 2\n✓ Gereksinim 3',
      notes: '📝 Not:\n• Önemli nokta 1\n• Önemli nokta 2',
      todo: '☐ Yapılacak:\n  • Alt görev 1\n  • Alt görev 2',
      priority: '🔴 Yüksek Öncelik:\n• Madde 1\n\n🟡 Orta Öncelik:\n• Madde 2'
    };

    const textarea = document.getElementById(id);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = value || '';
    const templateText = templates[template];
    
    const beforeCursor = text.substring(0, start);
    const needsNewline = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
    
    const newText = beforeCursor + 
                    (needsNewline ? '\n\n' : '') +
                    templateText + 
                    text.substring(start);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + (needsNewline ? 2 : 0) + templateText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Emoji ekle
  const insertEmoji = (emoji) => {
    if (readOnly) return;
    
    const textarea = document.getElementById(id);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = value || '';
    
    const newText = text.substring(0, start) + emoji + ' ' + text.substring(start);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length + 1, start + emoji.length + 1);
    }, 0);
  };

  const popularEmojis = ['📌', '⚡', '🎯', '💡', '⭐', '✅', '❌', '⚠️', '🔥', '🚀'];

  // ReadOnly mode için render
  if (readOnly) {
    return (
      <div className="whitespace-pre-wrap text-sm sm:text-base text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        {value || <span className="text-gray-400 dark:text-gray-500 italic">Açıklama yok</span>}
      </div>
    );
  }

  return (
    <div>
      {/* Label ve Format Help Toggle */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {showToolbar && (
          <button
            type="button"
            onClick={() => setShowFormatHelp(!showFormatHelp)}
            className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition flex items-center gap-1"
          >
            <span className="hidden sm:inline">{showFormatHelp ? '✕ Kapat' : 'ℹ️ Formatlama'}</span>
            <span className="sm:hidden">{showFormatHelp ? '✕' : 'ℹ️'}</span>
          </button>
        )}
      </div>

      {/* Format Yardımı - Responsive */}
      {showFormatHelp && showToolbar && (
        <div className="mb-2 p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-xs space-y-2">
          <div className="font-semibold text-blue-800 dark:text-blue-300">
            📝 Formatlama Örnekleri:
          </div>
          <div className="space-y-1 text-blue-700 dark:text-blue-400">
            <div>• <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">• Metin</code> - Madde işareti</div>
            <div>• <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">1. Metin</code> - Numaralı liste</div>
            <div>• <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">☐ Metin</code> - Checkbox</div>
            <div>• <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">✓ Metin</code> - Tamamlanmış</div>
          </div>
          <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
            <div className="text-blue-600 dark:text-blue-400 text-xs">
              💡 İpucu: Metni seçip format butonuna basarak hızlıca listeye çevirebilirsiniz!
            </div>
          </div>
        </div>
      )}

      {/* Format Toolbar - Responsive */}
      {showToolbar && (
        <div className="mb-2 space-y-2">
          {/* Format Butonları - Scrollable on Mobile */}
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-1 sm:gap-1.5 min-w-max sm:min-w-0 sm:flex-wrap">
              <button
                type="button"
                onClick={() => insertListFormat('bullet')}
                className="px-2 sm:px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600 whitespace-nowrap touch-manipulation"
                title="Madde İşareti Ekle"
              >
                • Liste
              </button>
              <button
                type="button"
                onClick={() => insertListFormat('numbered')}
                className="px-2 sm:px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600 whitespace-nowrap touch-manipulation"
                title="Numaralı Liste"
              >
                1. Numaralı
              </button>
              <button
                type="button"
                onClick={() => insertTemplate('checklist')}
                className="px-2 sm:px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600 whitespace-nowrap touch-manipulation"
                title="Kontrol Listesi"
              >
                ☐ Checklist
              </button>
              <button
                type="button"
                onClick={() => insertTemplate('steps')}
                className="px-2 sm:px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600 whitespace-nowrap touch-manipulation"
                title="Adımlar Şablonu"
              >
                📋 Adımlar
              </button>
              <button
                type="button"
                onClick={() => insertTemplate('requirements')}
                className="px-2 sm:px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600 whitespace-nowrap touch-manipulation"
                title="Gereksinimler"
              >
                ✓ Gereksinim
              </button>
              <button
                type="button"
                onClick={() => insertTemplate('notes')}
                className="px-2 sm:px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600 whitespace-nowrap touch-manipulation"
                title="Notlar"
              >
                📝 Notlar
              </button>
              <button
                type="button"
                onClick={() => insertTemplate('priority')}
                className="px-2 sm:px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600 whitespace-nowrap touch-manipulation"
                title="Öncelik"
              >
                🔴 Öncelik
              </button>
            </div>
          </div>

          {/* Emoji Picker - Responsive */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">Emoji:</span>
            <div className="flex gap-0.5 sm:gap-1">
              {popularEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-base hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition flex items-center justify-center flex-shrink-0 touch-manipulation"
                  title={`${emoji} Ekle`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Textarea - Responsive */}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        required={required}
        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none font-mono"
        placeholder={placeholder}
      />
      
      {/* Alt Bilgiler - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mt-1.5">
        {showCharCount && (
          <div className="text-xs text-gray-500 dark:text-gray-400 order-2 sm:order-1">
            {value?.length || 0} karakter
            {maxLength && ` / ${maxLength}`}
          </div>
        )}
        <div className="text-xs text-gray-400 dark:text-gray-500 order-1 sm:order-2">
          <span className="hidden sm:inline">Markdown benzeri formatlama desteklenir</span>
          <span className="sm:hidden">Markdown destekli</span>
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;