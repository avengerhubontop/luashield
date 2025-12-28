
import React from 'react';
import { Card, Button } from './ui';
import { Globe, AlertTriangle, Shield, Activity } from 'lucide-react';

export const WebhooksPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900/50 to-dark-800 p-8 rounded-2xl border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-4">Webhook Integration</h2>
        <p className="text-slate-400 max-w-3xl">
          Connect your protected scripts to Discord to receive real-time alerts about executions, 
          security threats, and key usage. Configure webhooks individually for each script in the Script Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
             <Activity className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Execution Logs</h3>
          <p className="text-slate-400 text-sm">
            Receive detailed embeds when a user successfully executes your script, including their HWID, Country, and Executor.
          </p>
        </Card>

        <Card className="p-6">
           <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
             <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Security Alerts</h3>
          <p className="text-slate-400 text-sm">
             Instant notifications when someone tries to tamper with your script, use an invalid key, or run it in a blacklisted environment.
          </p>
        </Card>
        
        <Card className="p-6">
           <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
             <Shield className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Identify Executor</h3>
          <p className="text-slate-400 text-sm">
             Automatically capture the executor name (Synapse, Script-Ware, Krnl, etc.) using our advanced detection logic.
          </p>
        </Card>
      </div>

      <Card className="p-8 border-l-4 border-l-primary">
         <h3 className="text-xl font-bold text-white mb-4">How to Setup</h3>
         <ol className="list-decimal list-inside space-y-4 text-slate-300">
            <li>Create a Webhook in your Discord Server (Channel Settings &gt; Integrations &gt; Webhooks).</li>
            <li>Copy the Webhook URL.</li>
            <li>Go to the <strong>Dashboard</strong> tab in LuaShield.</li>
            <li>Select the script you want to monitor.</li>
            <li>Click on the <strong>Configuration</strong> tab.</li>
            <li>Paste your Webhook URL and click Save.</li>
         </ol>
      </Card>
    </div>
  );
};
