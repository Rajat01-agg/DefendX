import type {
  Job, Finding, Action, Report, GlobalStat, Domain, Severity
} from '../types/schema'

// ── Global Stats (singleton) ──────────────────────────────────────────────

export const mockGlobalStat: GlobalStat = {
  id: 'singleton',
  totalJobs: 247,
  totalLogs: 142892,
  totalFindings: 624,
  totalActions: 854,
  lastUpdated: new Date().toISOString(),
}

// ── Mock Findings ─────────────────────────────────────────────────────────

export const mockFindings: Finding[] = [
  {
    id: 'f1', jobId: 'job-001', findingId: 'INC-001',
    domain: 'http', classification: 'sql_injection', severity: 'critical', confidence: 0.97,
    context: { service: 'api-gateway', app: 'user-query-svc', environment: 'production' },
    offender: { type: 'ip', value: '185.220.101.45' },
    metrics: { event_count: 34, unique_targets: 2, success_count: 0, failure_count: 34 },
    timeWindowFrom: BigInt(Date.now() - 3600_000),
  timeWindowTo: BigInt(Date.now()),
    evidenceSamples: [
      'POST /api/v2/query body contains UNION SELECT',
      'Repeated payload obfuscation attempts detected',
    ],
    summary: 'Automated SQL injection payload detected targeting production database endpoint via api-gateway.',
    createdAt: '2026-04-09T09:41:00Z',
    actions: [],
  },
  {
    id: 'f2', jobId: 'job-001', findingId: 'INC-002',
    domain: 'http', classification: 'ddos', severity: 'high', confidence: 0.92,
    context: { service: 'payment-gateway', app: 'payment-router', environment: 'production' },
    offender: { type: 'ip', value: '103.45.xx.xx' },
    metrics: { event_count: 450000, unique_targets: 3, success_count: 0, failure_count: 450000 },
    timeWindowFrom: BigInt(Date.now() - 7200_000), timeWindowTo: BigInt(Date.now()),
    evidenceSamples: [
      'UDP flood rate: 450k pps from 847 unique source IPs',
      'Botnet C2 signature matched against threat feed',
    ],
    summary: 'Anomalous UDP flood pattern detected targeting Payment regional gateway nodes.',
    createdAt: '2026-04-09T08:22:00Z',
    actions: [],
  },
  {
    id: 'f3', jobId: 'job-002', findingId: 'INC-003',
    domain: 'auth', classification: 'brute_force', severity: 'high', confidence: 0.95,
    context: { service: 'iam-auth', app: 'iam-auth', environment: 'production' },
    offender: { type: 'ip', value: '103.4xx.xx.x' },
    metrics: { event_count: 127, unique_targets: 5, success_count: 0, failure_count: 127 },
    timeWindowFrom: BigInt(Date.now() - 5400_000), timeWindowTo: BigInt(Date.now()),
    evidenceSamples: [
      'auth_fail user="root" ip=103.4xx.xx.x attempts=42',
      'auth_fail user="admin" ip=103.4xx.xx.x attempts=85',
    ],
    summary: 'Multiple failed login attempts detected on Identity Services API from single source IP.',
    createdAt: '2026-04-09T07:30:00Z',
    actions: [],
  },
  {
    id: 'f4', jobId: 'job-002', findingId: 'INC-004',
    domain: 'auth', classification: 'credential_stuffing', severity: 'medium', confidence: 0.84,
    context: { service: 'customer-portal', app: 'auth-portal', environment: 'production' },
    offender: { type: 'ip', value: '45.33.xx.xx' },
    metrics: { event_count: 89, unique_targets: 23, success_count: 3, failure_count: 86 },
    timeWindowFrom: Date.now() - 10800_000, timeWindowTo: Date.now(),
    evidenceSamples: [
      'Unusual login frequency: 89 attempts in 15 min from 45.33.xx.xx',
      '3 successful logins to different accounts from same IP',
    ],
    summary: 'Credential stuffing pattern detected across Customer web portal with partial success.',
    createdAt: '2026-04-09T05:55:00Z',
    actions: [],
  },
  {
    id: 'f5', jobId: 'job-003', findingId: 'INC-005',
    domain: 'infra', classification: 'resource_exhaustion', severity: 'critical', confidence: 0.98,
    context: { service: 'k8s-cluster-07', app: 'payment-processor', environment: 'production' },
    offender: { type: 'service', value: 'payment-processor-pod-xz91' },
    metrics: { event_count: 5, unique_targets: 1, success_count: 0, failure_count: 5 },
    timeWindowFrom: Date.now() - 1800_000, timeWindowTo: Date.now(),
    evidenceSamples: [
      'OOMKilled: payment-processor-pod-xz91 memory=7.8Gi/8Gi',
      'Restart count: 5 in last 30 minutes',
    ],
    summary: 'Payment processor pod repeatedly OOMKilled. Resource exhaustion indicates possible memory leak or attack payload.',
    createdAt: '2026-04-09T04:10:00Z',
    actions: [],
  },
  {
    id: 'f6', jobId: 'job-003', findingId: 'INC-006',
    domain: 'auth', classification: 'session_hijacking', severity: 'high', confidence: 0.88,
    context: { service: 'session-mgr', app: 'user-portal', environment: 'production' },
    offender: { type: 'user', value: 'j.doe@corp.co' },
    metrics: { event_count: 2, unique_targets: 1, success_count: 2, failure_count: 0 },
    timeWindowFrom: Date.now() - 14400_000, timeWindowTo: Date.now(),
    evidenceSamples: [
      'Session token reuse from Delhi (10:14 AM) and London (10:18 AM)',
      'Impossible travel: 6,700 km in 4 minutes',
    ],
    summary: 'Impossible travel detected for user j.doe@corp.co. Session token likely compromised.',
    createdAt: '2026-04-09T02:15:00Z',
    actions: [],
  },
  {
    id: 'f7', jobId: 'job-004', findingId: 'INC-007',
    domain: 'infra', classification: 'config_drift', severity: 'medium', confidence: 0.91,
    context: { service: 'k8s-cluster-07', app: 'ingress-controller', environment: 'staging' },
    offender: { type: 'service', value: 'ingress-nginx-controller' },
    metrics: { event_count: 1, unique_targets: 1, success_count: 0, failure_count: 1 },
    timeWindowFrom: Date.now() - 21600_000, timeWindowTo: Date.now(),
    evidenceSamples: [
      'ConfigMap nginx-config: TLS minVersion changed from 1.2 to 1.0',
      'Policy violation: downgrade detected vs golden config',
    ],
    summary: 'Kubernetes ingress config deviation detected. TLS minimum version downgraded.',
    createdAt: '2026-04-08T18:00:00Z',
    actions: [],
  },
  {
    id: 'f8', jobId: 'job-004', findingId: 'INC-008',
    domain: 'http', classification: 'port_scan', severity: 'low', confidence: 0.72,
    context: { service: 'edge-firewall', app: 'perimeter-scan', environment: 'production' },
    offender: { type: 'ip', value: '91.121.xx.xx' },
    metrics: { event_count: 1024, unique_targets: 1024, success_count: 12, failure_count: 1012 },
    timeWindowFrom: Date.now() - 28800_000, timeWindowTo: Date.now(),
    evidenceSamples: [
      'Sequential port scan: ports 1-1024 from 91.121.xx.xx',
      '12 open ports detected: 22, 80, 443, 3306, 5432, ...',
    ],
    summary: 'Full port scan detected from external IP targeting production perimeter.',
    createdAt: '2026-04-08T15:05:00Z',
    actions: [],
  },
]

// ── Mock Actions ──────────────────────────────────────────────────────────

export const mockActions: Action[] = [
  {
    id: 'a1', jobId: 'job-001', findingId: 'f1',
    domain: 'http', actionType: 'block_ip',
    description: 'Blocked IP 185.220.101.45 — SQL injection source quarantined at WAF layer',
    status: 'DONE', completedAt: '2026-04-09T09:41:03Z', createdAt: '2026-04-09T09:41:01Z',
  },
  {
    id: 'a2', jobId: 'job-001', findingId: 'f2',
    domain: 'http', actionType: 'rate_limit',
    description: 'Rate limit applied to 847 botnet source IPs targeting Payment gateway',
    status: 'DONE', completedAt: '2026-04-09T08:22:02Z', createdAt: '2026-04-09T08:22:01Z',
  },
  {
    id: 'a3', jobId: 'job-002', findingId: 'f3',
    domain: 'auth', actionType: 'block_ip',
    description: 'Blocked brute force source 103.4xx.xx.x on auth-api endpoint',
    status: 'DONE', completedAt: '2026-04-09T07:30:02Z', createdAt: '2026-04-09T07:30:01Z',
  },
  {
    id: 'a4', jobId: 'job-002', findingId: 'f4',
    domain: 'auth', actionType: 'alert_soc',
    description: 'SOC alert raised for credential stuffing — 3 successful compromises detected',
    status: 'DONE', completedAt: '2026-04-09T05:55:01Z', createdAt: '2026-04-09T05:55:01Z',
  },
  {
    id: 'a5', jobId: 'job-003', findingId: 'f5',
    domain: 'infra', actionType: 'manual_review',
    description: 'Manual review escalated — payment-processor pod OOMKilled 5 times',
    status: 'IN_PROGRESS', createdAt: '2026-04-09T04:10:01Z',
  },
  {
    id: 'a6', jobId: 'job-003', findingId: 'f6',
    domain: 'auth', actionType: 'block_ip',
    description: 'All active sessions revoked for j.doe@corp.co — impossible travel confirmed',
    status: 'DONE', completedAt: '2026-04-09T02:15:02Z', createdAt: '2026-04-09T02:15:01Z',
  },
  {
    id: 'a7', jobId: 'job-004', findingId: 'f7',
    domain: 'infra', actionType: 'alert_soc',
    description: 'Config drift alert — TLS downgrade on ingress-nginx-controller flagged',
    status: 'DONE', completedAt: '2026-04-08T18:00:02Z', createdAt: '2026-04-08T18:00:01Z',
  },
  {
    id: 'a8', jobId: 'job-004', findingId: 'f8',
    domain: 'http', actionType: 'block_ip',
    description: 'Blocked port scanner IP 91.121.xx.xx at perimeter firewall',
    status: 'DONE', completedAt: '2026-04-08T15:05:02Z', createdAt: '2026-04-08T15:05:01Z',
  },
]

// Wire actions into findings
mockFindings.forEach(f => {
  f.actions = mockActions.filter(a => a.findingId === f.id)
})

// ── Mock Jobs ─────────────────────────────────────────────────────────────

export const mockJobs: Job[] = [
  {
    id: 'j1', jobId: 'job-001', status: 'COMPLETED',
    windowFrom: Date.now() - 7200_000, windowTo: Date.now() - 3600_000,
    totalLogs: 48210, findingsCount: 2, actionsCount: 2,
    createdAt: '2026-04-09T08:00:00Z', completedAt: '2026-04-09T08:00:03Z',
    findings: mockFindings.filter(f => f.jobId === 'job-001'),
    actions: mockActions.filter(a => a.jobId === 'job-001'),
    domainStats: [
      { id: 'ds1', jobId: 'job-001', domain: 'http', logsProcessed: 42100, findingsCount: 2, actionsCount: 2 },
      { id: 'ds2', jobId: 'job-001', domain: 'auth', logsProcessed: 4200, findingsCount: 0, actionsCount: 0 },
      { id: 'ds3', jobId: 'job-001', domain: 'infra', logsProcessed: 1910, findingsCount: 0, actionsCount: 0 },
    ],
  },
  {
    id: 'j2', jobId: 'job-002', status: 'COMPLETED',
    windowFrom: Date.now() - 10800_000, windowTo: Date.now() - 7200_000,
    totalLogs: 35800, findingsCount: 2, actionsCount: 2,
    createdAt: '2026-04-09T05:00:00Z', completedAt: '2026-04-09T05:00:02Z',
    findings: mockFindings.filter(f => f.jobId === 'job-002'),
    actions: mockActions.filter(a => a.jobId === 'job-002'),
    domainStats: [
      { id: 'ds4', jobId: 'job-002', domain: 'http', logsProcessed: 8200, findingsCount: 0, actionsCount: 0 },
      { id: 'ds5', jobId: 'job-002', domain: 'auth', logsProcessed: 24100, findingsCount: 2, actionsCount: 2 },
      { id: 'ds6', jobId: 'job-002', domain: 'infra', logsProcessed: 3500, findingsCount: 0, actionsCount: 0 },
    ],
  },
  {
    id: 'j3', jobId: 'job-003', status: 'COMPLETED',
    windowFrom: Date.now() - 18000_000, windowTo: Date.now() - 10800_000,
    totalLogs: 28450, findingsCount: 2, actionsCount: 2,
    createdAt: '2026-04-09T02:00:00Z', completedAt: '2026-04-09T02:00:04Z',
    findings: mockFindings.filter(f => f.jobId === 'job-003'),
    actions: mockActions.filter(a => a.jobId === 'job-003'),
    domainStats: [
      { id: 'ds7', jobId: 'job-003', domain: 'http', logsProcessed: 5100, findingsCount: 0, actionsCount: 0 },
      { id: 'ds8', jobId: 'job-003', domain: 'auth', logsProcessed: 11200, findingsCount: 1, actionsCount: 1 },
      { id: 'ds9', jobId: 'job-003', domain: 'infra', logsProcessed: 12150, findingsCount: 1, actionsCount: 1 },
    ],
  },
  {
    id: 'j4', jobId: 'job-004', status: 'COMPLETED',
    windowFrom: Date.now() - 28800_000, windowTo: Date.now() - 18000_000,
    totalLogs: 30432, findingsCount: 2, actionsCount: 2,
    createdAt: '2026-04-08T15:00:00Z', completedAt: '2026-04-08T15:00:02Z',
    findings: mockFindings.filter(f => f.jobId === 'job-004'),
    actions: mockActions.filter(a => a.jobId === 'job-004'),
    domainStats: [
      { id: 'ds10', jobId: 'job-004', domain: 'http', logsProcessed: 18300, findingsCount: 1, actionsCount: 1 },
      { id: 'ds11', jobId: 'job-004', domain: 'auth', logsProcessed: 4100, findingsCount: 0, actionsCount: 0 },
      { id: 'ds12', jobId: 'job-004', domain: 'infra', logsProcessed: 8032, findingsCount: 1, actionsCount: 1 },
    ],
  },
  {
    id: 'j5', jobId: 'job-005', status: 'ANALYZING',
    windowFrom: Date.now() - 1800_000, windowTo: Date.now(),
    totalLogs: 12340, findingsCount: 0, actionsCount: 0,
    createdAt: new Date().toISOString(),
    findings: [],
    actions: [],
    domainStats: [
      { id: 'ds13', jobId: 'job-005', domain: 'http', logsProcessed: 6200, findingsCount: 0, actionsCount: 0 },
      { id: 'ds14', jobId: 'job-005', domain: 'auth', logsProcessed: 3800, findingsCount: 0, actionsCount: 0 },
      { id: 'ds15', jobId: 'job-005', domain: 'infra', logsProcessed: 2340, findingsCount: 0, actionsCount: 0 },
    ],
  },
]

// ── Mock Reports ──────────────────────────────────────────────────────────
// One Report per completed job — matches Prisma Report model exactly

export const mockReports: Report[] = [
  {
    id: 'r1',
    jobId: 'job-001',
    jsonReport: {
      jobId: 'job-001',
      windowFrom: Date.now() - 7200_000,
      windowTo: Date.now() - 3600_000,
      totalLogs: 48210,
      findings: mockFindings.filter(f => f.jobId === 'job-001'),
      actions: mockActions.filter(a => a.jobId === 'job-001'),
      metadata: { agentVersion: '4.2.0', analysisTimeMs: 2140, model: 'commander-v3' },
    },
    humanReport: `# SOC Report — Job job-001\n\n## Executive Summary\nTwo critical threats detected targeting HTTP layer infrastructure during the analysis window.\n\n## Findings\n\n### INC-001 — SQL Injection (CRITICAL)\n- **Source**: 185.220.101.45\n- **Target**: api-gateway / user-query-svc (production)\n- **Confidence**: 97%\n- 34 events detected, all blocked. UNION SELECT payload targeting user table.\n- **Action Taken**: IP quarantined at WAF layer.\n\n### INC-002 — DDoS (HIGH)\n- **Source**: 103.45.xx.xx (847 botnet nodes)\n- **Target**: upi-gateway / payment-router (production)\n- **Confidence**: 92%\n- 450,000 events detected. UDP flood at 450k pps.\n- **Action Taken**: Rate limiting applied to 847 source IPs.\n\n## Recommendation\nMonitor for persistence from the SQL injection source network block. Consider permanent blocklist.`,
    createdAt: '2026-04-09T08:00:03Z',
  },
  {
    id: 'r2',
    jobId: 'job-002',
    jsonReport: {
      jobId: 'job-002',
      windowFrom: Date.now() - 10800_000,
      windowTo: Date.now() - 7200_000,
      totalLogs: 35800,
      findings: mockFindings.filter(f => f.jobId === 'job-002'),
      actions: mockActions.filter(a => a.jobId === 'job-002'),
      metadata: { agentVersion: '4.2.0', analysisTimeMs: 1890, model: 'commander-v3' },
    },
    humanReport: `# SOC Report — Job job-002\n\n## Executive Summary\nTwo authentication-layer threats detected. Brute force and credential stuffing attacks against identity services.\n\n## Findings\n\n### INC-003 — Brute Force (HIGH)\n- **Source**: 103.4xx.xx.x (Sofia, Bulgaria)\n- **Target**: iam-auth / iam-auth (production)\n- **Confidence**: 95%\n- 127 failed login attempts across 5 target accounts.\n- **Action Taken**: Source IP blocked at auth-api endpoint.\n\n### INC-004 — Credential Stuffing (MEDIUM)\n- **Source**: 45.33.xx.xx\n- **Target**: customer-portal / auth-portal (production)\n- **Confidence**: 84%\n- 89 attempts, 3 successful logins — accounts flagged.\n- **Action Taken**: SOC alert raised for compromised accounts.\n\n## Recommendation\nForce password resets for the 3 compromised Customer accounts. Add source IP to threat intel watchlist.`,
    createdAt: '2026-04-09T05:00:02Z',
  },
  {
    id: 'r3',
    jobId: 'job-003',
    jsonReport: {
      jobId: 'job-003',
      windowFrom: Date.now() - 18000_000,
      windowTo: Date.now() - 10800_000,
      totalLogs: 28450,
      findings: mockFindings.filter(f => f.jobId === 'job-003'),
      actions: mockActions.filter(a => a.jobId === 'job-003'),
      metadata: { agentVersion: '4.2.0', analysisTimeMs: 3210, model: 'commander-v3' },
    },
    humanReport: `# SOC Report — Job job-003\n\n## Executive Summary\nMixed domain threats: infrastructure resource exhaustion and authentication session compromise.\n\n## Findings\n\n### INC-005 — Resource Exhaustion (CRITICAL)\n- **Source**: payment-processor-pod-xz91 (internal)\n- **Target**: k8s-cluster-07 (production)\n- **Confidence**: 98%\n- Pod OOMKilled 5 times in 30 minutes. Memory: 7.8Gi / 8Gi limit.\n- **Action Taken**: Escalated for manual review (requires human approval).\n\n### INC-006 — Session Hijacking (HIGH)\n- **Source**: j.doe@corp.co\n- **Target**: session-mgr / user-portal (production)\n- **Confidence**: 88%\n- Impossible travel: Delhi → London in 4 minutes (6,700 km).\n- **Action Taken**: All sessions revoked, MFA forced.\n\n## Recommendation\nInvestigate payment-processor memory leak. Conduct forensic analysis on j.doe account compromise.`,
    createdAt: '2026-04-09T02:00:04Z',
  },
  {
    id: 'r4',
    jobId: 'job-004',
    jsonReport: {
      jobId: 'job-004',
      windowFrom: Date.now() - 28800_000,
      windowTo: Date.now() - 18000_000,
      totalLogs: 30432,
      findings: mockFindings.filter(f => f.jobId === 'job-004'),
      actions: mockActions.filter(a => a.jobId === 'job-004'),
      metadata: { agentVersion: '4.2.0', analysisTimeMs: 1740, model: 'commander-v3' },
    },
    humanReport: `# SOC Report — Job job-004\n\n## Executive Summary\nInfrastructure config drift and perimeter reconnaissance detected.\n\n## Findings\n\n### INC-007 — Config Drift (MEDIUM)\n- **Source**: ingress-nginx-controller (internal)\n- **Target**: k8s-cluster-07 / ingress-controller (staging)\n- **Confidence**: 91%\n- TLS minimum version downgraded from 1.2 to 1.0 in ConfigMap.\n- **Action Taken**: SOC alert raised for policy violation.\n\n### INC-008 — Port Scan (LOW)\n- **Source**: 91.121.xx.xx (external)\n- **Target**: edge-firewall / perimeter-scan (production)\n- **Confidence**: 72%\n- Sequential scan of ports 1–1024. 12 open ports detected.\n- **Action Taken**: Source IP blocked at perimeter firewall.\n\n## Recommendation\nRevert TLS config in staging. Review exposed ports and close unnecessary services.`,
    createdAt: '2026-04-08T15:00:02Z',
  },
]

// Wire reports into jobs
mockJobs.forEach(job => {
  const report = mockReports.find(r => r.jobId === job.jobId)
  if (report) job.report = report
})

// ── Aggregated DomainStats (across all jobs) ──────────────────────────────

export const aggregatedDomainStats: Record<Domain, { logsProcessed: number; findingsCount: number; actionsCount: number }> = {
  http: { logsProcessed: 79900, findingsCount: 3, actionsCount: 3 },
  auth: { logsProcessed: 47400, findingsCount: 3, actionsCount: 3 },
  infra: { logsProcessed: 27932, findingsCount: 2, actionsCount: 2 },
}

// ── 24-hour chart data (findings + logs per hour) ─────────────────────────

export interface ChartDataPoint {
  time: string
  logsIngested: number
  findingsDetected: number
}

export const mockChartData: ChartDataPoint[] = [
  { time: '00:00', logsIngested: 4200, findingsDetected: 0 },
  { time: '01:00', logsIngested: 3100, findingsDetected: 0 },
  { time: '02:00', logsIngested: 2800, findingsDetected: 2 },
  { time: '03:00', logsIngested: 2400, findingsDetected: 0 },
  { time: '04:00', logsIngested: 3800, findingsDetected: 1 },
  { time: '05:00', logsIngested: 5200, findingsDetected: 1 },
  { time: '06:00', logsIngested: 6100, findingsDetected: 0 },
  { time: '07:00', logsIngested: 7800, findingsDetected: 1 },
  { time: '08:00', logsIngested: 9400, findingsDetected: 2 },
  { time: '09:00', logsIngested: 10200, findingsDetected: 2 },
  { time: '10:00', logsIngested: 11500, findingsDetected: 1 },
  { time: '11:00', logsIngested: 10800, findingsDetected: 0 },
  { time: '12:00', logsIngested: 12400, findingsDetected: 1 },
  { time: '13:00', logsIngested: 11800, findingsDetected: 1 },
  { time: '14:00', logsIngested: 10600, findingsDetected: 0 },
  { time: '15:00', logsIngested: 9800, findingsDetected: 2 },
  { time: '16:00', logsIngested: 11200, findingsDetected: 1 },
  { time: '17:00', logsIngested: 12600, findingsDetected: 1 },
  { time: '18:00', logsIngested: 10400, findingsDetected: 1 },
  { time: '19:00', logsIngested: 8200, findingsDetected: 0 },
  { time: '20:00', logsIngested: 6800, findingsDetected: 0 },
  { time: '21:00', logsIngested: 5600, findingsDetected: 0 },
  { time: '22:00', logsIngested: 4800, findingsDetected: 0 },
  { time: 'NOW', logsIngested: 7200, findingsDetected: 1 },
]

// ── Portal services (infrastructure monitoring, not in Prisma) ────────────

export interface PortalService {
  name: string
  status: 'normal' | 'risk' | 'attack'
  traffic: string
  latency: string
  activity: string
}

export const mockPortals: PortalService[] = [
  { name: 'Identity Services', status: 'normal', traffic: '1.2M req/s', latency: '42ms', activity: 'Stable' },
  { name: 'Payment Gateway', status: 'risk', traffic: '8.4M req/s', latency: '128ms', activity: 'High' },
  { name: 'Customer Portal', status: 'attack', traffic: '320k req/s', latency: '540ms', activity: 'Critical' },
  { name: 'B2B Invoicing', status: 'normal', traffic: '540k req/s', latency: '68ms', activity: 'Normal' },
  { name: 'Public API Gateway', status: 'normal', traffic: '2.1M req/s', latency: '55ms', activity: 'Stable' },
]

// ── Log event types for telemetry stream ──────────────────────────────────

export type LogSource = 'GRAFANA_LOKI' | 'WEBHOOK' | 'EDR_AGENT' | 'VPC_FLOW' | 'AUTH_SVC' | 'FIREWALL' | 'SIEM'

export interface LogEvent {
  id: string
  timestamp: string
  source: LogSource
  severity: Severity | 'info'
  message: string
}

const LOG_TEMPLATES = [
  { source: 'GRAFANA_LOKI' as LogSource, severity: 'info' as Severity | 'info', messages: [
    'req_id=8472 code=200 size=1247 path=/api/v2/users', 'lambda_invoke duration=12ms status=OK env=prod',
    'ingestion_rate=1.26GB/s stream=production lag=0ms', 'query_range: 15s window, 42 streams matched'
  ]},
  { source: 'WEBHOOK' as LogSource, severity: 'info' as Severity | 'info', messages: [
    'CloudTrail: iam:AssumeRole from 10.0.1.45', 's3:PutObject bucket=prod-logs key=2026/04/09/events.json',
    'event_bridge: rule=ScheduledJob target=soc-pipeline', 'sns:Publish topic=critical-alerts msg_id=aef2'
  ]},
  { source: 'EDR_AGENT' as LogSource, severity: 'info' as Severity | 'info', messages: [
    'PID:9902 heartbeat=ok sys_temp=44c cpu=12%', 'memory_usage=78% alert_level=normal disk=42%',
    'process_scan: 0 threats detected runtime=340ms', 'endpoint_health: NOMINAL uptime=14d'
  ]},
  { source: 'AUTH_SVC' as LogSource, severity: 'critical' as Severity | 'info', messages: [
    'auth_fail user="root" ip=185.122.x.x attempts=5', 'auth_fail user="admin" ip=185.122.x.x attempts=8',
    'LOCKOUT triggered user="root" ip=185.122.x.x threshold=5/min', 'mfa_challenge issued user="admin" method=totp'
  ]},
  { source: 'FIREWALL' as LogSource, severity: 'high' as Severity | 'info', messages: [
    'BLOCK src=103.45.21.9 dst=10.0.0.1 port=22 rule=BRUTE_FORCE', 'DDoS signature: UDP flood rate=450k/pps',
    'WAF_RULE triggered: SQL_INJECTION path=/api/query', 'rate_limit applied src=91.121.xx.xx rule=PORT_SCAN'
  ]},
  { source: 'SIEM' as LogSource, severity: 'critical' as Severity | 'info', messages: [
    'ALERT: brute_force trigger="multi_source_auth_fail" conf=0.95', 'CORRELATION: impossible_travel user=j.doe delta=4min',
    'PATTERN: port_scan src=91.121.xx.xx ports=1-1024 rate=high', 'ESCALATION: finding INC-001 auto-triaged → REMEDIATING'
  ]},
  { source: 'VPC_FLOW' as LogSource, severity: 'info' as Severity | 'info', messages: [
    'proto=tcp src=44.1.22.3 dst=10.0.0.4 port=443 bytes=48291', 'proto=udp src=185.220.101.2 dst=10.0.1.9 port=53',
    'tunnel_id=99 handshake=established latency=4ms', 'flow_log: 12,847 accepted 342 rejected last_5min'
  ]},
]

let logCounter = 0

export function generateLogEvent(): LogEvent {
  logCounter += 1
  const template = LOG_TEMPLATES[logCounter % LOG_TEMPLATES.length]
  const msg = template.messages[Math.floor(Math.random() * template.messages.length)]
  const now = new Date()
  const ts = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`
  return {
    id: `log-${Date.now()}-${logCounter}`,
    timestamp: ts,
    source: template.source,
    severity: template.severity,
    message: msg,
  }
}
