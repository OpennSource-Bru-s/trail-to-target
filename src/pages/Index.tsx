import React, { useState } from 'react';
import { MountainVisualization } from '@/components/MountainVisualization';
import { DashboardStats } from '@/components/DashboardStats';
import { TradeEntry } from '@/components/TradeEntry';
import { ProcessJournal } from '@/components/ProcessJournal';
import { TrendingUp, Mountain, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data - would come from state/API in real app
const mockTradeData = {
  netProfit: 2157688,
  goalAmount: 100000000,
  currentStreak: 4,
  processScore: 92,
  avgRealizedRR: 1.71,
  avgPlannedRR: 5.12,
  recentTrades: [
    { date: '2024-01-15', profit: 145000, processScore: 100 },
    { date: '2024-01-14', profit: -32000, processScore: 80 },
    { date: '2024-01-13', profit: 89000, processScore: 100 },
    { date: '2024-01-12', profit: 156000, processScore: 90 },
  ]
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mountain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Process &gt; P&amp;L</h1>
                <p className="text-sm text-muted-foreground">Your journey to the summit</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Trade
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="add-trade" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Trade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Dashboard Stats */}
            <DashboardStats data={mockTradeData} />
            
            {/* Mountain Visualization */}
            <div className="bg-card rounded-2xl shadow-card border border-border/20 overflow-hidden">
              <div className="p-6 border-b border-border/20">
                <h2 className="text-xl font-semibold text-foreground">Your Journey to 100M VND</h2>
                <p className="text-muted-foreground">Progress visualization • Current position: {((mockTradeData.netProfit / mockTradeData.goalAmount) * 100).toFixed(2)}%</p>
              </div>
              <MountainVisualization 
                currentEquity={mockTradeData.netProfit}
                goalAmount={mockTradeData.goalAmount}
                recentTrades={mockTradeData.recentTrades}
              />
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <ProcessJournal />
          </TabsContent>

          <TabsContent value="add-trade" className="space-y-6">
            <TradeEntry />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;