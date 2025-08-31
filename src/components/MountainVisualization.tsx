import React from 'react';

interface Trade {
  date: string;
  profit: number;
  processScore: number;
}

interface MountainVisualizationProps {
  currentEquity: number;
  goalAmount: number;
  recentTrades: Trade[];
}

export const MountainVisualization: React.FC<MountainVisualizationProps> = ({
  currentEquity,
  goalAmount,
  recentTrades
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min((currentEquity / goalAmount) * 100, 100);
  const balloonPosition = Math.max(5, Math.min(progressPercentage * 0.8, 80)); // Keep balloon on visible path

  // Create milestone markers
  const milestones = [
    { percentage: 10, label: 'First 10M', amount: goalAmount * 0.1 },
    { percentage: 25, label: 'Quarter Way', amount: goalAmount * 0.25 },
    { percentage: 50, label: 'Halfway There!', amount: goalAmount * 0.5 },
    { percentage: 75, label: 'Final Push', amount: goalAmount * 0.75 },
    { percentage: 100, label: 'Summit!', amount: goalAmount }
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="relative w-full h-96 bg-gradient-sky overflow-hidden">
      {/* Mountain SVG */}
      <svg
        viewBox="0 0 800 400"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(215 85% 35%)" />
            <stop offset="50%" stopColor="hsl(200 75% 50%)" />
            <stop offset="100%" stopColor="hsl(210 60% 65%)" />
          </linearGradient>
          <linearGradient id="balloonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(0 75% 55%)" />
            <stop offset="100%" stopColor="hsl(15 85% 65%)" />
          </linearGradient>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(140 65% 45%)" />
            <stop offset="100%" stopColor="hsl(160 55% 55%)" />
          </linearGradient>
        </defs>

        {/* Mountain */}
        <path
          d="M0 400 L200 300 L300 200 L400 100 L500 50 L600 80 L700 120 L800 200 L800 400 Z"
          fill="url(#mountainGradient)"
          className="drop-shadow-lg"
        />

        {/* Mountain path/trail */}
        <path
          d="M50 380 Q200 300 300 200 Q400 100 500 50 Q600 80 750 120"
          stroke="url(#trailGradient)"
          strokeWidth="4"
          strokeDasharray="8,4"
          fill="none"
          className="opacity-80"
        />

        {/* Progress path (completed journey) */}
        <path
          d="M50 380 Q200 300 300 200 Q400 100 500 50 Q600 80 750 120"
          stroke="hsl(140 65% 45%)"
          strokeWidth="6"
          fill="none"
          strokeDasharray="12,0"
          strokeLinecap="round"
          style={{
            strokeDashoffset: `${800 - (progressPercentage * 8)}px`,
            animation: 'progress-fill 2s ease-out forwards'
          }}
        />

        {/* Milestones */}
        {milestones.map((milestone, index) => {
          const x = 50 + (milestone.percentage / 100) * 700;
          const y = 380 - (milestone.percentage / 100) * 330;
          const isReached = progressPercentage >= milestone.percentage;
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="8"
                fill={isReached ? "hsl(140 65% 45%)" : "hsl(210 25% 88%)"}
                stroke={isReached ? "hsl(140 65% 35%)" : "hsl(210 25% 70%)"}
                strokeWidth="2"
                className={isReached ? "animate-mountain-glow" : ""}
              />
              <text
                x={x}
                y={y - 20}
                textAnchor="middle"
                className="text-xs font-semibold fill-foreground"
              >
                {milestone.label}
              </text>
            </g>
          );
        })}

        {/* Hot air balloon */}
        <g className="animate-balloon-float" style={{ transformOrigin: `${50 + balloonPosition * 7}px ${380 - balloonPosition * 3.3}px` }}>
          {/* Balloon basket */}
          <rect
            x={50 + balloonPosition * 7 - 8}
            y={380 - balloonPosition * 3.3 + 15}
            width="16"
            height="12"
            fill="hsl(30 50% 40%)"
            rx="2"
          />
          
          {/* Balloon ropes */}
          <line
            x1={50 + balloonPosition * 7 - 6}
            y1={380 - balloonPosition * 3.3 + 15}
            x2={50 + balloonPosition * 7 - 12}
            y2={380 - balloonPosition * 3.3 - 5}
            stroke="hsl(30 50% 30%)"
            strokeWidth="1"
          />
          <line
            x1={50 + balloonPosition * 7 + 6}
            y1={380 - balloonPosition * 3.3 + 15}
            x2={50 + balloonPosition * 7 + 12}
            y2={380 - balloonPosition * 3.3 - 5}
            stroke="hsl(30 50% 30%)"
            strokeWidth="1"
          />
          
          {/* Balloon */}
          <ellipse
            cx={50 + balloonPosition * 7}
            cy={380 - balloonPosition * 3.3 - 15}
            rx="20"
            ry="25"
            fill="url(#balloonGradient)"
            className="drop-shadow-lg"
          />
          
          {/* Balloon highlight */}
          <ellipse
            cx={50 + balloonPosition * 7 - 5}
            cy={380 - balloonPosition * 3.3 - 20}
            rx="6"
            ry="8"
            fill="hsl(0 75% 70%)"
            opacity="0.6"
          />
        </g>

        {/* Summit label */}
        <text
          x="500"
          y="35"
          textAnchor="middle"
          className="text-lg font-bold fill-primary"
        >
          {formatAmount(goalAmount)}
        </text>
      </svg>

      {/* Progress info overlay */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 shadow-card">
        <div className="text-sm text-muted-foreground">Current Progress</div>
        <div className="text-2xl font-bold text-foreground">{progressPercentage.toFixed(2)}%</div>
        <div className="text-sm text-muted-foreground">
          {formatAmount(currentEquity)} / {formatAmount(goalAmount)}
        </div>
      </div>
    </div>
  );
};