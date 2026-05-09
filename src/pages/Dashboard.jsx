import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import './Dashboard.css'
import appLogo from '../assets/app-logo.png'
import Transactions from './Transactions'
import Accounts from './Accounts'
import Reports from './Reports'
import Settings from './Settings'
import Search from './Search'
import Transfer from './Transfer'
import { useData } from '../context/DataContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie, faReceipt, faWallet, faChartSimple, faGear, faBars, faSearch, faSun, faMoon, faBell, faPlus, faExchangeAlt, faDollarSign, faArrowTrendUp, faArrowTrendDown, faChevronDown, faUser, faSignOutAlt, faTimes, faBuilding, faMugHot, faShoppingCart, faTicket } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

function Dashboard() {
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
    const [activePage, setActivePage] = useState('Dashboard')
    const [searchQuery, setSearchQuery] = useState('')
    
    // Modal states
    const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false)

    // Form states
    const [txForm, setTxForm] = useState({ name: '', amount: '', type: 'expense', category: 'General' })

    const { transactions, accounts, totalIncome, totalExpense, netBalance, addTransaction, transferFunds, formatCurrency, formatDate, themeMode, toggleTheme } = useData()

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
        { icon: <FontAwesomeIcon icon={faChartPie} />, label: "Dashboard", id: "Dashboard" },
        { icon: <FontAwesomeIcon icon={faWallet} />, label: "Accounts", id: "Accounts" },
        { icon: <FontAwesomeIcon icon={faReceipt} />, label: "Transactions", id: "Transactions" },
        { icon: <FontAwesomeIcon icon={faExchangeAlt} />, label: "Transfers", id: "Transfers" },
        { icon: <FontAwesomeIcon icon={faChartSimple} />, label: "Reports", id: "Reports" },
    ]

    const getIconForCategory = (category) => {
        switch (category?.toLowerCase()) {
            case 'food & dining': return <FontAwesomeIcon icon={faMugHot} />;
            case 'shopping': return <FontAwesomeIcon icon={faShoppingCart} />;
            case 'entertainment': return <FontAwesomeIcon icon={faTicket} />;
            case 'income': return <FontAwesomeIcon icon={faDollarSign} />;
            default: return <FontAwesomeIcon icon={faReceipt} />;
        }
    }

    const handleAddTx = (e) => {
        e.preventDefault();
        addTransaction(txForm);
        setIsAddTxModalOpen(false);
        setTxForm({ name: '', amount: '', type: 'expense', category: 'General' });
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
                        <li className="nav-item" key={i}>
                            <button 
                                className={`nav-link ${activePage === item.id ? 'active' : ''}`} 
                                onClick={() => setActivePage(item.id)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {!isSidebarCollapsed && <span className="nav-label">{item.label}</span>}
                                {isSidebarCollapsed && <span className="nav-tooltip">{item.label}</span>}
                            </button>
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
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500', color: 'var(--text-primary)' }}>{navItems.find(n => n.id === activePage)?.label || activePage}</h2>
                    </div>
                    
                    <div className="navbar-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div className="header-search">
                            <span className="search-icon"><FontAwesomeIcon icon={faSearch} /></span>
                            <Input 
                                type="text"
                                placeholder="Search transactions..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && searchQuery) setActivePage('Search')
                                }}
                                className="border-none shadow-none focus-visible:ring-0 bg-transparent flex-1 placeholder:text-muted-foreground"
                            />
                        </div>
                        <button className="notification-btn" onClick={() => setActivePage('Settings')} style={{ background: 'transparent', border: '1px solid var(--nav-border)', borderRadius: '8px' }}>
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
                            <button 
                                className={`nav-link ${activePage === item.id ? 'active' : ''}`} 
                                onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </button>
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
                {activePage === 'Dashboard' && (
                    <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="dashboard-welcome" style={{ padding: '32px', background: 'var(--card-bg)', marginBottom: '24px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
                            <h1 style={{ fontSize: '28px', fontWeight: '600', margin: '0 0 8px 0' }}>{getGreeting()}, <span style={{ color: 'var(--accent-green)' }}>{user.name?.split(' ')[0]}</span> 👋</h1>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Here's your financial overview for this month.</p>
                            
                            <div style={{ marginTop: '32px', borderTop: '1px solid var(--nav-border)', paddingTop: '32px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Balance</div>
                                <div style={{ fontSize: '40px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {formatCurrency(netBalance)} 
                                    <span style={{ fontSize: '20px', color: 'var(--text-muted)', cursor: 'pointer' }}>👁️</span>
                                </div>

                                <div style={{ display: 'flex', gap: '32px', marginTop: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--icon-bg-income)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FontAwesomeIcon icon={faArrowTrendDown} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monthly Income</div>
                                            <div style={{ fontWeight: '500' }}>{formatCurrency(totalIncome)}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--icon-bg-expense)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FontAwesomeIcon icon={faArrowTrendUp} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monthly Expense</div>
                                            <div style={{ fontWeight: '500' }}>{formatCurrency(totalExpense)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="dashboard-stats">
                            <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ position: 'relative', overflow: 'hidden' }}>
                                <div className="card-header">
                                    <div className="card-icon-wrapper income">
                                        <span className="card-icon"><FontAwesomeIcon icon={faBuilding} /></span>
                                    </div>
                                    <div className="card-trend up"><FontAwesomeIcon icon={faArrowTrendUp} /> 12.5%</div>
                                </div>
                                <div className="card-label">Total Income</div>
                                <div className="card-value text-income">{formatCurrency(totalIncome)}</div>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: '50%', height: '4px', background: 'var(--accent-green)' }}></div>
                            </motion.div>
                            
                            <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ position: 'relative', overflow: 'hidden' }}>
                                <div className="card-header">
                                    <div className="card-icon-wrapper expense">
                                        <span className="card-icon"><FontAwesomeIcon icon={faReceipt} /></span>
                                    </div>
                                    <div className="card-trend down"><FontAwesomeIcon icon={faArrowTrendDown} /> 8.2%</div>
                                </div>
                                <div className="card-label">Total Expense</div>
                                <div className="card-value text-expense">{formatCurrency(totalExpense)}</div>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: '50%', height: '4px', background: 'var(--accent-red)' }}></div>
                            </motion.div>
                            
                            <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ position: 'relative', overflow: 'hidden' }}>
                                <div className="card-header">
                                    <div className="card-icon-wrapper balance">
                                        <span className="card-icon"><FontAwesomeIcon icon={faExchangeAlt} /></span>
                                    </div>
                                    <div className="card-trend up"><FontAwesomeIcon icon={faArrowTrendUp} /> 4.1%</div>
                                </div>
                                <div className="card-label">Total Transfers</div>
                                <div className="card-value text-balance">{formatCurrency(0)}</div>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: '50%', height: '4px', background: 'var(--accent-blue)' }}></div>
                            </motion.div>
                        </div>
                </motion.div>
                )}
                {activePage === 'Transactions' && <Transactions key="tx" />}
                {activePage === 'Accounts' && <Accounts key="acc" />}
                {activePage === 'Transfers' && <Transfer key="trans" />}
                {activePage === 'Reports' && <Reports key="rep" />}
                {activePage === 'Settings' && <Settings key="set" />}
                {activePage === 'Search' && <Search query={searchQuery} key="search" />}
                </AnimatePresence>
            </main>

            {/* Add Transaction Modal */}
            <AnimatePresence>
                {isAddTxModalOpen && (
                    <div className="modal-overlay">
                        <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="modal-header">
                                <h2>Add Transaction</h2>
                                <button className="modal-close" onClick={() => setIsAddTxModalOpen(false)}><FontAwesomeIcon icon={faTimes} /></button>
                            </div>
                            <form onSubmit={handleAddTx} className="modal-form">
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <Input id="desc" required value={txForm.name} onChange={e => setTxForm({...txForm, name: e.target.value})} placeholder="e.g. Starbucks" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount">Amount (₹)</Label>
                                        <Input id="amount" type="number" required value={txForm.amount} onChange={e => setTxForm({...txForm, amount: e.target.value})} placeholder="0.00" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Type</Label>
                                        <Select value={txForm.type} onValueChange={val => setTxForm({...txForm, type: val})}>
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="expense">Expense</SelectItem>
                                                <SelectItem value="income">Income</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Category</Label>
                                        <Select value={txForm.category} onValueChange={val => setTxForm({...txForm, category: val})}>
                                            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                                                <SelectItem value="Shopping">Shopping</SelectItem>
                                                <SelectItem value="Entertainment">Entertainment</SelectItem>
                                                <SelectItem value="General">General</SelectItem>
                                                <SelectItem value="Income">Income</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Save Transaction</Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


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
