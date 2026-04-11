import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      login: (email: string, _password: string) => {
        // Extract name from email to show instead of hardcoded 'Acme Corporation'
        const nameStr = email.split('@')[0] || 'System Admin'
        const formattedName = nameStr.charAt(0).toUpperCase() + nameStr.slice(1)

        set({ isAuthenticated: true, user: { ...MOCK_USER, name: formattedName, email } })
        return true
      },
      logout: () => {
        set({ isAuthenticated: false, user: null })
      },
    }),
    {
      name: 'defendx-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
)
