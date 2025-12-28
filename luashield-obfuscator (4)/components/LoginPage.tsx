import React, { useState } from 'react';
import { Shield, Lock, User, ChevronRight } from 'lucide-react';
import { Card, Button } from './ui';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    } else {
      alert("Please enter credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-900 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex h-16 w-16 bg-gradient-to-br from-primary to-secondary rounded-2xl items-center justify-center shadow-2xl shadow-primary/20 mb-4">
            <Shield className="text-white h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">LuaShield</h1>
          <p className="text-slate-400 mt-2">Enterprise-Grade Obfuscation Dashboard</p>
        </div>

        <Card className="p-8 border-slate-700 shadow-2xl animate-in zoom-in-95 duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <User className="h-4 w-4" /> Username
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Lock className="h-4 w-4" /> Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full py-4 text-lg font-bold group">
              Login to Dashboard
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="pt-4 text-center">
              <a href="#" className="text-xs text-slate-500 hover:text-primary transition-colors">Forgot Password?</a>
            </div>
          </form>
        </Card>

        <p className="text-center text-slate-600 text-xs mt-8">
          &copy; 2025 LuaShield Technologies. All rights reserved.
        </p>
      </div>
    </div>
  );
};