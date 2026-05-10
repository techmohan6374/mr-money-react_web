import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faReceipt, faExchangeAlt, faArrowTrendUp, faArrowTrendDown, faEye, faEyeSlash, faWallet, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { 
    ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function DashboardOverview() {
    const {
        totalIncome, totalExpense, netBalance, formatCurrency,
        categoryBreakdown, weeklyChartData
    } = useData();
    const [showBalance, setShowBalance] = useState(true);
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
            <div className="dashboard-welcome" style={{ padding: '24px 32px', background: 'var(--card-bg)', marginBottom: '24px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                <div className="welcome-text">
                    <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>{getGreeting()}, <span style={{ color: 'var(--accent-green)' }}>{user.name?.split(' ')[0]}</span> 👋</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Here's your financial overview for this month.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                    <div className="balance-section">
                        <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Total Balance</div>
                        <div style={{ fontSize: '32px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)' }}>
                            {showBalance ? formatCurrency(netBalance) : '₹••••••'}
                            <span
                                onClick={() => setShowBalance(!showBalance)}
                                style={{ fontSize: '16px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '50%', transition: 'background 0.2s' }}
                                className="eye-toggle-btn"
                            >
                                <FontAwesomeIcon icon={showBalance ? faEye : faEyeSlash} />
                            </span>
                        </div>
                    </div>

                    <div style={{ width: '1px', height: '40px', background: 'var(--nav-border)' }} className="desktop-divider"></div>

                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--icon-bg-income)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                <FontAwesomeIcon icon={faArrowTrendDown} />
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Income</div>
                                <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>{showBalance ? formatCurrency(totalIncome) : '₹••••••'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--icon-bg-expense)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                <FontAwesomeIcon icon={faArrowTrendUp} />
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Expense</div>
                                <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>{showBalance ? formatCurrency(totalExpense) : '₹••••••'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="dashboard-stats">
                <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="card-icon-wrapper income" style={{ width: '48px', height: '48px', fontSize: '20px', flexShrink: 0 }}>
                        <FontAwesomeIcon icon={faBuilding} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="card-label" style={{ fontSize: '13px', marginBottom: '4px' }}>Total Income</div>
                        <div className="card-value text-income" style={{ fontSize: '24px' }}>{showBalance ? formatCurrency(totalIncome) : '₹••••••'}</div>
                    </div>
                    <div className="card-trend up" style={{ fontSize: '12px' }}><FontAwesomeIcon icon={faArrowTrendUp} /> 12.5%</div>
                </motion.div>

                <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="card-icon-wrapper expense" style={{ width: '48px', height: '48px', fontSize: '20px', flexShrink: 0 }}>
                        <FontAwesomeIcon icon={faReceipt} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="card-label" style={{ fontSize: '13px', marginBottom: '4px' }}>Total Expense</div>
                        <div className="card-value text-expense" style={{ fontSize: '24px' }}>{showBalance ? formatCurrency(totalExpense) : '₹••••••'}</div>
                    </div>
                    <div className="card-trend down" style={{ fontSize: '12px' }}><FontAwesomeIcon icon={faArrowTrendDown} /> 8.2%</div>
                </motion.div>

                <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="card-icon-wrapper balance" style={{ width: '48px', height: '48px', fontSize: '20px', flexShrink: 0 }}>
                        <FontAwesomeIcon icon={faWallet} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="card-label" style={{ fontSize: '13px', marginBottom: '4px' }}>Net Balance</div>
                        <div className="card-value text-balance" style={{ fontSize: '24px' }}>{showBalance ? formatCurrency(netBalance) : '₹••••••'}</div>
                    </div>
                    <div className="card-trend up" style={{ fontSize: '12px' }}><FontAwesomeIcon icon={faArrowTrendUp} /> 4.1%</div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="dashboard-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginTop: '24px' }}>
                {/* Weekly Trend Chart */}
                <motion.div className="premium-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--icon-bg-balance)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faChartLine} />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>Weekly Overview</h3>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nav-border)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--nav-border)', boxShadow: 'var(--shadow-lg)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                                    cursor={{ fill: 'var(--hover-bg)', opacity: 0.4 }}
                                />
                                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={25} />
                                <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Category Doughnut Chart */}
                <motion.div className="premium-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--icon-bg-income)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faReceipt} />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>Expenses by Category</h3>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="amount"
                                    nameKey="cat"
                                    stroke="none"
                                >
                                    {categoryBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--nav-border)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

