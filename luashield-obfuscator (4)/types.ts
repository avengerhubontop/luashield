export interface Key {
  id: string;
  value: string;
  status: 'active' | 'revoked' | 'expired';
  hwid: string | null;
  maxUses: number;
  currentUses: number;
  note?: string;
  created: string;
}

export interface BlacklistEntry {
  id: string;
  type: 'hwid' | 'ip';
  value: string;
  reason: string;
  date: string;
}

export interface GitHubConfig {
  username: string;
  repo: string;
  branch: string;
  token?: string;
  scriptPath: string;
  keyPath: string;
}

export interface Script {
  id: string;
  name: string;
  created: string;
  status: 'active' | 'disabled' | 'expired' | 'paused' | 'blocked';
  executions: number;
  maxExecutions?: number;
  keySystem: boolean;
  expiresIn?: string;
  loadstring: string;
  obfuscatedCode?: string;
  sourceCode?: string; 
  gameId?: string;
  keys?: Key[]; 
  webhookUrl?: string; 
  blacklist?: BlacklistEntry[]; 
  github?: GitHubConfig;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'success' | 'failed' | 'suspicious' | 'blocked';
  scriptName: string;
  hwid: string;
  ip: string;
  country: string;
  message?: string;
}

export interface Stats {
  totalScripts: number;
  activeUsers: number;
  cracksBlocked: number;
  uptime: string;
}

export type ViewState = 'landing' | 'dashboard' | 'logs' | 'webhooks' | 'pricing' | 'admin' | 'login';

export type UserPlan = 'free' | 'standard' | 'lifetime';

export interface User {
  name: string;
  role: string;
  avatar: string;
  balance: number;
  plan: UserPlan;
  isAdmin: boolean;
  isAuthenticated: boolean;
}