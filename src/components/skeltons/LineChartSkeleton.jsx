const LineChartSkeleton = () => {
    const chartHeight = 280;
    const chartWidth = 700;
    const margin = 40;

    // Y-axis label positions
    const yMap = {
        top: margin,
        center: chartHeight / 2,
        bottom: chartHeight - margin,
    };

    const pattern = ['bottom', 'top', 'center', 'top', 'bottom', 'center', 'top'];
    const points = pattern.map(pos => yMap[pos]);

    const stepX = (chartWidth - 2 * margin) / (points.length - 1);

    return (
        <div className="w-full h-[290px] p-5 rounded-2xl bg-white flex items-center justify-center animate-pulse">
            <svg width={chartWidth} height={chartHeight}>
                {/* Y-axis lines and labels */}
                {Object.entries(yMap).map(([label, y], i) => (
                    <g key={i}>
                        {/* Grid line */}
                        <line
                            x1={margin}
                            x2={chartWidth - margin}
                            y1={y}
                            y2={y}
                            stroke="#E5E7EB" // gray-200
                            strokeDasharray="4"
                        />
                        {/* Label */}
                        <text
                            x={0}
                            y={y + 4}
                            fontSize="12"
                            fill="#9CA3AF" // gray-400
                        >
                            {label.charAt(0).toUpperCase() + label.slice(1)}
                        </text>
                    </g>
                ))}

                {/* X-axis line */}
                <line
                    x1={margin}
                    x2={chartWidth - margin}
                    y1={chartHeight - margin}
                    y2={chartHeight - margin}
                    stroke="#9CA3AF"
                />

                {/* Line chart polyline */}
                <polyline
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    points={points.map((y, i) => `${margin + i * stepX},${y}`).join(' ')}
                />

                {/* Points */}
                {points.map((y, i) => (
                    <circle
                        key={i}
                        cx={margin + i * stepX}
                        cy={y}
                        r="6"
                        fill="#D1D5DB" // gray-300
                    />
                ))}
            </svg>
        </div>
    );
};

export default LineChartSkeleton;
