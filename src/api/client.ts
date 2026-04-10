const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export interface DashboardResponse {
  globalStat: import('../types/schema').GlobalStat
  domainBreakdown: import('../types/schema').DomainStat[]
  recentJobs: import('../types/schema').Job[]
}

export interface IncidentsResponse {
  total: number
  page: number
  limit: number
  actions: import('../types/schema').Action[]
}

export interface ReportsResponse {
  reports: import('../types/schema').Report[]
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getHealth(): Promise<{ ok: boolean }> {
    return this.request('/health')
  }

  async triggerJob(windowMinutes: number = 10): Promise<{ message: string }> {
    return this.request('/api/jobs/trigger', {
      method: 'POST',
      body: JSON.stringify({ windowMinutes }),
    })
  }

  async getJob(jobId: string): Promise<import('../types/schema').Job> {
    return this.request(`/api/jobs/${jobId}`)
  }

  async getDashboard(): Promise<DashboardResponse> {
    return this.request('/api/dashboard')
  }

  async getIncidents(page: number = 1, limit: number = 20): Promise<IncidentsResponse> {
    return this.request(`/api/incidents?page=${page}&limit=${limit}`)
  }

  async getReports(): Promise<{ reports: import('../types/schema').Report[] }> {
    return this.request('/api/reports')
  }

  async getReport(jobId: string): Promise<import('../types/schema').Report> {
    return this.request(`/api/reports/${jobId}`)
  }

  async pushLogs(stream: unknown[]): Promise<{ status: string; ingested_streams: number }> {
    return this.request('/api/pushLogs', {
      method: 'POST',
      body: JSON.stringify({ stream }),
    })
  }
}

export const apiClient = new ApiClient()