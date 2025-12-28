
import React, { useState } from 'react';
import { X, Shield, Lock, Code, ChevronRight, Check, AlertTriangle, FileCode } from 'lucide-react';
import { Button, Toggle } from './ui';
import { Script, UserPlan } from '../types';
import { obfuscateScript } from '../utils/luaGenerator';

interface ScriptModalProps {
  onClose: () => void;
  onCreate: (data: Partial<Script>) => void;
  userPlan: UserPlan;
  currentScriptCount: number;
}

export const ScriptModal = ({ onClose, onCreate, userPlan, currentScriptCount }: ScriptModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Plan Limits
  const PLAN_LIMITS = {
    free: 5,
    standard: 8,
    lifetime: 15
  };
  
  const MAX_OBFUSCATION = {
    free: 50, // Medium
    standard: 80, // Hard
    lifetime: 100 // Extreme
  };

  // Form State
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');
  const [sourceCode, setSourceCode] = useState(`print("Hello World from LuaShield")`);
  const [keySystem, setKeySystem] = useState(true);
  const [obfuscationLevel, setObfuscationLevel] = useState(30);

  const steps = [
    { num: 1, title: 'Source Code', icon: Code },
    { num: 2, title: 'Protection', icon: Shield },
    { num: 3, title: 'Key System', icon: Lock },
  ];

  // Validation Check
  if (currentScriptCount >= PLAN_LIMITS[userPlan]) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark-900 border border-red-500/30 p-8 rounded-2xl max-w-md text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Limit Reached</h2>
                <p className="text-slate-400 mb-6">
                    You have reached the limit of {PLAN_LIMITS[userPlan]} scripts for the {userPlan.toUpperCase()} plan. 
                    Please upgrade your plan to create more.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
  }

  const handleCreate = () => {
    if (!name) return alert("Script name required");

    setLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Create a temporary script object for the obfuscator
      const tempScript: any = {
          id: 'temp',
          name: name,
          keySystem,
          keys: [] 
      };

      // Generate the obfuscated code using the new one-line engine
      const obfuscated = obfuscateScript(sourceCode, tempScript, obfuscationLevel);
      
      const newScriptData: Partial<Script> = {
        name: name || "Untitled Script",
        gameId: gameId,
        sourceCode: sourceCode,
        keySystem: keySystem,
        status: 'active',
        created: new Date().toISOString().split('T')[0],
        executions: 0,
        keys: [], 
        obfuscatedCode: obfuscated,
        loadstring: "Local Script (No URL)", 
        expiresIn: 'Never'
      };
      
      onCreate(newScriptData);
      onClose();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-dark-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-dark-800">
          <h2 className="text-xl font-bold text-white">Create New Protected Script</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex border-b border-slate-700 bg-dark-800/50 overflow-x-auto">
          {steps.map((s) => (
            <div 
              key={s.num} 
              className={`flex items-center px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                step === s.num 
                  ? 'border-primary text-primary bg-primary/5' 
                  : step > s.num 
                    ? 'border-transparent text-green-400' 
                    : 'border-transparent text-slate-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                step === s.num ? 'bg-primary text-white' : step > s.num ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'
              }`}>
                {step > s.num ? <Check className="h-3 w-3" /> : s.num}
              </div>
              <span className="font-medium">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Script Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                    placeholder="e.g. Universal Auto Farm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Target Game (Optional)</label>
                  <input 
                    type="text" 
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="w-full bg-dark-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                    placeholder="Roblox Place ID or Name" 
                  />
                </div>
              </div>
              <div className="space-y-2 h-[400px] flex flex-col">
                <label className="text-sm font-medium text-slate-300">Lua Source Code</label>
                <div className="flex-1 relative">
                  <textarea 
                    className="w-full h-full bg-dark-800 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    placeholder="print('Hello World')..."
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                  />
                  <div className="absolute top-4 right-4 text-xs text-slate-500 bg-dark-900/80 px-2 py-1 rounded">Lua 5.1 / Luau</div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> Core Protection
                  </h3>
                  <div className="space-y-4">
                    {[
                      'Polymorphic VM Generator',
                      'Control Flow Flattening',
                      'String Encryption (XOR/Shift)',
                      'VM Virtualization (v3.5)',
                      '2000+ Junk Code Injection',
                      'Anti-Tamper & Anti-Debug'
                    ].map((feature, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg border border-slate-700/50 cursor-pointer hover:border-slate-600">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-primary focus:ring-primary bg-dark-700" />
                        <span className="text-slate-200">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-bold text-white">Obfuscation Intensity</label>
                    <span className={`text-sm font-medium ${obfuscationLevel > 80 ? 'text-red-400' : obfuscationLevel > 50 ? 'text-primary' : 'text-blue-400'}`}>
                        {obfuscationLevel <= 30 ? 'Basic' : obfuscationLevel <= 50 ? 'Medium' : obfuscationLevel <= 80 ? 'Hard' : 'Extreme'}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" 
                    value={obfuscationLevel}
                    onChange={(e) => setObfuscationLevel(Math.min(parseInt(e.target.value), MAX_OBFUSCATION[userPlan]))}
                    max={100}
                  />
                  
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>Hard</span>
                    <span>Extreme</span>
                  </div>
                  
                  {MAX_OBFUSCATION[userPlan] < 100 && (
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-200">
                          <Lock className="h-3 w-3 inline mr-1" />
                          Higher levels locked. Upgrade plan to unlock Hard/Extreme obfuscation.
                      </div>
                  )}

                  <p className="text-xs text-slate-400 mt-4">
                    Current Limit: {MAX_OBFUSCATION[userPlan]}% ({userPlan} plan)
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
               <div className="bg-dark-800 p-6 rounded-xl border border-slate-700">
                 <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/20 rounded-lg text-primary">
                       <Lock className="h-6 w-6" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-white">Key System</h3>
                       <p className="text-sm text-slate-400">Require a key to execute this script</p>
                     </div>
                   </div>
                   <Toggle enabled={keySystem} onChange={setKeySystem} />
                 </div>
                 
                 {keySystem && (
                     <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-200 mb-2 font-semibold">Local Verification Mode</p>
                        <p className="text-xs text-slate-400">
                             The script will be generated with embedded verification logic and a polymorphic VM wrapper. 
                             No external server required for this demo.
                         </p>
                     </div>
                 )}
               </div>

                <div className="text-center pt-4">
                    <Button size="lg" onClick={handleCreate} disabled={loading} className="w-full">
                        {loading ? 'Obfuscating...' : 'Generate Protected Script'}
                    </Button>
                </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-dark-800 flex justify-between">
          <Button 
            variant="ghost" 
            onClick={() => step > 1 && setStep(step - 1)}
            className={step === 1 ? 'invisible' : ''}
          >
            Back
          </Button>
          
          {step < 3 && (
            <Button onClick={() => setStep(step + 1)}>
              Next Step <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
