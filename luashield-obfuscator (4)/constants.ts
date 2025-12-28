import { Script, LogEntry, Stats } from './types';

export const MOCK_STATS: Stats = {
  totalScripts: 142,
  activeUsers: 84,
  cracksBlocked: 12059,
  uptime: "99.99%"
};

// Start with empty data as requested
export const MOCK_SCRIPTS: Script[] = [];

export const MOCK_LOGS: LogEntry[] = [];

export const CHART_DATA = [
  { name: '00:00', executions: 0, blocked: 0 },
  { name: '04:00', executions: 0, blocked: 0 },
  { name: '08:00', executions: 0, blocked: 0 },
  { name: '12:00', executions: 0, blocked: 0 },
  { name: '16:00', executions: 0, blocked: 0 },
  { name: '20:00', executions: 0, blocked: 0 },
  { name: '23:59', executions: 0, blocked: 0 },
];