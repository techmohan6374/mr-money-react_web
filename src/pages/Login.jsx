import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import appLogo from '../assets/app-logo.png'
import './Login.css'

function Login() {
    const navigate = useNavigate()

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Get user info from Google
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                )

                // Send to your backend
                const result = await axios.post(
                    'https://mrmoney-api.onrender.com/api/Auth/google-login',
                    { token: tokenResponse.access_token }
                )
                localStorage.setItem("token", result.data.jwtToken)
                localStorage.setItem("user", JSON.stringify(result.data.user))
                navigate("/dashboard")
            } catch (error) {
                console.log(error)
            }
        },
        onError: () => console.log("Login Failed"),
    })

    return (
        <div className="login-page">
            {/* Animated Background Orbs */}
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="bg-orb orb-3"></div>
            
            <div className="login-container">
                {/* Left Hero Panel */}
                <div className="login-hero">
                    <div className="hero-content">
                        <div className="hero-brand">
                            <img src={appLogo} alt="Mr.Money" />
                        </div>
                        <h1 className="hero-title">
                            Master Your<br />
                            <span className="text-gradient">Financial Future</span>
                        </h1>
                        <p className="hero-description">
                            Track income, manage expenses, analyze spending, and export reports with our premium, all-in-one platform.
                        </p>
                        
                        <div className="feature-tags">
                            <div className="feature-tag">
                                <span className="tag-icon">💼</span> Multi-Account
                            </div>
                            <div className="feature-tag">
                                <span className="tag-icon">📊</span> Smart Reports
                            </div>
                            <div className="feature-tag">
                                <span className="tag-icon">⚡</span> Quick Insights
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Login Panel */}
                <div className="login-form-panel">
                    <div className="glass-card">
                        <div className="login-logo">
                            <img src={appLogo} alt="Mr.Money Logo" />
                            <span className="brand-name">Mr.Money</span>
                        </div>

                        <h2>Welcome Back</h2>
                        <p className="login-subtitle">
                            Sign in to access your dashboard
                        </p>

                        <button className="custom-google-btn" onClick={() => googleLogin()} id="google-login-btn">
                            <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <p className="login-terms">
                            By continuing, you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login