// components/Dashboard/StatCard.jsx
function StatCard({ title, value, color, icon }) {
  const colorClasses = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        {/* ✅ Mobilde daha küçük ikon */}
        <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        {/* ✅ Responsive text boyutları */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default StatCard;