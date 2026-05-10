import { useNavigate, useLocation, Outlet, NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import './Dashboard.css'
import appLogo from '../assets/app-logo.png'
import { useData } from '../context/DataContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie, faReceipt, faWallet, faChartSimple, faGear, faBars, faSearch, faSun, faMoon, faBell, faPlus, faExchangeAlt, faDollarSign, faArrowTrendUp, faArrowTrendDown, faChevronDown, faUser, faSignOutAlt, faTimes, faBuilding, faMugHot, faShoppingCart, faTicket } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Button, Select, Form, Modal, Segmented } from 'antd'

function Dashboard() {
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    
    // Modal states
    const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false)
    const [form] = Form.useForm()

    const { transactions, accounts, totalIncome, totalExpense, netBalance, addTransaction, formatCurrency, formatDate, themeMode, toggleTheme } = useData()

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
        { icon: <FontAwesomeIcon icon={faChartPie} />, label: "Dashboard", path: "/dashboard" },
        { icon: <FontAwesomeIcon icon={faWallet} />, label: "Accounts", path: "/accounts" },
        { icon: <FontAwesomeIcon icon={faReceipt} />, label: "Transactions", path: "/transactions" },
        { icon: <FontAwesomeIcon icon={faExchangeAlt} />, label: "Transfers", path: "/transfers" },
        { icon: <FontAwesomeIcon icon={faChartSimple} />, label: "Reports", path: "/reports" },
    ]

    const currentNav = navItems.find(n => n.path === location.pathname);
    const pageTitle = currentNav ? currentNav.label : (location.pathname.includes('search') ? 'Search Results' : 'Settings');

    const getIconForCategory = (category) => {
        switch (category?.toLowerCase()) {
            case 'food & dining': return <FontAwesomeIcon icon={faMugHot} />;
            case 'shopping': return <FontAwesomeIcon icon={faShoppingCart} />;
            case 'entertainment': return <FontAwesomeIcon icon={faTicket} />;
            case 'income': return <FontAwesomeIcon icon={faDollarSign} />;
            default: return <FontAwesomeIcon icon={faReceipt} />;
        }
    }

    const handleAddTx = (values) => {
        addTransaction(values)
        setIsAddTxModalOpen(false)
        form.resetFields()
    }

    return (
        <div className={`dashboard-page ${themeMode} layout-sidebar`}>
            {/* Desktop Sidebar */}
            <aside className={`desktop-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header" style={{ marginBottom: '32px' }}>
                    <a href="/dashboard" className="navbar-brand">
                        <img src={appLogo} alt="Mr.Money" />
                        <span className="brand-text">Mr.Money</span>
                    </a>
                </div>

                <ul className="sidebar-nav">
                    {navItems.map((item, i) => (
                        <li key={i}>
                            <NavLink 
                                to={item.path} 
                                end={item.path === '/dashboard'}
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {!isSidebarCollapsed && <span className="sidebar-label">{item.label}</span>}
                                {isSidebarCollapsed && <span className="nav-tooltip">{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="sidebar-footer">
                    <div className="user-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <img src={user.picture} alt={user.name} className="user-avatar" />
                        {!isSidebarCollapsed && (
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-email">{user.email}</span>
                            </div>
                        )}
                        {!isSidebarCollapsed && <span className="user-chevron"><FontAwesomeIcon icon={faChevronDown} /></span>}

                        <div className={`user-dropdown ${dropdownOpen ? 'open' : ''} dropup`}>
                            <div className="dropdown-header">
                                <div className="dh-name">{user.name}</div>
                                <div className="dh-email">{user.email}</div>
                            </div>
                            <button className="dropdown-item"><span className="di-icon"><FontAwesomeIcon icon={faUser} /></span> My Profile</button>
                            <button className="dropdown-item"><span className="di-icon"><FontAwesomeIcon icon={faGear} /></span> Settings</button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item danger" onClick={logout}><span className="di-icon"><FontAwesomeIcon icon={faSignOutAlt} /></span> Logout</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="main-wrapper">
                <header className={`dashboard-header ${scrolled ? 'scrolled' : ''}`}>
                    <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="sidebar-toggle-btn mobile-only" onClick={() => setMobileMenuOpen(true)}>
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        <button className="sidebar-toggle-btn desktop-only" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: 'var(--text-secondary)' }}>
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500', color: 'var(--text-primary)' }}>{pageTitle}</h2>
                    </div>
                    
                    <div className="navbar-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div className="header-search">
                            <span className="search-icon"><FontAwesomeIcon icon={faSearch} /></span>
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && searchQuery) {
                                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                    }
                                }}
                                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '14px' }}
                            />
                        </div>
                        <button className="notification-btn" onClick={() => navigate('/settings')} style={{ background: 'transparent', border: '1px solid var(--nav-border)', borderRadius: '8px' }}>
                            <FontAwesomeIcon icon={faGear} />
                        </button>
                    </div>
                </header>


            {/* Mobile Navigation */}
            <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
            <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-header">
                    <a href="/dashboard" className="navbar-brand">
                        <img src={appLogo} alt="Mr.Money" />
                        <span className="brand-text">Mr.Money</span>
                    </a>
                    <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
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
                            <NavLink 
                                to={item.path} 
                                end={item.path === '/dashboard'}
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="mobile-nav-footer">
                    <button className="mobile-theme-toggle" onClick={toggleTheme} style={{ width: '100%', padding: '16px', background: 'var(--hover-bg)', border: 'none', borderRadius: '12px', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease' }}>
                        {themeMode === 'dark' ? <><FontAwesomeIcon icon={faSun} /> Light Mode</> : <><FontAwesomeIcon icon={faMoon} /> Dark Mode</>}
                    </button>
                    <button className="mobile-logout-btn" onClick={logout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                </div>
            </div>

            {/* Dashboard Content */}
            <main className="dashboard-content">
                <AnimatePresence mode="wait">
                    <Outlet />
                </AnimatePresence>
            </main>

            {/* Add Transaction Modal */}
            <Modal
                title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}><FontAwesomeIcon icon={faReceipt} style={{ color: 'white' }} /><span>Add Transaction</span></div>}
                open={isAddTxModalOpen}
                onCancel={() => { setIsAddTxModalOpen(false); form.resetFields(); }}
                footer={null}
                width={500}
                centered
                className="premium-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddTx}
                    initialValues={{ type: 'expense', category: 'General' }}
                    style={{ marginTop: '24px', padding: '0 4px' }}
                >
                    <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                        <Form.Item name="type" style={{ marginBottom: 0 }}>
                            <Segmented
                                block
                                size="large"
                                options={[
                                    { label: 'Expense', value: 'expense', icon: <FontAwesomeIcon icon={faArrowTrendDown} style={{ color: '#EF4444' }} /> },
                                    { label: 'Income', value: 'income', icon: <FontAwesomeIcon icon={faArrowTrendUp} style={{ color: '#10B981' }} /> },
                                    { label: 'Transfer', value: 'transfer', icon: <FontAwesomeIcon icon={faExchangeAlt} style={{ color: '#3B82F6' }} /> }
                                ]}
                                style={{ borderRadius: '12px', padding: '4px', background: 'var(--hover-bg)' }}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Enter Amount</div>
                        <Form.Item 
                            name="amount" 
                            rules={[{ required: true, message: 'Please enter an amount' }]}
                            style={{ marginBottom: 0 }}
                        >
                            <Input 
                                type="number" 
                                prefix={<span style={{ fontSize: '24px', color: 'var(--text-muted)', marginRight: '8px' }}>₹</span>}
                                placeholder="0.00" 
                                variant="borderless"
                                style={{ 
                                    textAlign: 'center', 
                                    fontSize: '42px', 
                                    height: '60px', 
                                    fontWeight: '700',
                                    color: 'var(--text-primary)'
                                }} 
                            />
                        </Form.Item>
                        <div style={{ width: '100px', height: '2px', background: 'var(--accent-green)', margin: '0 auto', borderRadius: '2px', opacity: 0.3 }}></div>
                    </div>

                    <Form.Item label="Description" name="name" rules={[{ required: true, message: 'Please enter a description' }]}>
                        <Input placeholder="e.g. Starbucks" size="large" style={{ borderRadius: '10px' }} />
                    </Form.Item>
                    
                    <Form.Item label="Category" name="category">
                        <Select size="large" style={{ width: '100%' }}>
                            <Select.Option value="Food & Dining">Food & Dining</Select.Option>
                            <Select.Option value="Shopping">Shopping</Select.Option>
                            <Select.Option value="Entertainment">Entertainment</Select.Option>
                            <Select.Option value="General">General</Select.Option>
                            <Select.Option value="Income">Income</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: '12px' }}>
                        <Button type="primary" htmlType="submit" block size="large" style={{ height: '50px', borderRadius: '12px', fontWeight: '600', fontSize: '16px' }}>
                            Save Transaction
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Global FAB */}
            <button 
                onClick={() => setIsAddTxModalOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '32px',
                    right: '32px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--accent-green)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: 'var(--shadow-lg)',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 100,
                    transition: 'all 0.3s ease'
                }}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
            </div>
        </div>
    )
}

export default Dashboard
