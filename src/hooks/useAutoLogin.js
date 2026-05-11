import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

// ── Cookie helpers ────────────────────────────────────────────────────────────

export function setSessionCookie(token, user) {
    const expires = new Date()
    expires.setDate(expires.getDate() + 7) // 7-day session
    document.cookie = `mrMoney_token=${encodeURIComponent(token)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
    document.cookie = `mrMoney_user=${encodeURIComponent(JSON.stringify(user))}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
}

export function clearSessionCookie() {
    // Expire both cookies immediately
    document.cookie = 'mrMoney_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict'
    document.cookie = 'mrMoney_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict'
}

export function getSessionCookie() {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
        const [k, v] = c.trim().split('=')
        acc[k] = v
        return acc
    }, {})

    const token = cookies['mrMoney_token'] ? decodeURIComponent(cookies['mrMoney_token']) : null
    const userRaw = cookies['mrMoney_user'] ? decodeURIComponent(cookies['mrMoney_user']) : null

    let user = null
    try { user = userRaw ? JSON.parse(userRaw) : null } catch { user = null }

    return { token, user }
}

export function hasActiveSession() {
    const { token, user } = getSessionCookie()
    return !!(token && user)
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useAutoLogin
 * Checks for an existing session cookie on the login page.
 * If found, validates the token against the API and redirects to /dashboard.
 * Returns { checking } — true while the check is in progress.
 */
export function useAutoLogin() {
    const navigate = useNavigate()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const tryAutoLogin = async () => {
            const { token, user } = getSessionCookie()

            if (!token || !user) {
                setChecking(false)
                return
            }

            try {
                // Validate token is still accepted by the API
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))

                await api.get('/Users/me')   // lightweight auth check

                // Token is valid — go straight to dashboard
                navigate('/dashboard', { replace: true })
            } catch {
                // Token expired or invalid — clear everything and show login
                clearSessionCookie()
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setChecking(false)
            }
        }

        tryAutoLogin()
    }, [navigate])

    return { checking }
}
