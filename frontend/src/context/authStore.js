import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({ user: data.user, token: data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return { success: true }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: err.response?.data?.message || 'Login failed' }
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/register', { name, email, password })
          set({ user: data.user, token: data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return { success: true }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, message: err.response?.data?.message || 'Registration failed' }
        }
      },

      logout: () => {
        set({ user: null, token: null })
        delete api.defaults.headers.common['Authorization']
      },

      updateUser: (updates) => set(state => ({ user: { ...state.user, ...updates } })),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'cardioai-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
        }
      },
    }
  )
)
