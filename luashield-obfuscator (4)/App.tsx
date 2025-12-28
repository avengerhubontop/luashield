import React, { useState, useEffect } from 'react';
import { LayoutGrid, FileText, Activity, Settings, Bell, LogOut, Menu as MenuIcon, X, Globe, CreditCard, DollarSign, Shield, Unlock } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { LogsPage } from './components/LogsPage';
import { WebhooksPage } from './components/WebhooksPage';
import { PricingPage } from './components/PricingPage';
import { AdminPanel } from './components/AdminPanel';
import { LoginPage } from './components/LoginPage';
import { ViewState, Script, LogEntry, Key, UserPlan, User } from './types';
import { MOCK_SCRIPTS, MOCK_LOGS } from './constants';

const App = () => {
  // Persistence for Auth
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('luashield_user_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    }
    return {
      name: 'Guest',
      role: 'User',
      avatar: 'https://picsum.photos/100',
      balance: 0,
      plan: 'free',
      isAdmin: false,
      isAuthenticated: false
    };
  });

  const [view, setView] = useState<ViewState>(user.isAuthenticated ? 'landing' : 'login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persistence for Scripts/Logs
  const [scripts, setScripts] = useState<Script[]>(() => {
    const saved = localStorage.getItem('luashield_scripts');
    return saved ? JSON.parse(saved) : MOCK_SCRIPTS;
  });
  
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('luashield_logs');
    return saved ? JSON.parse(saved) : MOCK_LOGS;
  });

  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('luashield_scripts', JSON.stringify(scripts));
  }, [scripts]);

  useEffect(() => {
    localStorage.setItem('luashield_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('luashield_user_session', JSON.stringify(user));
  }, [user]);

  // Handle Login
  const handleLogin = (username: string) => {
    setUser(prev => ({ ...prev, name: username, isAuthenticated: true }));
    setView('landing');
  };

  const handleLogout = () => {
    setUser(prev => ({ ...prev, isAuthenticated: false }));
    setView('login');
  };

  // Background Logs Simulation
  useEffect(() => {
    if (!user.isAuthenticated) return;
    const interval = setInterval(() => {
      if (scripts.length > 0 && Math.random() > 0.7) {
        const types: LogEntry['type'][] = ['success', 'success', 'success', 'failed', 'blocked', 'suspicious'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomScript = scripts[Math.floor(Math.random() * scripts.length)];
        
        if (!randomScript) return;

        let isBlocked = false;
        let finalType = randomType;
        if (randomScript.blacklist && randomScript.blacklist.length > 0) {
            if (Math.random() < 0.2) {
                finalType = 'blocked';
                isBlocked = true;
            }
        }

        const newLog: LogEntry = {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          type: finalType,
          scriptName: randomScript.name,
          hwid: isBlocked ? (randomScript.blacklist?.[0]?.value || `HWID-BLOCKED`) : `HWID-${Math.random().toString(16).substring(2, 6).toUpperCase()}-...`,
          ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}...`,
          country: ['US', 'DE', 'BR', 'RU', 'CN', 'FR'][Math.floor(Math.random() * 6)],
          message: finalType === 'blocked' ? 'Blacklisted Environment' : finalType === 'suspicious' ? 'Debugger Detected' : undefined
        };

        setLogs(prev => [newLog, ...prev].slice(0, 100));

        if (finalType === 'suspicious' || finalType === 'blocked') {
          setNotifications(prev => [`Security Alert: ${finalType} activity on ${randomScript.name}`, ...prev]);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [scripts, user.isAuthenticated]);

  const handleCreateScript = (data: Partial<Script>) => {
    const newScript: Script = {
      id: `sc_${Math.floor(Math.random() * 1000000)}`,
      name: data.name || 'Untitled',
      created: new Date().toISOString().split('T')[0],
      status: 'active',
      executions: 0,
      maxExecutions: 0,
      keySystem: data.keySystem || false,
      expiresIn: 'Never',
      loadstring: data.loadstring || 'Local Script',
      obfuscatedCode: data.obfuscatedCode || '-- Protected Code',
      keys: [],
      blacklist: [],
      webhookUrl: '',
      ...data
    } as Script;
    
    setScripts(prev => [newScript, ...prev]);
  };

  const handleUpdateScript = (updatedScript: Script) => {
    setScripts(prev => prev.map(s => s.id === updatedScript.id ? updatedScript : s));
  };

  const handleDeleteScript = (id: string) => {
    setScripts(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleScript = (id: string) => {
    setScripts(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'disabled' : 'active' } : s
    ));
  };

  const handleGenerateKeys = (scriptId: string, amount: number, note: string, maxUses: number) => {
    setScripts(prev => prev.map(s => {
      if (s.id !== scriptId) return s;
      const newKeys: Key[] = Array.from({ length: amount }).map(() => ({
        id: `key_${Math.random().toString(36).substring(7)}`,
        value: `LS_${Math.random().toString(36).substring(2, 8).toUpperCase()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        status: 'active',
        hwid: null,
        maxUses: maxUses,
        currentUses: 0,
        note: note,
        created: new Date().toISOString().split('T')[0]
      }));
      return { ...s, keys: [...(s.keys || []), ...newKeys] };
    }));
  };

  const handleRevokeKey = (scriptId: string, keyId: string) => {
    setScripts(prev => prev.map(s => {
      if (s.id !== scriptId) return s;
      return {
        ...s,
        keys: s.keys?.map(k => k.id === keyId ? { ...k, status: 'revoked' } : k)
      };
    }));
  };

  const handleRedeem = (code: string) => {
    const c = code.toLowerCase().trim();
    if (c === 'admin2025') {
      setUser(prev => ({ ...prev, balance: prev.balance + 1000 }));
      alert("Success! $1,000 added.");
    } else if (c === 'panelezpevin') {
      setUser(prev => ({ ...prev, isAdmin: true }));
      setNotifications(prev => ["System: Administrative Panel Unlocked", ...prev]);
      alert("Success! Admin privileges granted.");
    } else {
      alert("Invalid Code");
    }
  };

  const handlePurchasePlan = (plan: UserPlan, cost: number) => {
    setUser(prev => {
       if (prev.balance >= cost) {
           alert(`Purchase Successful! You are now a ${plan.toUpperCase()} member.`);
           return {
               ...prev,
               balance: parseFloat((prev.balance - cost).toFixed(2)),
               plan: plan
           };
       } else {
           alert(`Insufficient funds. You have $${prev.balance}, but need $${cost}.`);
           return prev;
       }
    });
  };

  if (view === 'login' || !user.isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const NavItem = ({ id, icon: Icon, label }: { id: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        view === id 
          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-dark-900 text-slate-200 font-sans selection:bg-primary/30">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-700 bg-dark-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Shield className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-white text-lg">LuaShield</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-300">
          {isSidebarOpen ? <X /> : <MenuIcon />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-dark-800 border-r border-slate-700/50 flex flex-col
            transition-transform duration-300 lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-6 border-b border-slate-700/50 hidden lg:flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-xl tracking-tight">LuaShield</h1>
              <span className="text-xs text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">v3.0.0</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 mt-4">Main Menu</div>
            <NavItem id="landing" icon={FileText} label="Overview" />
            <NavItem id="dashboard" icon={LayoutGrid} label="Dashboard" />
            <NavItem id="logs" icon={Activity} label="Monitoring" />
            <NavItem id="webhooks" icon={Globe} label="Webhooks" />
            
            <div className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 mt-6">Store</div>
            <NavItem id="pricing" icon={CreditCard} label="Pricing & Plan" />

            {user.isAdmin && (
              <>
                <div className="text-xs font-bold text-red-500 uppercase px-4 mb-2 mt-6">Administrative</div>
                <NavItem id="admin" icon={Unlock} label="Admin Panel" />
              </>
            )}
          </nav>

          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/50 border border-slate-700/50">
              <div className="h-10 w-10 rounded-full bg-slate-700 overflow-hidden">
                <img src={user.avatar} alt="User" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                <div className="text-xs text-primary truncate capitalize">{user.plan} Plan</div>
              </div>
              <button className="text-slate-400 hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0">
          <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-slate-700/50 bg-dark-900/80 backdrop-blur sticky top-0 z-20">
             <h2 className="text-xl font-bold text-white">
               {view === 'landing' && 'Overview'}
               {view === 'dashboard' && 'Script Dashboard'}
               {view === 'logs' && 'Security Logs'}
               {view === 'webhooks' && 'Webhook Integrations'}
               {view === 'pricing' && 'Plans & Billing'}
               {view === 'admin' && 'Admin Hub'}
             </h2>
             <div className="flex items-center gap-4">
               <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400 font-mono font-medium">
                  <DollarSign className="h-4 w-4" />
                  {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </div>
               <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                 <Bell className="h-5 w-5" />
                 {notifications.length > 0 && (
                   <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full border-2 border-dark-900 animate-pulse"></span>
                 )}
               </button>
               <div className="h-8 w-px bg-slate-700" />
               <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                 <LogOut className="h-4 w-4" /> Sign Out
               </button>
             </div>
          </header>

          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {view === 'landing' && <LandingPage onGetStarted={() => setView('dashboard')} />}
            {view === 'dashboard' && (
              <Dashboard 
                scripts={scripts} 
                onCreateScript={handleCreateScript}
                onDeleteScript={handleDeleteScript}
                onToggleScript={handleToggleScript}
                onGenerateKeys={handleGenerateKeys}
                onRevokeKey={handleRevokeKey}
                onUpdateScript={handleUpdateScript}
                userPlan={user.plan}
              />
            )}
            {view === 'logs' && <LogsPage logs={logs} />}
            {view === 'webhooks' && <WebhooksPage />}
            {view === 'pricing' && (
              <PricingPage 
                currentPlan={user.plan} 
                balance={user.balance}
                onPurchase={handlePurchasePlan}
                onRedeem={handleRedeem}
              />
            )}
            {view === 'admin' && <AdminPanel />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;