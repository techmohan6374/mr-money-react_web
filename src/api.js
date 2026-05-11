import axios from 'axios'

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE PLACE to change the API base URL.
// Development  → https://localhost:7202/api
// Production   → update VITE_API_URL in your .env or hosting environment
// ─────────────────────────────────────────────────────────────────────────────
export const API_BASE_URL =
    // import.meta.env.VITE_API_URL || 'https://localhost:7202/api'
    import.meta.env.VITE_API_URL || 'https://mrmoney-api.onrender.com'

// Axios instance — JWT token is attached automatically to every request
const api = axios.create({
    baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Global response interceptor — redirect to login on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export default api
