import React, { useState } from 'react';
import { Check, X, Shield, Zap, Infinity, Gift } from 'lucide-react';
import { Card, Button, Badge } from './ui';
import { UserPlan } from '../types';

interface PricingPageProps {
  currentPlan: UserPlan;
  balance: number;
  onPurchase: (plan: UserPlan, cost: number) => void;
  onRedeem: (code: string) => void;
}

export const PricingPage = ({ currentPlan, balance, onPurchase, onRedeem }: PricingPageProps) => {
  const [redeemCode, setRedeemCode] = useState('');

  const handlePurchase = (plan: UserPlan, cost: number) => {
    // Basic validation
    if (balance < cost) {
      alert(`Insufficient funds! You have $${balance}, required $${cost}.`);
      return;
    }
    onPurchase(plan, cost);
  };

  const getButtonText = (plan: UserPlan) => {
      if (currentPlan === plan) return "Current Plan";
      if (currentPlan === 'lifetime') return "Owned Higher Plan";
      return `Purchase for $${plan === 'standard' ? '3.99' : '10.00'}`;
  };

  const isButtonDisabled = (plan: UserPlan) => {
      if (currentPlan === plan) return true;
      if (currentPlan === 'lifetime') return true;
      return false;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Upgrade Your Arsenal</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Unlock higher script limits and stronger obfuscation technologies. 
          Use your balance to upgrade instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Tier */}
        <Card className={`p-8 border-t-4 border-t-slate-500 relative flex flex-col ${currentPlan === 'free' ? 'ring-2 ring-slate-500' : ''}`}>
          {currentPlan === 'free' && <div className="absolute top-4 right-4"><Badge variant="neutral">Current</Badge></div>}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Starter</h3>
            <div className="text-3xl font-bold text-white mt-2">$0.00</div>
            <div className="text-sm text-slate-500">Forever Free</div>
          </div>
          <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
            <li className="flex gap-2"><Check className="h-5 w-5 text-green-400" /> 5 Active Scripts</li>
            <li className="flex gap-2"><Check className="h-5 w-5 text-green-400" /> Basic & Medium Obfuscation</li>
            <li className="flex gap-2 opacity-50"><X className="h-5 w-5 text-slate-500" /> No Hard/Extreme Obfuscation</li>
          </ul>
          <Button disabled={true} variant="outline">Included</Button>
        </Card>

        {/* Standard Tier */}
        <Card className={`p-8 border-t-4 border-t-blue-500 relative flex flex-col shadow-2xl shadow-blue-900/20 ${currentPlan === 'standard' ? 'ring-2 ring-blue-500' : ''}`}>
          {currentPlan === 'standard' && <div className="absolute top-4 right-4"><Badge variant="info">Current</Badge></div>}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Zap className="h-5 w-5 text-blue-400"/> Standard</h3>
            <div className="text-3xl font-bold text-white mt-2">$3.99<span className="text-lg font-normal text-slate-500">/mo</span></div>
            <div className="text-sm text-slate-500">Serious Scripters</div>
          </div>
          <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
            <li className="flex gap-2"><Check className="h-5 w-5 text-blue-400" /> 8 Active Scripts</li>
            <li className="flex gap-2"><Check className="h-5 w-5 text-blue-400" /> Hard Obfuscation Unlocked</li>
            <li className="flex gap-2"><Check className="h-5 w-5 text-blue-400" /> Webhook Logs</li>
          </ul>
          <Button 
            onClick={() => handlePurchase('standard', 3.99)} 
            disabled={isButtonDisabled('standard')}
            variant="secondary"
          >
            {getButtonText('standard')}
          </Button>
        </Card>

        {/* Lifetime Tier */}
        <Card className={`p-8 border-t-4 border-t-primary relative flex flex-col ${currentPlan === 'lifetime' ? 'ring-2 ring-primary' : ''}`}>
           {currentPlan === 'lifetime' && <div className="absolute top-4 right-4"><Badge variant="success">Current</Badge></div>}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Infinity className="h-5 w-5 text-primary"/> Lifetime</h3>
            <div className="text-3xl font-bold text-white mt-2">$10.00<span className="text-lg font-normal text-slate-500">/once</span></div>
            <div className="text-sm text-slate-500">Ultimate Power</div>
          </div>
          <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
            <li className="flex gap-2"><Check className="h-5 w-5 text-primary" /> 15 Active Scripts</li>
            <li className="flex gap-2"><Check className="h-5 w-5 text-primary" /> Extreme Obfuscation (VM)</li>
            <li className="flex gap-2"><Check className="h-5 w-5 text-primary" /> Custom Webhooks</li>
            <li className="flex gap-2"><Check className="h-5 w-5 text-primary" /> Priority Support</li>
          </ul>
          <Button 
            onClick={() => handlePurchase('lifetime', 10.00)} 
            disabled={isButtonDisabled('lifetime')}
            variant="primary"
          >
            {getButtonText('lifetime')}
          </Button>
        </Card>
      </div>

      <div className="max-w-md mx-auto mt-12">
        <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <Gift className="h-6 w-6 text-green-400" />
                <h3 className="text-lg font-bold text-white">Redeem Code</h3>
            </div>
            <div className="flex gap-3">
                <input 
                    type="text" 
                    placeholder="Enter code (e.g. admin2025)" 
                    className="flex-1 bg-dark-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none uppercase"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                />
                <Button onClick={() => { onRedeem(redeemCode); setRedeemCode(''); }}>
                    Redeem
                </Button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
                Codes are case-sensitive. Balance will be added instantly.
            </p>
        </Card>
      </div>
    </div>
  );
};