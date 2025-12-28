
import React, { useState } from 'react';
import { Card, Button, Badge } from './ui';
import { Cloud, FileCode, Upload, Server, Globe, Download, Copy, Check, Terminal, Lock } from 'lucide-react';
import { Script } from '../types';
import { generateHostHtml } from '../utils/htmlGenerator';

interface HostingPageProps {
  scripts: Script[];
}

export const HostingPage = ({ scripts }: HostingPageProps) => {
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const activeScripts = scripts.filter(s => s.status === 'active');

  const handleDeploy = (script: Script) => {
    setIsDeploying(true);
    setTimeout(() => {
      setSelectedScript(script);
      setIsDeploying(false);
    }, 1200);
  };

  const handleDownloadHtml = (script: Script) => {
    const html = generateHostHtml(script);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.name.replace(/\s+/g, '_')}_Secure.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900/50 to-dark-800 p-8 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
                <Cloud className="h-8 w-8 text-blue-400" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">LuaShield Cloud Host</h2>
                <p className="text-slate-400">
                    The destination server for your protected assets. Scripts deployed here are embedded inside 
                    stealthy HTML pages waiting to be scraped by the loader.
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Script List */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ready to Deploy</h3>
                <Badge variant="info">{activeScripts.length} Scripts</Badge>
            </div>
            
            {activeScripts.map(script => (
                <div key={script.id}>
                    <Card className={`p-4 cursor-pointer transition-all ${selectedScript?.id === script.id ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-slate-500'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-white">{script.name}</div>
                            <Server className={`h-4 w-4 ${selectedScript?.id === script.id ? 'text-blue-400' : 'text-slate-600'}`} />
                        </div>
                        <div className="text-xs text-slate-500 font-mono mb-4">{script.id}</div>
                        <Button 
                            size="sm" 
                            variant={selectedScript?.id === script.id ? 'primary' : 'outline'} 
                            className="w-full"
                            onClick={() => handleDeploy(script)}
                        >
                            {selectedScript?.id === script.id ? 'Viewing Host Data' : 'Deploy to Cloud'}
                        </Button>
                    </Card>
                </div>
            ))}
        </div>

        {/* Right: Server View / Terminal */}
        <div className="lg:col-span-2">
            <Card className="h-full min-h-[500px] flex flex-col bg-[#0c0c0c] border-slate-800">
                {/* Mock Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-dark-900">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="flex-1 bg-dark-800 rounded px-3 py-1 text-xs font-mono text-slate-500 text-center flex items-center justify-center gap-2">
                        <Lock className="h-3 w-3" />
                        cloud.luashield.net/storage/{selectedScript ? selectedScript.id : '...'}
                    </div>
                    <Globe className="h-4 w-4 text-slate-600" />
                </div>

                {isDeploying ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-blue-400 gap-4">
                        <Upload className="h-12 w-12 animate-bounce" />
                        <div className="font-mono text-sm">Uploading script payload to secure storage...</div>
                    </div>
                ) : selectedScript ? (
                    <div className="flex-1 p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">{selectedScript.name}.html</h2>
                                <div className="text-green-400 text-xs flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Live & Hosted
                                </div>
                            </div>
                            <Button variant="secondary" onClick={() => handleDownloadHtml(selectedScript)}>
                                <Download className="h-4 w-4 mr-2" /> Download HTML File
                            </Button>
                        </div>

                        {/* Terminal / Live Logs simulation */}
                        <div className="bg-black rounded-lg border border-slate-800 p-4 font-mono text-xs space-y-1 h-64 overflow-y-auto custom-scrollbar">
                            <div className="text-slate-500"># Cloud Storage Logs - {new Date().toLocaleDateString()}</div>
                            <div className="text-green-500">$ waiting for incoming scripts...</div>
                            <div className="text-slate-300">[INFO] Received payload for "{selectedScript.name}"</div>
                            <div className="text-slate-300">[INFO] Encrypting source code (AES-256)...</div>
                            <div className="text-slate-300">[INFO] Embedding into Stealth HTML Template (404_Mock)...</div>
                            <div className="text-slate-300">[INFO] File generated successfully. Size: 142KB</div>
                            <div className="text-blue-400">[NET] Waiting for Loader requests from Roblox Client...</div>
                            <div className="text-slate-500 animate-pulse">$ _</div>
                        </div>

                        {/* Code Preview */}
                        <div>
                            <div className="text-xs text-slate-400 mb-2 uppercase font-bold">Generated Host HTML (Preview)</div>
                            <div className="bg-dark-800 rounded p-4 border border-slate-700/50 h-32 overflow-hidden relative group">
                                <pre className="text-[10px] text-slate-300 font-mono">
                                    {generateHostHtml(selectedScript)}
                                </pre>
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent"></div>
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="ghost">View Full Source</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4">
                        <Server className="h-16 w-16 opacity-20" />
                        <div>Select a script from the left to deploy it to the cloud.</div>
                    </div>
                )}
            </Card>
        </div>
      </div>
    </div>
  );
};
