import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogEntry } from '../types';
import { CHART_DATA } from '../constants';
import { Card, Badge, Button } from './ui';
import { Filter, Download, Ban, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface LogsPageProps {
  logs: LogEntry[];
}

export const LogsPage = ({ logs }: LogsPageProps) => {
  return (
    <div className="space-y-6">
      {/* Analytics Chart */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Execution Traffic & Threats</h3>
          <div className="flex gap-2">
            <select className="bg-dark-900 border border-slate-700 rounded-lg text-sm px-3 py-1 text-slate-300 outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorExec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBlock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false} />
              <YAxis stroke="#64748B" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
                itemStyle={{ color: '#F8FAFC' }}
              />
              <Area type="monotone" dataKey="executions" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorExec)" />
              <Area type="monotone" dataKey="blocked" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBlock)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Logs Table Section */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-800">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <Button size="sm" variant="secondary" className="whitespace-nowrap">All Logs</Button>
             <Button size="sm" variant="ghost" className="whitespace-nowrap">Success</Button>
             <Button size="sm" variant="ghost" className="whitespace-nowrap">Blocked</Button>
             <Button size="sm" variant="ghost" className="whitespace-nowrap">Suspicious</Button>
          </div>
          <div className="flex gap-2">
             <Button size="sm" variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
             <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-dark-900/50 text-xs uppercase font-medium text-slate-500">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Script</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors animate-in fade-in duration-300">
                  <td className="px-6 py-4">
                    {log.type === 'success' && <Badge variant="success"><CheckCircle className="h-3 w-3 inline mr-1" /> Success</Badge>}
                    {log.type === 'blocked' && <Badge variant="error"><Ban className="h-3 w-3 inline mr-1" /> Blocked</Badge>}
                    {log.type === 'suspicious' && <Badge variant="warning"><AlertTriangle className="h-3 w-3 inline mr-1" /> Flagged</Badge>}
                    {log.type === 'failed' && <Badge variant="neutral"><XCircle className="h-3 w-3 inline mr-1" /> Failed</Badge>}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{log.timestamp}</td>
                  <td className="px-6 py-4 text-white font-medium">{log.scriptName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-mono text-xs">{log.hwid}</span>
                      <span className="text-xs">{log.ip} • {log.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {log.message || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-red-400 p-1" title="Ban HWID">
                      <Ban className="h-4 w-4" />
                    </button>
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