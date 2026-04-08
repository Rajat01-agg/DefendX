import { create } from 'zustand'

interface User {
  name: string
  email: string
  role: string
  clearance: string
  avatar?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const MOCK_USER: User = {
  name: 'Acme Corporation',
  email: 'rajat.aggarwal@acmecorp.com',
  role: 'CISO',
  clearance: 'ACME CORP ADMINISTRATOR',
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (_email: string, _password: string) => {
    // Mock: any credentials work
    set({ isAuthenticated: true, user: MOCK_USER })
    return true
  },
  logout: () => {
    set({ isAuthenticated: false, user: null })
  },
}))
