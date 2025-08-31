import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Flame, CheckCircle, BarChart3, AlertTriangle } from 'lucide-react';

interface TradeData {
  netProfit: number;
  goalAmount: number;
  currentStreak: number;
  processScore: number;
  avgRealizedRR: number;
  avgPlannedRR: number;
}

interface DashboardStatsProps {
  data: TradeData;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const progressPercentage = (data.netProfit / data.goalAmount) * 100;
  const rrDifference = data.avgPlannedRR - data.avgRealizedRR;
  
  const stats = [
    {
      title: 'Net Profit',
      value: formatCurrency(data.netProfit),
      icon: TrendingUp,
      trend: data.netProfit > 0 ? 'positive' : 'negative',
      description: `${progressPercentage.toFixed(2)}% to goal`
    },
    {
      title: 'Current Streak',
      value: `${data.currentStreak} ${data.currentStreak === 1 ? 'Day' : 'Days'}`,
      icon: Flame,
      trend: data.currentStreak > 0 ? 'positive' : 'neutral',
      description: 'Green days'
    },
    {
      title: 'Process Score',
      value: `${data.processScore}%`,
      icon: CheckCircle,
      trend: data.processScore >= 90 ? 'positive' : data.processScore >= 70 ? 'neutral' : 'negative',
      description: 'Rules followed'
    },
    {
      title: 'Avg. Realized R:R',
      value: data.avgRealizedRR.toFixed(2),
      icon: BarChart3,
      trend: data.avgRealizedRR >= 2 ? 'positive' : data.avgRealizedRR >= 1 ? 'neutral' : 'negative',
      description: 'Risk-reward ratio'
    },
    {
      title: 'Avg. Planned R:R',
      value: data.avgPlannedRR.toFixed(2),
      icon: Target,
      trend: 'neutral',
      description: `${rrDifference.toFixed(2)} opportunity gap`
    },
    {
      title: 'Opportunity',
      value: `${rrDifference.toFixed(1)}x`,
      icon: AlertTriangle,
      trend: rrDifference > 1 ? 'warning' : 'positive',
      description: 'Unused potential'
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      case 'warning':
        return 'text-orange-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendBg = (trend: string) => {
    switch (trend) {
      case 'positive':
        return 'bg-success/10 border-success/20';
      case 'negative':
        return 'bg-destructive/10 border-destructive/20';
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/20';
      default:
        return 'bg-muted/10 border-border/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`shadow-card border ${getTrendBg(stat.trend)} hover:shadow-lg transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${getTrendColor(stat.trend)}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTrendColor(stat.trend)}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};