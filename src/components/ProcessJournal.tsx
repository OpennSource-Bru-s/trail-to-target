import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Search, Filter, TrendingUp, TrendingDown, Target, CheckCircle } from 'lucide-react';

// Mock data - would come from state/API in real app
const mockTrades = [
  {
    id: 1,
    date: '2024-01-15',
    symbol: 'EURUSD',
    direction: 'Long',
    pnl: 145000,
    setup: 'Continuation Long',
    processScore: 100,
    notes: 'Perfect execution. Waited for the zone and followed all rules.',
    rules: {
      topDownAnalysis: true,
      followedRiskRule: true,
      setStopLoss: true,
      waitedForZone: true,
      tradedASetup: true
    }
  },
  {
    id: 2,
    date: '2024-01-14',
    symbol: 'GBPJPY',
    direction: 'Short',
    pnl: -32000,
    setup: 'Reversal Short',
    processScore: 80,
    notes: 'Entered too early. Need to be more patient with reversal setups.',
    rules: {
      topDownAnalysis: true,
      followedRiskRule: true,
      setStopLoss: true,
      waitedForZone: false,
      tradedASetup: true
    }
  },
  {
    id: 3,
    date: '2024-01-13',
    symbol: 'USDJPY',
    direction: 'Long',
    pnl: 89000,
    setup: 'Breakout Long',
    processScore: 100,
    notes: 'Clean breakout with good volume. All systems aligned.',
    rules: {
      topDownAnalysis: true,
      followedRiskRule: true,
      setStopLoss: true,
      waitedForZone: true,
      tradedASetup: true
    }
  },
  {
    id: 4,
    date: '2024-01-12',
    symbol: 'AUDJPY',
    direction: 'Long',
    pnl: 156000,
    setup: 'Continuation Long',
    processScore: 90,
    notes: 'Good trade but risked slightly more than 1%. Must stick to risk management.',
    rules: {
      topDownAnalysis: true,
      followedRiskRule: false,
      setStopLoss: true,
      waitedForZone: true,
      tradedASetup: true
    }
  }
];

export const ProcessJournal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRuleIcon = (followed: boolean) => {
    return followed ? (
      <CheckCircle className="h-4 w-4 text-success" />
    ) : (
      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
    );
  };

  const filteredTrades = mockTrades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.setup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'winners' && trade.pnl > 0) ||
                         (selectedFilter === 'losers' && trade.pnl < 0) ||
                         (selectedFilter === 'high-score' && trade.processScore >= 90);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalTrades: mockTrades.length,
    winRate: (mockTrades.filter(t => t.pnl > 0).length / mockTrades.length * 100).toFixed(1),
    avgProcessScore: (mockTrades.reduce((sum, t) => sum + t.processScore, 0) / mockTrades.length).toFixed(1),
    totalPnL: mockTrades.reduce((sum, t) => sum + t.pnl, 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.totalTrades}</div>
              <div className="text-sm text-muted-foreground">Total Trades</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.winRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats.avgProcessScore}%</div>
              <div className="text-sm text-muted-foreground">Avg Process Score</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(stats.totalPnL)}
              </div>
              <div className="text-sm text-muted-foreground">Net P&L</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Trade Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="winners">Winners</TabsTrigger>
                <TabsTrigger value="losers">Losers</TabsTrigger>
                <TabsTrigger value="high-score">A+ Process</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Trade List */}
          <div className="space-y-4">
            {filteredTrades.map((trade) => (
              <Card key={trade.id} className="border border-border/20 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Trade Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{trade.date}</span>
                        </div>
                        <Badge variant="outline">{trade.symbol}</Badge>
                        <Badge variant={trade.direction === 'Long' ? 'default' : 'secondary'}>
                          {trade.direction === 'Long' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {trade.direction}
                        </Badge>
                        <Badge variant="outline">{trade.setup}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{trade.notes}</p>
                      
                      {/* Process Rules */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          {getRuleIcon(trade.rules.topDownAnalysis)}
                          <span>Top-Down</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getRuleIcon(trade.rules.followedRiskRule)}
                          <span>Risk 1%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getRuleIcon(trade.rules.setStopLoss)}
                          <span>SL/TP Set</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getRuleIcon(trade.rules.waitedForZone)}
                          <span>Wait Zone</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getRuleIcon(trade.rules.tradedASetup)}
                          <span>A+ Setup</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Results */}
                    <div className="text-right">
                      <div className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(trade.pnl)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className={`text-sm font-medium ${trade.processScore >= 90 ? 'text-success' : trade.processScore >= 70 ? 'text-primary' : 'text-destructive'}`}>
                          {trade.processScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTrades.length === 0 && (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No trades found matching your criteria</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};