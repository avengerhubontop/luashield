
import React from 'react';
import { Shield, Server, Key, Activity, Lock, Ban, BarChart, CheckCircle2 } from 'lucide-react';
import { Card, Button } from './ui';
import { MOCK_STATS } from '../constants';

const FeatureCard = ({ icon: Icon, title, desc, details }: any) => (
  <Card className="p-6 hover:border-primary/50 transition-colors group">
    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 mb-4">{desc}</p>
    <div className="text-xs text-slate-500 pt-4 border-t border-slate-700/50 font-mono">
      {details}
    </div>
  </Card>
);

export const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 via-dark-800 to-dark-900 border border-slate-700/50 p-12 text-center">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Shield className="h-4 w-4" /> Enterprise Protection
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            Secure Your Lua Scripts <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Against All Threats
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            The most advanced Lua obfuscation and analytics platform. 
            Protect your intellectual property with polymorphic VM encryption, 
            Luraph-style execution, and real-time threat monitoring.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={onGetStarted}>Get Started Now</Button>
            <Button variant="outline" size="lg">View Documentation</Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Scripts Protected', value: MOCK_STATS.totalScripts.toLocaleString() },
          { label: 'Active Users', value: MOCK_STATS.activeUsers.toLocaleString() },
          { label: 'Threats Blocked', value: MOCK_STATS.cracksBlocked.toLocaleString() },
          { label: 'System Uptime', value: MOCK_STATS.uptime }
        ].map((stat, i) => (
          <React.Fragment key={i}>
            <Card className="p-6 text-center border-t-4 border-t-primary">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </Card>
          </React.Fragment>
        ))}
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose LuaShield?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Lock} 
            title="Uncrackable Obfuscation" 
            desc="Advanced multi-layer encryption that defeats all known deobfuscators." 
            details="VM Virtualization • Control Flow Flattening"
          />
          <FeatureCard 
            icon={Server} 
            title="Backend Protection" 
            desc="Scripts never exposed. Served dynamically through secure endpoints." 
            details="Token Auth • Rate Limiting • IP Validation"
          />
          <FeatureCard 
            icon={Key} 
            title="Key System Integration" 
            desc="Built-in monetization and access control with HWID binding." 
            details="HWID Binding • Expiring Keys • Usage Limits"
          />
          <FeatureCard 
            icon={Activity} 
            title="Real-Time Monitoring" 
            desc="Track every execution, detect cracking attempts, and view logs." 
            details="Geolocation • Execution Analytics • User Tracking"
          />
          <FeatureCard 
            icon={Shield} 
            title="Anti-Tampering" 
            desc="Automatic detection and blocking of decompilers and debuggers." 
            details="Integrity Checks • Anti-Debug • Anti-Spy"
          />
          <FeatureCard 
            icon={Ban} 
            title="HWID Blacklisting" 
            desc="Instantly block malicious users across all your scripts globally." 
            details="Hardware Fingerprinting • Auto-Ban Logic"
          />
        </div>
      </div>

      {/* Comparison */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold text-white mb-6">The Advantage</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="py-4 text-left text-slate-400 font-medium">Feature</th>
                <th className="py-4 text-center text-primary font-bold text-lg">LuaShield</th>
                <th className="py-4 text-center text-slate-500 font-medium">Competitors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[
                "Polymorphic VM Encryption",
                "Luraph Method Stubs",
                "Real-Time Analytics Dashboard",
                "Integrated Key System",
                "Automated Threat Blocking"
              ].map((feature, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 text-slate-300">{feature}</td>
                  <td className="py-4 text-center">
                    <CheckCircle2 className="h-6 w-6 text-primary mx-auto" />
                  </td>
                  <td className="py-4 text-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-600 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
