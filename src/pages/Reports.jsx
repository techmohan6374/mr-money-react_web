import React, { useState } from 'react';
import './Dashboard.css';
import { motion } from 'framer-motion';
import { Select } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown, faBuilding, faCalendarDay, faChartLine, faTrophy, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { useData } from '../context/DataContext';

export default function Reports() {
    const {
        formatCurrency,
        totalIncome,
        totalExpense,
        todayTxCount,
        avgDailySpend,
        topCategory,
        largestExpense,
        categoryBreakdown,
        weeklyChartData,
        accounts,
    } = useData();

    const [period, setPeriod] = useState('Weekly');
    const [selectedAccount, setSelectedAccount] = useState('All Accounts');
    const [txType, setTxType] = useState('All');

    const netSavings = totalIncome - totalExpense;

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>Reports & Analytics</h1>
                <p style={{ color: 'var(--text-muted)' }}>Deep dive into your financial data</p>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: 'var(--card-bg)', borderRadius: '12px', padding: '4px', border: '1px solid var(--nav-border)' }}>
                    {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            style={{
                                padding: '8px 16px', borderRadius: '8px',
                                background: period === p ? 'var(--accent-green)' : 'transparent',
                                color: period === p ? 'white' : 'var(--text-secondary)',
                                fontWeight: period === p ? '600' : '500',
                                fontSize: '14px', transition: 'all 0.2s ease',
                                border: 'none', cursor: 'pointer'
                            }}
                        >{p}</button>
                    ))}
                </div>
                <div style={{ flex: 1, display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                    <Select value={selectedAccount} onChange={setSelectedAccount} size="large" style={{ width: '180px' }}>
                        <Select.Option value="All Accounts">All Accounts</Select.Option>
                        {accounts.map(a => <Select.Option key={a.id} value={a.id.toString()}>{a.name}</Select.Option>)}
                    </Select>
                    <Select value={txType} onChange={setTxType} size="large" style={{ width: '180px' }}>
                        <Select.Option value="All">All Types</Select.Option>
                        <Select.Option value="Income">Income</Select.Option>
                        <Select.Option value="Expense">Expense</Select.Option>
                    </Select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="dashboard-stats" style={{ marginBottom: '24px' }}>
                <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="card-header">
                        <div style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                            <FontAwesomeIcon icon={faArrowTrendDown} /> Total Income
                        </div>
                    </div>
                    <div className="card-value text-income" style={{ fontSize: '28px', marginTop: '12px' }}>{formatCurrency(totalIncome)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>All time income</div>
                </motion.div>

                <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="card-header">
                        <div style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                            <FontAwesomeIcon icon={faArrowTrendUp} /> Total Expense
                        </div>
                    </div>
                    <div className="card-value text-expense" style={{ fontSize: '28px', marginTop: '12px' }}>{formatCurrency(totalExpense)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>All time expenses</div>
                </motion.div>

                <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="card-header">
                        <div style={{ color: netSavings >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                            <FontAwesomeIcon icon={faBuilding} /> Net Savings
                        </div>
                    </div>
                    <div className={`card-value ${netSavings >= 0 ? 'text-income' : 'text-expense'}`} style={{ fontSize: '28px', marginTop: '12px' }}>{formatCurrency(netSavings)}</div>
                    <div style={{ color: netSavings >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontSize: '12px', marginTop: '8px', fontWeight: '600' }}>
                        {netSavings >= 0 ? '▲ Surplus' : '▼ Deficit'}
                    </div>
                </motion.div>
            </div>

            {/* Quick Insights */}
            <div className="premium-card" style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>⚡ Quick Insights</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--green-50)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faCalendarDay} /></div>
                        <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Today's Transactions</div><div style={{ fontSize: '18px', fontWeight: '600' }}>{todayTxCount}</div></div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faChartLine} /></div>
                        <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Avg. Daily Spend</div><div style={{ fontSize: '18px', fontWeight: '600' }}>{formatCurrency(avgDailySpend)}</div></div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faTrophy} /></div>
                        <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Top Category</div><div style={{ fontSize: '18px', fontWeight: '600' }}>{topCategory}</div></div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--icon-bg-expense)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faMoneyBillWave} /></div>
                        <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Largest Expense</div><div style={{ fontSize: '18px', fontWeight: '600' }}>{largestExpense ? largestExpense.name : '—'}</div></div>
                    </div>
                </div>
            </div>

            <div className="responsive-grid-2" style={{ marginBottom: '24px' }}>
                {/* Bar Chart */}
                <div className="premium-card" style={{ padding: '32px' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '500' }}>Income vs Expense (Last 7 Days)</h3>
                    {weeklyChartData.every(d => d.income === 0 && d.expense === 0) ? (
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '32px' }}>📊</span>
                            <span>No transaction data yet</span>
                        </div>
                    ) : (
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--nav-border)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'var(--hover-bg)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--nav-border)', boxShadow: 'var(--shadow-lg)' }} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                    <Bar dataKey="income" name="Income" fill="var(--accent-green)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    <Bar dataKey="expense" name="Expense" fill="var(--accent-red)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Category Breakdown */}
                <div className="premium-card" style={{ padding: '32px' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '500' }}>Category Breakdown</h3>
                    {categoryBreakdown.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-muted)', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '32px' }}>🗂️</span>
                            <span>No expense data yet</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {categoryBreakdown.map((item, i) => (
                                <div key={item.cat}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                        <span style={{ fontWeight: '500' }}>{item.cat}</span>
                                        <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>{item.pct} &nbsp;·&nbsp; {formatCurrency(item.amount)}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--hover-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: item.pct }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            style={{ height: '100%', background: item.color, borderRadius: '4px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
