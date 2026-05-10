import React from 'react';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faReceipt, faExchangeAlt, faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
    const { totalIncome, totalExpense, netBalance, formatCurrency } = useData();
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : {};

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good Morning";
        if (h < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
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
    );
}
