import React, { useState } from 'react';
import { Card, Badge, Button, Toggle } from './ui';
import { Shield, Server, Activity, Ban, Trash2, Cpu, Globe, AlertCircle, RefreshCw, Database } from 'lucide-react';

export const AdminPanel = () => {
  const [globalBlacklist, setGlobalBlacklist] = useState([
    { id: '1', type: 'hwid', value: 'HWID-A12B-C3D4', reason: 'Attempted VM cracking', date: '2025-05-10' },
    { id: '2', type: 'ip', value: '45.122.3.14', reason: 'Decompiler usage detected', date: '2025-05-12' },
  ]);

  const removeBlacklist = (id: string) => {
    setGlobalBlacklist(prev => prev.filter(b => b.id !== id));
  };

  const StatusItem = ({ label, status, detail, icon: Icon }: any) => (
    <Card className="p-4 border-slate-700/50">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-dark-900 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">{label}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{detail}</span>
            <div className={`h-2 w-2 rounded-full ${status === 'ok' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-red-900/40 to-dark-800 p-8 rounded-2xl border border-red-500/20">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="h-8 w-8 text-red-500" /> Administrative Hub
        </h2>
        <p className="text-slate-400 mt-2">Global system management and elite level control.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusItem label="Backend Status" detail="Operational" status="ok" icon={Server} />
        <StatusItem label="VM Core v3.0" detail="Encrypted" status="ok" icon={Cpu} />
        <StatusItem label="Obfuscation Engine" detail="Polymorphic" status="ok" icon={Activity} />
        <StatusItem label="Database Cluster" detail="Synchronized" status="ok" icon={Database} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Global Blacklist Management */}
        <Card className="lg:col-span-2 overflow-hidden border-red-500/10">
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-dark-800/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" /> Global Blacklist Manager
            </h3>
            <Button size="sm" variant="outline">
               <RefreshCw className="h-4 w-4 mr-2" /> Sync Nodes
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark-900 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="p-4">Entity Type</th>
                  <th className="p-4">Value</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {globalBlacklist.map(entry => (
                  <tr key={entry.id} className="hover:bg-red-500/5 transition-colors">
                    <td className="p-4">
                      <Badge variant={entry.type === 'hwid' ? 'info' : 'warning'}>{entry.type.toUpperCase()}</Badge>
                    </td>
                    <td className="p-4 font-mono text-xs text-white">{entry.value}</td>
                    <td className="p-4 text-slate-400">{entry.reason}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => removeBlacklist(entry.id)}
                        className="text-slate-500 hover:text-red-500 p-1"
                        title="Unblacklist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* System Health */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> VM Performance
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Junk Density', value: '98%' },
                { label: 'Entropy Level', value: 'High' },
                { label: 'Tamper Resilience', value: '99.9%' },
                { label: 'Detection Bypass', value: 'Active' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-700/30 pb-2">
                  <span className="text-slate-400 text-sm">{stat.label}</span>
                  <span className="text-white font-mono text-sm">{stat.value}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs" size="sm">
               View Obfuscation Statistics
            </Button>
          </Card>

          <Card className="p-6 bg-red-500/5 border-red-500/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" /> Critical Alerts
            </h3>
            <div className="space-y-3">
              <div className="text-xs p-3 rounded bg-red-500/10 border border-red-500/20 text-red-200">
                Detected 42 brute-force attempts on VM key decoders in the last hour.
              </div>
              <div className="text-xs p-3 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
                Luraph-STUB v2 bypass attempt logged from IP range 185.x.x.x
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};