import React, { useState } from 'react';
import './Dashboard.css';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown, faBuilding, faReceipt, faCalendarDay, faChartLine, faTrophy, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { useData } from '../context/DataContext';

export default function Reports() {
    const { formatCurrency } = useData();
    const [period, setPeriod] = useState('Monthly');

    const data = [
        { name: 'Mon', income: 4000, expense: 2400 },
        { name: 'Tue', income: 3000, expense: 1398 },
        { name: 'Wed', income: 2000, expense: 9800 },
        { name: 'Thu', income: 2780, expense: 3908 },
        { name: 'Fri', income: 1890, expense: 4800 },
        { name: 'Sat', income: 2390, expense: 3800 },
        { name: 'Sun', income: 3490, expense: 4300 },
    ];
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
                                padding: '8px 16px',
                                borderRadius: '8px',
                                background: period === p ? 'var(--accent-green)' : 'transparent',
                                color: period === p ? 'white' : 'var(--text-secondary)',
                                fontWeight: period === p ? '600' : '500',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <div style={{ flex: 1, display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                    <Select defaultValue="All Accounts">
                        <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="All Accounts" /></SelectTrigger>
                        <SelectContent><SelectItem value="All Accounts">All Accounts</SelectItem></SelectContent>
                    </Select>
                    <Select defaultValue="Income">
                        <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="Income" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Income">Income</SelectItem>
                            <SelectItem value="Expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="dashboard-stats" style={{ marginBottom: '24px' }}>
                <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="card-header">
                        <div style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                            <FontAwesomeIcon icon={faArrowTrendDown} /> Total Income
                        </div>
                    </div>
                    <div className="card-value text-income" style={{ fontSize: '28px', marginTop: '12px' }}>{formatCurrency(12500)}</div>
                    <div style={{ color: 'var(--accent-green)', fontSize: '12px', marginTop: '8px', fontWeight: '600' }}>▲ 8.2% vs last period</div>
                </motion.div>

                <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="card-header">
                        <div style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                            <FontAwesomeIcon icon={faArrowTrendUp} /> Total Expense
                        </div>
                    </div>
                    <div className="card-value text-expense" style={{ fontSize: '28px', marginTop: '12px' }}>{formatCurrency(8400)}</div>
                    <div style={{ color: 'var(--accent-red)', fontSize: '12px', marginTop: '8px', fontWeight: '600' }}>▼ 3.1% vs last period</div>
                </motion.div>

                <motion.div className="premium-card summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="card-header">
                        <div style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                            <FontAwesomeIcon icon={faBuilding} /> Net Savings
                        </div>
                    </div>
                    <div className="card-value text-income" style={{ fontSize: '28px', marginTop: '12px' }}>{formatCurrency(4100)}</div>
                    <div style={{ color: 'var(--accent-green)', fontSize: '12px', marginTop: '8px', fontWeight: '600' }}>▲ Surplus</div>
                </motion.div>
            </div>

            <div className="premium-card" style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>⚡ Quick Insights</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--green-50)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faCalendarDay} /></div>
                        <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Today Transactions</div><div style={{ fontSize: '18px', fontWeight: '600' }}>12</div></div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faChartLine} /></div>
                        <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Avg. Daily Spend</div><div style={{ fontSize: '18px', fontWeight: '600' }}>{formatCurrency(850)}</div></div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faTrophy} /></div>
                        <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Top Category</div><div style={{ fontSize: '18px', fontWeight: '600' }}>Food</div></div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--icon-bg-expense)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faMoneyBillWave} /></div>
                        <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Largest Expense</div><div style={{ fontSize: '18px', fontWeight: '600' }}>Rent</div></div>
                    </div>
                </div>
            </div>

            <div className="responsive-grid-2" style={{ marginBottom: '24px' }}>
                <div className="premium-card" style={{ padding: '32px' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '500' }}>Income vs Expense</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
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
                </div>

                <div className="premium-card" style={{ padding: '32px' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '500' }}>Category Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { cat: "Housing", pct: "40%", color: "#3B82F6" },
                            { cat: "Food", pct: "25%", color: "#F59E0B" },
                            { cat: "Transport", pct: "15%", color: "#10B981" },
                            { cat: "Entertainment", pct: "10%", color: "#8B5CF6" },
                            { cat: "Other", pct: "10%", color: "#6B7280" }
                        ].map((item, i) => (
                            <div key={item.cat}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                    <span style={{ fontWeight: '500' }}>{item.cat}</span>
                                    <span style={{ fontWeight: '500' }}>{item.pct}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--hover-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: item.pct }} transition={{ duration: 1, delay: i * 0.1 }} style={{ height: '100%', background: item.color, borderRadius: '4px' }}></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
