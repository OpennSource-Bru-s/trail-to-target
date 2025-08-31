import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Search, Filter, TrendingUp, TrendingDown, Target, CheckCircle, Trash2, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

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
  const [trades, setTrades] = useState(mockTrades);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const deleteTrade = (tradeId: number) => {
    setTrades(prev => prev.filter(trade => trade.id !== tradeId));
    toast.success('Trade deleted successfully');
  };

  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Convert Excel data to trade format
        const newTrades = jsonData.map((row: any, index: number) => ({
          id: Math.max(...trades.map(t => t.id), 0) + index + 1,
          date: row.Date || new Date().toISOString().split('T')[0],
          symbol: row.Symbol || 'Unknown',
          direction: row.Direction || 'Long',
          pnl: parseFloat(row.PnL) || 0,
          setup: row.Setup || 'Manual Entry',
          processScore: parseInt(row.ProcessScore) || 50,
          notes: row.Notes || '',
          rules: {
            topDownAnalysis: row.TopDownAnalysis === 'true' || row.TopDownAnalysis === true,
            followedRiskRule: row.FollowedRiskRule === 'true' || row.FollowedRiskRule === true,
            setStopLoss: row.SetStopLoss === 'true' || row.SetStopLoss === true,
            waitedForZone: row.WaitedForZone === 'true' || row.WaitedForZone === true,
            tradedASetup: row.TradedASetup === 'true' || row.TradedASetup === true
          }
        }));

        setTrades(prev => [...prev, ...newTrades]);
        toast.success(`Imported ${newTrades.length} trades successfully`);
      } catch (error) {
        toast.error('Failed to import Excel file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportExcel = () => {
    const exportData = trades.map(trade => ({
      Date: trade.date,
      Symbol: trade.symbol,
      Direction: trade.direction,
      PnL: trade.pnl,
      Setup: trade.setup,
      ProcessScore: trade.processScore,
      Notes: trade.notes,
      TopDownAnalysis: trade.rules.topDownAnalysis,
      FollowedRiskRule: trade.rules.followedRiskRule,
      SetStopLoss: trade.rules.setStopLoss,
      WaitedForZone: trade.rules.waitedForZone,
      TradedASetup: trade.rules.tradedASetup
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trades');
    
    const fileName = `trading_journal_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('Trading journal exported successfully');
  };

  const filteredTrades = trades.filter(trade => {
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
    totalTrades: trades.length,
    winRate: trades.length > 0 ? (trades.filter(t => t.pnl > 0).length / trades.length * 100).toFixed(1) : '0.0',
    avgProcessScore: trades.length > 0 ? (trades.reduce((sum, t) => sum + t.processScore, 0) / trades.length).toFixed(1) : '0.0',
    totalPnL: trades.reduce((sum, t) => sum + t.pnl, 0)
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Trade Journal</CardTitle>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportExcel}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportExcel}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>
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
                    
                    {/* Results and Actions */}
                    <div className="text-right">
                      <div className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(trade.pnl)}
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className={`text-sm font-medium ${trade.processScore >= 90 ? 'text-success' : trade.processScore >= 70 ? 'text-primary' : 'text-destructive'}`}>
                          {trade.processScore}%
                        </span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Trade</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this trade? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteTrade(trade.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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