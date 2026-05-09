import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import './Dashboard.css'

function Dashboard() {
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const userData = localStorage.getItem("user")
    if (!userData) {
        navigate("/")
        return null
    }
    const user = JSON.parse(userData)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest('.user-profile')) setDropdownOpen(false)
        }
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    const logout = () => {
        localStorage.clear()
        navigate("/")
    }

    const getGreeting = () => {
        const h = new Date().getHours()
        if (h < 12) return "Good Morning"
        if (h < 17) return "Good Afternoon"
        return "Good Evening"
    }

    const navItems = [
        { icon: "📊", label: "Dashboard", active: true },
        { icon: "💰", label: "Transactions" },
        { icon: "📁", label: "Accounts" },
        { icon: "📈", label: "Reports" },
        { icon: "⚙️", label: "Settings" },
    ]

    return (
        <div className="dashboard-layout">
            {/* Navbar */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-inner">
                    <a href="/dashboard" className="navbar-brand" id="navbar-brand">
                        <img src="/images/app-logo.png" alt="Mr.Money" />
                        <span className="brand-text">Mr.Money</span>
                    </a>

                    <ul className="navbar-nav" id="navbar-nav">
                        {navItems.map((item, i) => (
                            <li className="nav-item" key={i}>
                                <button className={`nav-link ${item.active ? 'active' : ''}`} id={`nav-${item.label.toLowerCase()}`}>
                                    <span className="nav-icon">{item.icon}</span>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar-actions">
                        <button className="notification-btn" id="notification-btn">
                            🔔
                            <span className="notif-badge"></span>
                        </button>

                        <div className="user-profile" onClick={() => setDropdownOpen(!dropdownOpen)} id="user-profile-btn">
                            <img src={user.picture} alt={user.name} className="user-avatar" />
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-email">{user.email}</span>
                            </div>
                            <span className="user-chevron">▾</span>

                            <div className={`user-dropdown ${dropdownOpen ? 'open' : ''}`} id="user-dropdown">
                                <div className="dropdown-header">
                                    <div className="dh-name">{user.name}</div>
                                    <div className="dh-email">{user.email}</div>
                                </div>
                                <button className="dropdown-item"><span className="di-icon">👤</span> My Profile</button>
                                <button className="dropdown-item"><span className="di-icon">⚙️</span> Settings</button>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item danger" onClick={logout} id="logout-btn"><span className="di-icon">🚪</span> Logout</button>
                            </div>
                        </div>

                        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} id="mobile-menu-btn">
                            ☰
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
            <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`} id="mobile-nav">
                <div className="mobile-nav-header">
                    <a href="/dashboard" className="navbar-brand">
                        <img src="/images/app-logo.png" alt="Mr.Money" />
                        <span className="brand-text">Mr.Money</span>
                    </a>
                    <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
                </div>

                <div className="mobile-nav-user">
                    <img src={user.picture} alt={user.name} />
                    <div>
                        <div className="mnu-name">{user.name}</div>
                        <div className="mnu-email">{user.email}</div>
                    </div>
                </div>

                <ul className="mobile-nav-links">
                    {navItems.map((item, i) => (
                        <li key={i}>
                            <button className={`nav-link ${item.active ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="mobile-nav-footer">
                    <button className="mobile-logout-btn" onClick={logout}>
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Dashboard Content */}
            <main className="dashboard-content">
                <div className="dashboard-welcome">
                    <p className="greeting">{getGreeting()}</p>
                    <h1>Welcome back, <span>{user.name?.split(' ')[0]}</span> 👋</h1>
                </div>

                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="card-header">
                            <div className="card-icon income">💰</div>
                            <div className="card-trend up">↑ 12%</div>
                        </div>
                        <div className="card-label">Total Income</div>
                        <div className="card-value">₹0.00</div>
                    </div>
                    <div className="summary-card">
                        <div className="card-header">
                            <div className="card-icon expense">💸</div>
                            <div className="card-trend down">↑ 8%</div>
                        </div>
                        <div className="card-label">Total Expenses</div>
                        <div className="card-value">₹0.00</div>
                    </div>
                    <div className="summary-card">
                        <div className="card-header">
                            <div className="card-icon balance">🏦</div>
                            <div className="card-trend up">↑ 4%</div>
                        </div>
                        <div className="card-label">Net Balance</div>
                        <div className="card-value">₹0.00</div>
                    </div>
                </div>

                <div className="quick-actions">
                    <button className="quick-action-btn primary"><span className="qa-icon">➕</span> Add Transaction</button>
                    <button className="quick-action-btn"><span className="qa-icon">📄</span> Export Report</button>
                    <button className="quick-action-btn"><span className="qa-icon">🔄</span> Transfer</button>
                    <button className="quick-action-btn"><span className="qa-icon">📊</span> View Analytics</button>
                </div>
            </main>
        </div>
    )
}

export default Dashboard