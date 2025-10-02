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
  id = "rich-text-editor"
}) {
  const [showFormatHelp, setShowFormatHelp] = useState(false);

  // Liste formatını ekle
  const insertListFormat = (type) => {
    const textarea = document.getElementById(id);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || '';
    
    let newText;
    let cursorPosition;

    if (start === end) {
      // Hiçbir şey seçili değilse, yeni satır ekle
      const prefix = type === 'bullet' ? '• ' : '1. ';
      const beforeCursor = text.substring(0, start);
      const needsNewline = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
      newText = beforeCursor + (needsNewline ? '\n' : '') + prefix + text.substring(end);
      cursorPosition = start + (needsNewline ? 1 : 0) + prefix.length;
    } else {
      // Seçili metin varsa, her satırı formatla
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
    
    // Cursor pozisyonunu ayarla
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  // Hızlı şablon ekle
  const insertTemplate = (template) => {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowFormatHelp(!showFormatHelp)}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
        >
          {showFormatHelp ? '✕ Kapat' : 'ℹ️ Formatlama'}
        </button>
      </div>

      {/* Format Yardımı */}
      {showFormatHelp && (
        <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-xs space-y-2">
          <div className="font-semibold text-blue-800 dark:text-blue-300">
            📝 Formatlama Örnekleri:
          </div>
          <div className="space-y-1 text-blue-700 dark:text-blue-400">
            <div>• <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">• Metin</code> - Madde işareti</div>
            <div>• <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">1. Metin</code> - Numaralı liste</div>
            <div>• <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">☐ Metin</code> - Checkbox</div>
            <div>• <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">✓ Metin</code> - Tamamlanmış</div>
          </div>
          <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
            <div className="text-blue-600 dark:text-blue-400 text-xs">
              💡 İpucu: Metni seçip format butonuna basarak hızlıca listeye çevirebilirsiniz!
            </div>
          </div>
        </div>
      )}

      {/* Format Toolbar */}
      <div className="mb-2 space-y-2">
        {/* Format Butonları */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => insertListFormat('bullet')}
            className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600"
            title="Madde İşareti Ekle (Bullet List)"
          >
            • Liste
          </button>
          <button
            type="button"
            onClick={() => insertListFormat('numbered')}
            className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600"
            title="Numaralı Liste Ekle"
          >
            1. Numaralı
          </button>
          <button
            type="button"
            onClick={() => insertTemplate('checklist')}
            className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600"
            title="Kontrol Listesi Şablonu"
          >
            ☐ Checklist
          </button>
          <button
            type="button"
            onClick={() => insertTemplate('steps')}
            className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600"
            title="Adımlar Şablonu"
          >
            📋 Adımlar
          </button>
          <button
            type="button"
            onClick={() => insertTemplate('requirements')}
            className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600"
            title="Gereksinimler Şablonu"
          >
            ✓ Gereksinimler
          </button>
          <button
            type="button"
            onClick={() => insertTemplate('notes')}
            className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600"
            title="Notlar Şablonu"
          >
            📝 Notlar
          </button>
          <button
            type="button"
            onClick={() => insertTemplate('priority')}
            className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition border border-gray-300 dark:border-gray-600"
            title="Öncelik Şablonu"
          >
            🔴 Öncelik
          </button>
        </div>

        {/* Emoji Picker */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Emoji:</span>
          {popularEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="w-7 h-7 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
              title={`${emoji} Ekle`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none font-mono text-sm"
        placeholder={placeholder}
      />
      
      {/* Alt Bilgiler */}
      <div className="flex justify-between items-center mt-1">
        {showCharCount && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {value?.length || 0} karakter
            {maxLength && ` / ${maxLength}`}
          </div>
        )}
        <div className="text-xs text-gray-400 dark:text-gray-500">
          Markdown benzeri formatlama desteklenir
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;