import { Navigate } from "react-router-dom"
import { getSessionCookie } from "./hooks/useAutoLogin"

function ProtectedRoute({ children }) {
    // Accept either a valid localStorage token OR a valid session cookie
    const tokenFromStorage = localStorage.getItem("token")
    const { token: tokenFromCookie, user } = getSessionCookie()

    // If cookie has token but localStorage doesn't (e.g. after page refresh),
    // restore localStorage from cookie so the app works seamlessly
    if (!tokenFromStorage && tokenFromCookie && user) {
        localStorage.setItem("token", tokenFromCookie)
        localStorage.setItem("user", JSON.stringify(user))
    }

    const isAuthenticated = !!(tokenFromStorage || tokenFromCookie)

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
