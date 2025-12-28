import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Copy, Eye, Trash2, Clock, Lock } from 'lucide-react';
import { Card, Button, Badge, Toggle } from './ui';
import { Script, UserPlan } from '../types';
import { ScriptModal } from './ScriptModal';
import { ScriptDetails } from './ScriptDetails';

interface DashboardProps {
  scripts: Script[];
  onCreateScript: (data: Partial<Script>) => void;
  onDeleteScript: (id: string) => void;
  onToggleScript: (id: string) => void;
  onGenerateKeys: (scriptId: string, amount: number, note: string, maxUses: number) => void;
  onRevokeKey: (scriptId: string, keyId: string) => void;
  onUpdateScript: (script: Script) => void;
  userPlan: UserPlan;
}

export const Dashboard = ({ 
  scripts, 
  onCreateScript, 
  onDeleteScript, 
  onToggleScript,
  onGenerateKeys,
  onRevokeKey,
  onUpdateScript,
  userPlan
}: DashboardProps) => {
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);

  const filteredScripts = scripts.filter(s => {
    const matchesFilter = filter === 'All' || s.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this script? This cannot be undone.')) {
      onDeleteScript(id);
    }
  };

  const handleToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onToggleScript(id);
  };

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  };

  // If a script is selected, show details view
  if (selectedScriptId) {
    const script = scripts.find(s => s.id === selectedScriptId);
    if (script) {
      return (
        <ScriptDetails 
          script={script} 
          onBack={() => setSelectedScriptId(null)} 
          onGenerateKeys={onGenerateKeys}
          onRevokeKey={onRevokeKey}
          onUpdateScript={onUpdateScript}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-dark-800 p-4 rounded-xl border border-slate-700/50">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search scripts by name or ID..."
            className="w-full bg-dark-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-slate-700 rounded-lg text-slate-300 hover:text-white">
              <Filter className="h-4 w-4" />
              <span>{filter}</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-dark-800 border border-slate-700 rounded-lg shadow-xl py-1 hidden group-hover:block z-20">
              {['All', 'Active', 'Disabled', 'Expired', 'Paused'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <Button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" /> Create Script
          </Button>
        </div>
      </div>

      {/* Script Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredScripts.map(script => (
          <div key={script.id} onClick={() => setSelectedScriptId(script.id)} className="cursor-pointer">
            <Card className="p-0 hover:border-primary/50 transition-colors group h-full flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{script.name}</h3>
                    <div className="text-xs text-slate-500 font-mono mt-1">{script.id}</div>
                  </div>
                  <Badge variant={
                    script.status === 'active' ? 'success' : 
                    script.status === 'disabled' ? 'neutral' : 
                    script.status === 'blocked' ? 'error' : 'warning'
                  }>
                    {script.status}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Executions</span>
                      <span>{script.executions.toLocaleString()} {script.maxExecutions ? `/ ${script.maxExecutions.toLocaleString()}` : ''}</span>
                    </div>
                    <div className="h-1.5 w-full bg-dark-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, (script.executions / (script.maxExecutions || script.executions * 1.5)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-500" />
                      {script.expiresIn || 'Never'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-slate-500" />
                      {script.keySystem ? 'Keys: ' + (script.keys?.length || 0) : 'No Key System'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-900/50 p-4 border-t border-slate-700/50 flex justify-between items-center mt-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  <button 
                    className="p-2 hover:bg-dark-700 rounded-lg text-slate-400 hover:text-white transition-colors" 
                    title="View Details"
                    onClick={(e) => { e.stopPropagation(); setSelectedScriptId(script.id); }}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 hover:bg-dark-700 rounded-lg text-slate-400 hover:text-primary transition-colors" 
                    title="Copy URL"
                    onClick={(e) => handleCopy(e, script.loadstring)}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Toggle enabled={script.status === 'active'} onChange={(val) => onToggleScript(script.id)} />
                  <button 
                    onClick={(e) => handleDelete(e, script.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredScripts.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <div className="inline-block p-4 rounded-full bg-dark-800 mb-4">
            <Search className="h-8 w-8 text-slate-600" />
          </div>
          <p>No scripts found. Create your first protected script!</p>
        </div>
      )}

      {isModalOpen && (
        <ScriptModal 
          onClose={() => setIsModalOpen(false)} 
          onCreate={(data) => {
            onCreateScript(data);
            setIsModalOpen(false);
          }}
          userPlan={userPlan}
          currentScriptCount={scripts.length}
        />
      )}
    </div>
  );
};