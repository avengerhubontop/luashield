import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, QrCode, RefreshCw, Trash2, Shield, Lock, Activity, MapPin, Key as KeyIcon, CheckCircle, Ban, Save, Globe, Code, Plus, Github, ExternalLink, FileText, FileCode } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Script, Key, BlacklistEntry } from '../types';
import { Card, Button, Badge, Toggle } from './ui';
import { CHART_DATA } from '../constants';
import { obfuscateScript } from '../utils/luaGenerator';

interface ScriptDetailsProps {
  script: Script;
  onBack: () => void;
  onGenerateKeys: (scriptId: string, amount: number, note: string, maxUses: number) => void;
  onRevokeKey: (scriptId: string, keyId: string) => void;
  onUpdateScript: (script: Script) => void;
}

export const ScriptDetails = ({ script, onBack, onGenerateKeys, onRevokeKey, onUpdateScript }: ScriptDetailsProps) => {
  const [keyAmount, setKeyAmount] = useState(1);
  const [keyNote, setKeyNote] = useState('');
  const [keyMaxUses, setKeyMaxUses] = useState(1);
  const [showKeyGen, setShowKeyGen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'code' | 'blacklist'>('overview');
  
  // Config State
  const [webhookUrl, setWebhookUrl] = useState(script.webhookUrl || '');
  const [isDirty, setIsDirty] = useState(false);

  // Blacklist State
  const [blacklistType, setBlacklistType] = useState<'hwid' | 'ip'>('hwid');
  const [blacklistValue, setBlacklistValue] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');

  // Re-obfuscation state needed if keys change (since it's local logic now)
  const [currentCode, setCurrentCode] = useState(script.obfuscatedCode || "");

  useEffect(() => {
    setWebhookUrl(script.webhookUrl || '');
    // If we have keys, we might want to refresh the code display if it depends on them.
    // For this simple version, we'll just use what's stored or re-generate if missing.
    if (!script.obfuscatedCode && script.sourceCode) {
         setCurrentCode(obfuscateScript(script.sourceCode, script));
    } else {
         setCurrentCode(script.obfuscatedCode || "-- No code available");
    }
  }, [script.id, script.obfuscatedCode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSaveConfig = () => {
    onUpdateScript({
      ...script,
      webhookUrl: webhookUrl
    });
    setIsDirty(false);
    alert("Configuration saved successfully!");
  };

  const handleAddToBlacklist = () => {
      if (!blacklistValue) return;
      const newEntry: BlacklistEntry = {
          id: `bl_${Date.now()}`,
          type: blacklistType,
          value: blacklistValue,
          reason: blacklistReason || 'No reason provided',
          date: new Date().toISOString().split('T')[0]
      };
      
      const updatedBlacklist = [...(script.blacklist || []), newEntry];
      onUpdateScript({
          ...script,
          blacklist: updatedBlacklist
      });
      setBlacklistValue('');
      setBlacklistReason('');
      alert("Added to blacklist successfully");
  };

  const handleRemoveFromBlacklist = (id: string) => {
      const updatedBlacklist = (script.blacklist || []).filter(b => b.id !== id);
      onUpdateScript({
          ...script,
          blacklist: updatedBlacklist
      });
  };
  
  // When keys are generated, we should technically re-obfuscate to include them
  // in the local check logic.
  const handleGenerateKeysWrapper = (scriptId: string, amount: number, note: string, maxUses: number) => {
      onGenerateKeys(scriptId, amount, note, maxUses);
      // In a real app, this would trigger a re-build of the script.
      // We will simulate this by updating the view locally, 
      // although the parent state update needs to happen first.
      setTimeout(() => {
          // Re-fetch logic would happen here in a real app
      }, 100);
      alert("Keys generated. You may need to re-copy the script to include new keys.");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            {script.name}
            <Badge variant={script.status === 'active' ? 'success' : 'error'}>{script.status}</Badge>
          </h2>
          <p className="text-slate-400 text-sm font-mono mt-1">ID: {script.id}</p>
        </div>
        <div className="flex gap-2">
           <Button variant={activeTab === 'overview' ? 'primary' : 'ghost'} size="sm" onClick={() => setActiveTab('overview')}>Overview</Button>
           <Button variant={activeTab === 'blacklist' ? 'primary' : 'ghost'} size="sm" onClick={() => setActiveTab('blacklist')}>Blacklist</Button>
           <Button variant={activeTab === 'config' ? 'primary' : 'ghost'} size="sm" onClick={() => setActiveTab('config')}>Configuration</Button>
           <Button variant={activeTab === 'code' ? 'primary' : 'ghost'} size="sm" onClick={() => setActiveTab('code')}>View Code</Button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Stats & Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Output Code Card */}
            <Card className="p-6 bg-gradient-to-br from-dark-800 to-dark-900 border-primary/20">
              <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-slate-400 uppercase flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-primary" /> Obfuscated Output
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(currentCode)}>
                      <Copy className="h-4 w-4 mr-2" /> Copy Code
                  </Button>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-slate-700/50 relative group">
                <div className="h-32 overflow-hidden relative">
                    <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap break-all opacity-50 select-none">
                        {currentCode}
                    </pre>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent flex items-end justify-center pb-4">
                        <Button variant="secondary" size="sm" onClick={() => setActiveTab('code')}>
                             View Full Script
                        </Button>
                    </div>
                </div>
              </div>
            </Card>

            {/* Charts */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Execution Analytics</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorExecDetails" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748B" axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
                    />
                    <Area type="monotone" dataKey="executions" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorExecDetails)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Right Column: Key System */}
          <div className="space-y-6">
            <Card className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <KeyIcon className="h-5 w-5 text-secondary" /> Key System
                  </h3>
                  <Toggle enabled={script.keySystem} onChange={() => {}} />
                </div>

                {!showKeyGen ? (
                  <Button onClick={() => setShowKeyGen(true)} className="w-full mb-6">
                    Generate New Keys
                  </Button>
                ) : (
                  <div className="bg-dark-900/50 p-4 rounded-lg border border-slate-700 mb-6 space-y-3">
                    <div>
                      <label className="text-xs text-slate-400">Amount</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="50"
                        value={keyAmount}
                        onChange={(e) => setKeyAmount(parseInt(e.target.value))}
                        className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-sm text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Max Uses</label>
                      <input 
                        type="number" 
                        value={keyMaxUses}
                        onChange={(e) => setKeyMaxUses(parseInt(e.target.value))}
                        className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-sm text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Note (User/Buyer)</label>
                      <input 
                        type="text" 
                        value={keyNote}
                        onChange={(e) => setKeyNote(e.target.value)}
                        placeholder="e.g. Discord User #1234"
                        className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-sm text-white" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          handleGenerateKeysWrapper(script.id, keyAmount, keyNote, keyMaxUses);
                          setShowKeyGen(false);
                        }}
                      >
                        Generate
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowKeyGen(false)}>Cancel</Button>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-auto max-h-[400px]">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-slate-500 uppercase bg-dark-900/50 sticky top-0">
                      <tr>
                        <th className="p-2">Key / Note</th>
                        <th className="p-2 text-center">Uses</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {script.keys && script.keys.length > 0 ? (
                        script.keys.map(key => (
                          <tr key={key.id} className="group hover:bg-white/5">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${key.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <div className="flex flex-col">
                                  <span className="font-mono text-xs text-slate-300">{key.value.substring(0, 12)}...</span>
                                  <span className="text-[10px] text-slate-500">{key.note || 'No note'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-2 text-center text-slate-400 text-xs">
                              {key.currentUses} / {key.maxUses}
                            </td>
                            <td className="p-2 text-right">
                              <button 
                                onClick={() => onRevokeKey(script.id, key.id)}
                                className="text-slate-500 hover:text-red-400" 
                                title="Revoke Key"
                              >
                                <Ban className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => handleCopy(key.value)}
                                className="text-slate-500 hover:text-primary ml-2" 
                                title="Copy Key"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-slate-500 text-xs">
                            No keys generated yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'blacklist' && (
          <div className="max-w-4xl mx-auto space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Ban className="h-5 w-5 text-red-500" /> Access Control Blacklist
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <select 
                        className="bg-dark-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none"
                        value={blacklistType}
                        onChange={(e) => setBlacklistType(e.target.value as 'hwid' | 'ip')}
                    >
                        <option value="hwid">Block HWID</option>
                        <option value="ip">Block IP Address</option>
                    </select>
                    <input 
                        type="text" 
                        placeholder={blacklistType === 'hwid' ? "HWID string..." : "192.168.1.1"}
                        className="bg-dark-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none col-span-2"
                        value={blacklistValue}
                        onChange={(e) => setBlacklistValue(e.target.value)}
                    />
                    <Button onClick={handleAddToBlacklist}>
                        <Plus className="h-4 w-4 mr-2" /> Block User
                    </Button>
                </div>
                
                <input 
                    type="text" 
                    placeholder="Reason (Optional)"
                    className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none mb-6"
                    value={blacklistReason}
                    onChange={(e) => setBlacklistReason(e.target.value)}
                />
              </Card>
          </div>
      )}

      {activeTab === 'config' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
               <Globe className="h-6 w-6 text-primary" />
               <h3 className="text-xl font-bold text-white">Webhook Integrations</h3>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Discord Webhook URL</label>
                  <input 
                    type="text" 
                    value={webhookUrl}
                    onChange={(e) => {
                      setWebhookUrl(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    LuaShield will send execution logs, failed key attempts, and tamper alerts to this webhook.
                  </p>
               </div>
               
               <div className="pt-4 border-t border-slate-700/50 flex justify-end">
                  <Button 
                    onClick={handleSaveConfig} 
                    disabled={!isDirty}
                    variant={isDirty ? 'primary' : 'secondary'}
                  >
                    <Save className="h-4 w-4 mr-2" /> Save Configuration
                  </Button>
               </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="space-y-4">
           <Card className="p-6 h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-secondary" />
                    <h3 className="text-lg font-bold text-white">Full Obfuscated Script</h3>
                 </div>
                 <Button size="sm" onClick={() => handleCopy(currentCode)}>
                    <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
                 </Button>
              </div>
              <div className="flex-1 relative bg-dark-900 rounded-lg overflow-hidden border border-slate-700">
                 <textarea 
                   readOnly 
                   value={currentCode}
                   className="w-full h-full bg-transparent p-4 text-xs font-mono text-slate-300 resize-none focus:outline-none"
                 />
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};