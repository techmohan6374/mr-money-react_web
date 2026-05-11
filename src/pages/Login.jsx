import { GoogleLogin } from '@react-oauth/google'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faChartPie, faFilePdf, faStar, faCoins, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons'
import appLogo from '../assets/app-logo.png'
import api from '../api'
import { useAutoLogin, setSessionCookie } from '../hooks/useAutoLogin'
import { useData } from '../context/DataContext'
import './Login.css'

function Login() {
    const navigate = useNavigate()
    const { loadAllData } = useData()
    const [isLoading, setIsLoading] = useState(false)

    // ── Auto-login: if a valid session cookie exists, skip the login page ──────
    const { checking } = useAutoLogin()

    // Force white theme on login page
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
    }, [])

    // ── While checking session cookie, show a minimal "Resuming…" screen ──────
    if (checking) {
        return (
            <div className="login-loader-overlay" style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 9999 }}>
                <div className="loader-card">
                    <div className="loader-logo-ring">
                        <div className="loader-ring-outer"></div>
                        <div className="loader-ring-inner"></div>
                        <div className="loader-logo-inner">
                            <img src={appLogo} alt="Mr.Money" className="loader-logo-img" />
                        </div>
                    </div>
                    <div className="loader-text-block">
                        <h3 className="loader-title">Resuming session</h3>
                        <p className="loader-subtitle">Welcome back to Mr.Money...</p>
                    </div>
                    <div className="loader-progress-track">
                        <div className="loader-progress-bar"></div>
                    </div>
                    <div className="loader-steps">
                        <span className="loader-step active">Checking session</span>
                        <span className="loader-step-dot">•</span>
                        <span className="loader-step">Verifying token</span>
                        <span className="loader-step-dot">•</span>
                        <span className="loader-step">Loading dashboard</span>
                    </div>
                </div>
            </div>
        )
    }

    // ── Normal login page ─────────────────────────────────────────────────────
    return (
        <div className="login-page">
            {/* Loading Overlay (shown after Google button click) */}
            {isLoading && (
                <div className="login-loader-overlay">
                    <div className="loader-bg-glow"></div>
                    <div className="loader-card">
                        <div className="loader-logo-ring">
                            <div className="loader-ring-outer"></div>
                            <div className="loader-ring-inner"></div>
                            <div className="loader-logo-inner">
                                <img src={appLogo} alt="Mr.Money" className="loader-logo-img" />
                            </div>
                        </div>
                        <div className="loader-text-block">
                            <h3 className="loader-title">Signing you in</h3>
                            <p className="loader-subtitle">Authenticating with Mr.Money...</p>
                        </div>
                        <div className="loader-progress-track">
                            <div className="loader-progress-bar"></div>
                        </div>
                        <div className="loader-steps">
                            <span className="loader-step active">Verifying identity</span>
                            <span className="loader-step-dot">•</span>
                            <span className="loader-step">Loading profile</span>
                            <span className="loader-step-dot">•</span>
                            <span className="loader-step">Preparing dashboard</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="login-split-container">
                {/* Left Panel */}
                <div className="login-left-panel">
                    <div className="hero-brand-top">
                        <span className="hero-brand-icon"><FontAwesomeIcon icon={faCoins} /></span> Mr.Money
                    </div>

                    <div className="hero-illustration">
                        <div className="wallet-outline">
                            <div className="wallet-chip"></div>
                            <div className="floating-circle fc-1">₹</div>
                            <div className="floating-circle fc-2">$</div>
                            <div className="floating-circle fc-3">€</div>
                        </div>
                    </div>

                    <div className="hero-text-content">
                        <h1 className="hero-title">Take Control of<br />Your Finances</h1>
                        <p className="hero-description">
                            Track income, manage expenses, analyse spending and export reports — all in one place.
                        </p>
                    </div>

                    <div className="hero-badges">
                        <div className="hero-badge"><FontAwesomeIcon icon={faWallet} /> Multi-Account</div>
                        <div className="hero-badge"><FontAwesomeIcon icon={faChartPie} /> Smart Reports</div>
                        <div className="hero-badge"><FontAwesomeIcon icon={faArrowTrendUp} /> Quick Insights</div>
                        <div className="hero-badge"><FontAwesomeIcon icon={faFilePdf} /> PDF Export</div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="login-right-panel">
                    <div className="login-card-wrapper">
                        <div className="login-card-content">
                            <div className="auth-logo">
                                <img src={appLogo} alt="Mr.Money" />
                                <span>Mr.Money</span>
                            </div>

                            <h2>Welcome back</h2>
                            <p className="auth-subtitle">Sign in to continue to <strong>Mr.Money</strong></p>

                            <div className="custom-google-wrapper">
                                <button className="custom-google-btn-ui">
                                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>

                                <div className="google-login-invisible">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            setIsLoading(true)
                                            try {
                                                const result = await api.post(
                                                    '/Auth/google-login',
                                                    { token: credentialResponse.credential }
                                                )
                                                const { jwtToken, user } = result.data

                                                // Save to localStorage
                                                localStorage.setItem('token', jwtToken)
                                                localStorage.setItem('user', JSON.stringify(user))

                                                // Save to cookie for auto-login next visit
                                                setSessionCookie(jwtToken, user)

                                                // Pre-load data so dashboard is ready
                                                loadAllData()

                                                navigate('/dashboard')
                                            } catch (error) {
                                                console.error('Login failed:', error)
                                                setIsLoading(false)
                                            }
                                        }}
                                        onError={() => {
                                            console.log('Google Login Failed')
                                            setIsLoading(false)
                                        }}
                                        size="large"
                                        width="340"
                                        text="continue_with"
                                    />
                                </div>
                            </div>

                            <p className="auth-terms">
                                By continuing, you agree to our <Link to="/terms">Terms</Link> & <Link to="/terms">Privacy Policy</Link>.
                            </p>

                            <div className="auth-feature-box">
                                <div className="af-icon"><FontAwesomeIcon icon={faStar} /></div>
                                <div className="af-text">
                                    <h4>Everything you need, all in one place</h4>
                                    <p>Multi-account tracking • Smart reports • Quick insights • Transfers • PDF & Excel export • Dark & light theme</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
