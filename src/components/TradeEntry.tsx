import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';

interface TradeFormData {
  symbol: string;
  direction: 'long' | 'short' | '';
  entryPrice: string;
  exitPrice: string;
  stopLoss: string;
  takeProfit: string;
  lotSize: string;
  entryDate: string;
  exitDate: string;
  setup: string;
  notes: string;
  screenshot: File | null;
  
  // Process tracking
  topDownAnalysis: boolean;
  followedRiskRule: boolean;
  setStopLoss: boolean;
  waitedForZone: boolean;
  tradedASetup: boolean;
}

export const TradeEntry: React.FC = () => {
  const [formData, setFormData] = useState<TradeFormData>({
    symbol: '',
    direction: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    lotSize: '',
    entryDate: '',
    exitDate: '',
    setup: '',
    notes: '',
    screenshot: null,
    topDownAnalysis: false,
    followedRiskRule: false,
    setStopLoss: false,
    waitedForZone: false,
    tradedASetup: false
  });

  const handleInputChange = (field: keyof TradeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateRR = () => {
    const entry = parseFloat(formData.entryPrice);
    const sl = parseFloat(formData.stopLoss);
    const tp = parseFloat(formData.takeProfit);
    
    if (!entry || !sl || !tp) return 0;
    
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    
    return risk > 0 ? parseFloat((reward / risk).toFixed(2)) : 0;
  };

  const calculatePnL = () => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const lots = parseFloat(formData.lotSize);
    
    if (!entry || !exit || !lots) return 0;
    
    const pointValue = 100000; // Assuming standard forex calculation
    const pnl = formData.direction === 'long' 
      ? (exit - entry) * lots * pointValue
      : (entry - exit) * lots * pointValue;
    
    return Math.round(pnl);
  };

  const getProcessScore = () => {
    const rules = [
      formData.topDownAnalysis,
      formData.followedRiskRule,
      formData.setStopLoss,
      formData.waitedForZone,
      formData.tradedASetup
    ];
    
    const followedRules = rules.filter(rule => rule).length;
    return Math.round((followedRules / rules.length) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.symbol || !formData.direction || !formData.entryPrice) {
      toast.error('Please fill in required fields');
      return;
    }
    
    // In a real app, this would save to database/state
    const tradeData = {
      ...formData,
      calculatedRR: calculateRR(),
      calculatedPnL: calculatePnL(),
      processScore: getProcessScore()
    };
    
    console.log('Saving trade:', tradeData);
    toast.success('Trade saved successfully!');
    
    // Reset form
    setFormData({
      symbol: '',
      direction: '',
      entryPrice: '',
      exitPrice: '',
      stopLoss: '',
      takeProfit: '',
      lotSize: '',
      entryDate: '',
      exitDate: '',
      setup: '',
      notes: '',
      screenshot: null,
      topDownAnalysis: false,
      followedRiskRule: false,
      setStopLoss: false,
      waitedForZone: false,
      tradedASetup: false
    });
  };

  const pnl = calculatePnL();
  const rr = calculateRR();
  const processScore = getProcessScore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Add New Trade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trade Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol *</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value)}
                  placeholder="EURUSD"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="direction">Direction *</Label>
                <Select value={formData.direction} onValueChange={(value) => handleInputChange('direction', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long (Buy)</SelectItem>
                    <SelectItem value="short">Short (Sell)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input
                  id="lotSize"
                  type="number"
                  step="0.01"
                  value={formData.lotSize}
                  onChange={(e) => handleInputChange('lotSize', e.target.value)}
                  placeholder="0.1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price *</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.00001"
                  value={formData.entryPrice}
                  onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                  placeholder="1.10500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exitPrice">Exit Price</Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="0.00001"
                  value={formData.exitPrice}
                  onChange={(e) => handleInputChange('exitPrice', e.target.value)}
                  placeholder="1.10750"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.00001"
                  value={formData.stopLoss}
                  onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                  placeholder="1.10250"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.00001"
                  value={formData.takeProfit}
                  onChange={(e) => handleInputChange('takeProfit', e.target.value)}
                  placeholder="1.11000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entryDate">Entry Date</Label>
                <Input
                  id="entryDate"
                  type="datetime-local"
                  value={formData.entryDate}
                  onChange={(e) => handleInputChange('entryDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exitDate">Exit Date</Label>
                <Input
                  id="exitDate"
                  type="datetime-local"
                  value={formData.exitDate}
                  onChange={(e) => handleInputChange('exitDate', e.target.value)}
                />
              </div>
            </div>

            {/* Setup Selection */}
            <div className="space-y-2">
              <Label htmlFor="setup">Trading Setup</Label>
              <Select value={formData.setup} onValueChange={(value) => handleInputChange('setup', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your A+ setup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="continuation-long">Continuation Long</SelectItem>
                  <SelectItem value="continuation-short">Continuation Short</SelectItem>
                  <SelectItem value="reversal-long">Reversal Long</SelectItem>
                  <SelectItem value="reversal-short">Reversal Short</SelectItem>
                  <SelectItem value="breakout-long">Breakout Long</SelectItem>
                  <SelectItem value="breakout-short">Breakout Short</SelectItem>
                  <SelectItem value="scalp-long">Scalp Long</SelectItem>
                  <SelectItem value="scalp-short">Scalp Short</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Process Rules Tracking */}
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-lg">Process Rules</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Current Score: <span className={`font-bold ${processScore >= 80 ? 'text-success' : 'text-destructive'}`}>
                    {processScore}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="topDownAnalysis">Performed Top-Down Analysis</Label>
                  <Switch
                    id="topDownAnalysis"
                    checked={formData.topDownAnalysis}
                    onCheckedChange={(checked) => handleInputChange('topDownAnalysis', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="followedRiskRule">Risked Only 1%</Label>
                  <Switch
                    id="followedRiskRule"
                    checked={formData.followedRiskRule}
                    onCheckedChange={(checked) => handleInputChange('followedRiskRule', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="setStopLoss">Set Stop Loss & Take Profit</Label>
                  <Switch
                    id="setStopLoss"
                    checked={formData.setStopLoss}
                    onCheckedChange={(checked) => handleInputChange('setStopLoss', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="waitedForZone">Waited for My Zone</Label>
                  <Switch
                    id="waitedForZone"
                    checked={formData.waitedForZone}
                    onCheckedChange={(checked) => handleInputChange('waitedForZone', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="tradedASetup">Only Traded A+ Setup</Label>
                  <Switch
                    id="tradedASetup"
                    checked={formData.tradedASetup}
                    onCheckedChange={(checked) => handleInputChange('tradedASetup', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Trade Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Today's Lesson</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="What did I learn from this trade? What could I improve?"
                rows={4}
              />
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <Label htmlFor="screenshot">Chart Screenshot</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag and drop your chart screenshot here</p>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={(e) => handleInputChange('screenshot', e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Calculated Values */}
            {(rr > 0 || pnl !== 0) && (
              <Card className="bg-accent/20">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Risk:Reward</div>
                      <div className="text-lg font-bold text-primary">1:{rr}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">P&L</div>
                      <div className={`text-lg font-bold ${pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          minimumFractionDigits: 0
                        }).format(pnl)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Process Score</div>
                      <div className={`text-lg font-bold ${processScore >= 80 ? 'text-success' : 'text-destructive'}`}>
                        {processScore}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Trade
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};