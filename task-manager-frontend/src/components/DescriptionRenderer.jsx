function DescriptionRenderer({ text, maxLines = null, className = "" }) {
  if (!text) return null;

  const formatDescription = (description) => {
    const lines = description.split('\n');
    
    return lines.map((line, index) => {
      // Boş satırlar
      if (!line.trim()) {
        return <br key={index} />;
      }

      // Bullet list (• ile başlayan)
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} className="flex gap-2 ml-2">
            <span className="text-indigo-600 dark:text-indigo-400 flex-shrink-0">•</span>
            <span>{line.trim().substring(1).trim()}</span>
          </div>
        );
      }

      // Numbered list (1. 2. 3. ile başlayan)
      if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+)\.\s(.+)/);
        if (match) {
          return (
            <div key={index} className="flex gap-2 ml-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex-shrink-0">{match[1]}.</span>
              <span>{match[2]}</span>
            </div>
          );
        }
      }

      // Checkbox (☐ ile başlayan)
      if (line.trim().startsWith('☐')) {
        return (
          <div key={index} className="flex gap-2 ml-2">
            <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">☐</span>
            <span>{line.trim().substring(1).trim()}</span>
          </div>
        );
      }

      // Checked (✓ ile başlayan)
      if (line.trim().startsWith('✓')) {
        return (
          <div key={index} className="flex gap-2 ml-2">
            <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
            <span className="line-through text-gray-500 dark:text-gray-400">{line.trim().substring(1).trim()}</span>
          </div>
        );
      }

      // Emoji başlıklar (📝, 🎯, vb.)
      if (/^[📝🎯💡⚡🔥🚀📌⭐✅❌⚠️]/.test(line.trim())) {
        return (
          <div key={index} className="font-semibold text-gray-800 dark:text-white mt-2">
            {line}
          </div>
        );
      }

      // Normal satır
      return (
        <div key={index}>
          {line}
        </div>
      );
    });
  };

  const renderedContent = formatDescription(text);

  return (
    <div className={`text-sm whitespace-pre-wrap ${maxLines ? `line-clamp-${maxLines}` : ''} ${className}`}>
      {renderedContent}
    </div>
  );
}

export default DescriptionRenderer;