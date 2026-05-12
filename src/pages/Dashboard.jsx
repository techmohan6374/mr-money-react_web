import { useNavigate, useLocation, Outlet, NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import './Dashboard.css'
import appLogo from '../assets/app-logo.png'
import { useData } from '../context/DataContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie, faReceipt, faWallet, faChartSimple, faBars, faBarsStaggered, faSearch, faSun, faMoon, faBell, faPlus, faExchangeAlt, faDollarSign, faArrowTrendUp, faArrowTrendDown, faChevronDown, faUser, faSignOutAlt, faTimes, faBuilding, faMugHot, faShoppingCart, faTicket, faCheck, faBolt, faBriefcase, faChartLine, faHamburger, faGift, faHome, faUserCircle, faHeartbeat, faSliders, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Button, Select, Form, Modal, Segmented, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { clearSessionCookie } from '../hooks/useAutoLogin'

function Dashboard() {
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const {
        transactions, accounts, totalIncome, totalExpense, netBalance,
        addTransaction, formatCurrency, formatDate, themeMode, toggleTheme,
        categories, addCategory, currencySymbol, loadAllData
    } = useData()

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false)
    const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false)
    const [newCatForm] = Form.useForm()
    const [form] = Form.useForm()
    const txType = Form.useWatch('type', form)
    const selectedCategory = Form.useWatch('category', form)

    const iconMap = {
        faMugHot, faShoppingCart, faTicket, faReceipt, faBuilding, faPlus, faBolt,
        faBriefcase, faChartLine, faHamburger, faGift, faHome, faUserCircle, faHeartbeat
    }

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
        clearSessionCookie()       // expire the 7-day session cookie
        localStorage.clear()       // clear token + user from localStorage
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
        { icon: <FontAwesomeIcon icon={faSliders} />, label: "Settings", path: "/settings" },
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
        if (values.type === 'transfer') {
            if (values.fromAccountId && values.toAccountId) {
                transferFunds(values.fromAccountId, values.toAccountId, values.amount);
            }
        } else {
            const formattedValues = {
                ...values,
                date: values.date ? dayjs(values.date).toISOString() : new Date().toISOString()
            }
            addTransaction(formattedValues)
        }
        setIsAddTxModalOpen(false)
        form.resetFields()
    }

    return (
        <div className={`dashboard-page ${themeMode} layout-sidebar`}>
            {/* Desktop Sidebar */}
            <aside className={`desktop-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header" style={{ marginBottom: '5px' }}>
                    <a href="/dashboard" className="navbar-brand">
                        <img src={appLogo} alt="Mr.Money" />
                        <span className="brand-text">Mr.Money</span>
                    </a>
                </div>
                <div style={{ height: '1px', background: 'var(--nav-border)', margin: '0 10px 24px 10px', opacity: 0.8 }}></div>

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
                        <img src={user.picture} alt={user.name} className="user-avatar" referrerPolicy="no-referrer" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        <div className="user-avatar" style={{ display: 'none', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#10B981,#059669)', color: 'white', fontWeight: '700', fontSize: '14px', borderRadius: '50%' }}>{(user.name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</div>
                        {!isSidebarCollapsed && (
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                            </div>
                        )}
                        {!isSidebarCollapsed && <span className="user-chevron"><FontAwesomeIcon icon={faChevronDown} /></span>}

                        <div className={`user-dropdown ${dropdownOpen ? 'open' : ''} dropup`}>
                            <div className="dropdown-header">
                                <div className="dh-name">{user.name}</div>
                                <div className="dh-email">{user.email}</div>
                            </div>
                            <button className="dropdown-item" onClick={() => navigate('/settings')}><span className="di-icon"><FontAwesomeIcon icon={faSliders} /></span> Settings</button>
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
                            <FontAwesomeIcon icon={faBarsStaggered} />
                        </button>
                        <button className="sidebar-toggle-btn desktop-only" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: 'var(--text-secondary)' }}>
                            <FontAwesomeIcon icon={faBarsStaggered} />
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
                                    if (e.key === 'Enter' && searchQuery) {
                                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                    }
                                }}
                                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '14px' }}
                            />
                        </div>
                        <button className="notification-btn" onClick={() => navigate('/settings')} style={{ background: 'transparent', border: '1px solid var(--nav-border)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                            <FontAwesomeIcon icon={faSliders} />
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
                        <img src={user.picture} alt={user.name} referrerPolicy="no-referrer" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ display: 'none', width: '48px', height: '48px', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#10B981,#059669)', color: 'white', fontWeight: '700', fontSize: '16px' }}>{(user.name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</div>
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
                        initialValues={{
                            type: 'expense',
                            category: 'Others',
                            date: dayjs().format('YYYY-MM-DD HH:mm')
                        }}
                        style={{ marginTop: '16px' }}
                    >
                        <div style={{ marginBottom: '20px' }}>
                            <Form.Item name="type" style={{ marginBottom: 0 }}>
                                <Segmented
                                    block
                                    size="large"
                                    className="transaction-type-segmented"
                                    options={[
                                        { label: 'Expense', value: 'expense', icon: <FontAwesomeIcon icon={faArrowTrendDown} style={{ color: '#EF4444' }} /> },
                                        { label: 'Income', value: 'income', icon: <FontAwesomeIcon icon={faArrowTrendUp} style={{ color: '#10B981' }} /> },
                                        { label: 'Transfer', value: 'transfer', icon: <FontAwesomeIcon icon={faExchangeAlt} style={{ color: '#3B82F6' }} /> }
                                    ]}
                                />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 2 }}>
                                <Form.Item label="Transaction Name" name="name" rules={[{ required: true, message: 'Required' }]}>
                                    <Input placeholder="e.g. Starbucks" size="large" style={{ borderRadius: '10px' }} />
                                </Form.Item>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Required' }]}>
                                    <Input type="number" prefix={currencySymbol} size="large" placeholder="0.00" style={{ borderRadius: '10px' }} className="amount-input-compact" />
                                </Form.Item>
                            </div>
                        </div>

                        <Form.Item label="Description" name="description">
                            <Input.TextArea placeholder="Add extra notes here..." rows={2} style={{ borderRadius: '10px' }} />
                        </Form.Item>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <Form.Item label="Date & Time" name="date">
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%', borderRadius: '10px' }} size="large" />
                                </Form.Item>
                            </div>
                            <div style={{ flex: 1 }}>
                                {txType === 'transfer' ? (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Form.Item label="From" name="fromAccountId" rules={[{ required: true }]} style={{ flex: 1 }}>
                                            <Select size="large" placeholder="From">
                                                {accounts?.map(acc => <Select.Option key={acc.id} value={acc.id}>{acc.name}</Select.Option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="To" name="toAccountId" rules={[{ required: true }]} style={{ flex: 1 }}>
                                            <Select size="large" placeholder="To">
                                                {accounts?.map(acc => <Select.Option key={acc.id} value={acc.id}>{acc.name}</Select.Option>)}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                ) : (
                                    <Form.Item label="Account" name="accountId">
                                        <Select size="large" style={{ width: '100%', borderRadius: '10px' }} placeholder="Select Account">
                                            {accounts?.map(acc => <Select.Option key={acc.id} value={acc.id}>{acc.name}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                )}
                            </div>
                        </div>

                        <Form.Item label="Category" name="category" className="category-item-custom">
                            <div className="category-chip-grid">
                                {categories.filter(cat => cat.type === txType || cat.type === 'all').map(cat => (
                                    <div
                                        key={cat.name}
                                        className={`category-chip ${selectedCategory === cat.name ? 'active' : ''}`}
                                        onClick={() => form.setFieldsValue({ category: cat.name })}
                                    >
                                        <FontAwesomeIcon icon={iconMap[cat.icon] || faReceipt} style={{ color: cat.color }} />
                                        <span>{cat.name}</span>
                                    </div>
                                ))}
                                <div
                                    className="category-chip add-btn"
                                    onClick={() => setIsAddCatModalOpen(true)}
                                    style={{ borderStyle: 'dashed' }}
                                >
                                    <FontAwesomeIcon icon={faPlus} style={{ color: 'var(--accent-green)' }} />
                                    <span>Add</span>
                                </div>
                            </div>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                            <Button type="primary" htmlType="submit" block size="large" icon={<FontAwesomeIcon icon={faCheck} />} style={{ height: '52px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', background: 'var(--accent-green)', borderColor: 'var(--accent-green)' }}>
                                Save Transaction
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Add Category Modal */}
                <Modal
                    title="Create New Category"
                    open={isAddCatModalOpen}
                    onCancel={() => setIsAddCatModalOpen(false)}
                    onOk={() => newCatForm.submit()}
                    centered
                    width={400}
                    className="premium-modal small"
                >
                    <Form
                        form={newCatForm}
                        layout="vertical"
                        onFinish={(values) => {
                            addCategory({ ...values, type: txType });
                            setIsAddCatModalOpen(false);
                            newCatForm.resetFields();
                        }}
                        initialValues={{ color: '#10B981', icon: 'faTag' }}
                        style={{ marginTop: '16px' }}
                    >
                        <Form.Item label="Category Name" name="name" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Subscriptions" size="large" />
                        </Form.Item>
                        <Form.Item label="Icon" name="icon" rules={[{ required: true }]}>
                            <Select size="large">
                                {Object.keys(iconMap).map(key => (
                                    <Select.Option key={key} value={key}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <FontAwesomeIcon icon={iconMap[key]} />
                                            <span>{key.replace('fa', '')}</span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
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
