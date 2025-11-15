import { useState } from 'react';

function CalendarMonthSelector({ currentDate, onDateChange }) {
  const [showPicker, setShowPicker] = useState(false);
  
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Son 5 yıl ve sonraki 5 yıl
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    onDateChange(newDate);
    setShowPicker(false);
  };

  const handleYearSelect = (year) => {
    const newDate = new Date(year, currentMonth, 1);
    onDateChange(newDate);
  };

  return (
    <div className="relative inline-block">
      {/* Tıklanabilir Ay/Yıl Başlığı */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="text-lg font-bold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-2"
      >
        <span>{months[currentMonth]} {currentYear}</span>
        <svg 
          className={`w-5 h-5 transition-transform ${showPicker ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Picker Modal */}
      {showPicker && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPicker(false)}
          />
          
          {/* Picker Content */}
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4 min-w-[320px]">
            {/* Yıl Seçici */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yıl
              </label>
              <select
                value={currentYear}
                onChange={(e) => handleYearSelect(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Ay Seçici Grid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ay
              </label>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      index === currentMonth
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Bugüne Git Butonu */}
            <button
              onClick={() => {
                onDateChange(new Date());
                setShowPicker(false);
              }}
              className="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-medium"
            >
              Bugüne Git
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CalendarMonthSelector;