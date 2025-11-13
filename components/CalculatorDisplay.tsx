interface CalculatorDisplayProps {
  color?: string;
  size?: "small" | "medium" | "large";
}

export default function CalculatorDisplay({ color = "primary", size = "medium" }: CalculatorDisplayProps) {
  const sizeClasses = {
    small: "w-32 h-40",
    medium: "w-40 h-48",
    large: "w-48 h-56",
  };

  const colorClasses: Record<string, string> = {
    primary: "from-primary-500 to-primary-700",
    blue: "from-blue-500 to-blue-700",
    purple: "from-purple-500 to-purple-700",
    green: "from-green-500 to-green-700",
    orange: "from-orange-500 to-orange-700",
    indigo: "from-indigo-500 to-indigo-700",
    cyan: "from-cyan-500 to-cyan-700",
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className={`w-full h-full bg-gradient-to-br ${colorClasses[color]} rounded-2xl shadow-xl p-4 flex flex-col`}>
        {/* Display */}
        <div className="bg-gray-900/20 rounded-lg p-3 mb-3 flex items-end justify-end">
          <span className="text-white text-2xl font-bold">123</span>
        </div>
        
        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2 flex-1">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <span className="text-white text-xs font-semibold opacity-70">
                {i === 15 ? "=" : i === 12 ? "+" : i === 13 ? "-" : i === 14 ? "×" : i}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
