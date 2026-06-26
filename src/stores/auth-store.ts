import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = import.meta.env.VITE_COOKIE_TOKEN_NAME || 'zenith_access_token'
const USER_COOKIE = 'zenith_user'

export interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
  organizacion_id?: string
}

/** Devuelve true si el token JWT expiró según el campo `exp` (Unix timestamp en segundos). */
export function isTokenExpired(user: AuthUser | null): boolean {
  if (!user) return true
  return Math.floor(Date.now() / 1000) > user.exp
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
  sede: {
    activeSedeId: string | null
    setActiveSedeId: (sedeId: string | null) => void
  }
}

const DEV_MOCK_USER: AuthUser = {
  accountNo: 'dev-user',
  email: 'dev@zenith.local',
  role: ['director_organizacion'],
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // 1 año
  organizacion_id: 'org-dev',
}

function restoreUser(): AuthUser | null {
  try {
    const raw = getCookie(USER_COOKIE)
    if (!raw) {
      // En modo desarrollo, usar usuario mock si no hay sesión real
      if (import.meta.env.DEV) return DEV_MOCK_USER
      return null
    }
    const user: AuthUser = JSON.parse(decodeURIComponent(raw))
    // Si el token expiró, descartar
    if (isTokenExpired(user)) {
      removeCookie(USER_COOKIE)
      if (import.meta.env.DEV) return DEV_MOCK_USER
      return null
    }
    return user
  } catch {
    removeCookie(USER_COOKIE)
    if (import.meta.env.DEV) return DEV_MOCK_USER
    return null
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  const initUser = restoreUser()
  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(USER_COOKIE, encodeURIComponent(JSON.stringify(user)))
          } else {
            removeCookie(USER_COOKIE)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(USER_COOKIE)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
    sede: {
      activeSedeId: null,
      setActiveSedeId: (activeSedeId) =>
        set((state) => ({ ...state, sede: { ...state.sede, activeSedeId } })),
    },
  }
})
