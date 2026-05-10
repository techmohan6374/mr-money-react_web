import React from 'react';
import './Dashboard.css';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugHot, faShoppingCart, faTicket, faDollarSign, faReceipt, faBolt } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion';
import { Input, Select } from 'antd';

export default function Transactions() {
    const { transactions, formatCurrency, formatDate } = useData();

    const getIconForCategory = (category) => {
        switch (category?.toLowerCase()) {
            case 'food & dining': return <FontAwesomeIcon icon={faMugHot} />;
            case 'shopping': return <FontAwesomeIcon icon={faShoppingCart} />;
            case 'entertainment': return <FontAwesomeIcon icon={faTicket} />;
            case 'income': return <FontAwesomeIcon icon={faDollarSign} />;
            case 'utilities': return <FontAwesomeIcon icon={faBolt} />;
            default: return <FontAwesomeIcon icon={faReceipt} />;
        }
    }

    return (
        <motion.div 
            className="page-container" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-header" style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>Transactions</h1>
                <p style={{ color: 'var(--text-muted)' }}>All your income & expense records</p>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                    <Select
                        defaultValue="All Types"
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Select.Option value="All Types">All Types</Select.Option>
                        <Select.Option value="Income">Income</Select.Option>
                        <Select.Option value="Expense">Expense</Select.Option>
                    </Select>
                </div>
                <div style={{ flex: 1 }}>
                    <Select
                        defaultValue="All Accounts"
                        size="large"
                        style={{ width: '100%' }}
                    >
                        <Select.Option value="All Accounts">All Accounts</Select.Option>
                    </Select>
                </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
                <Input.Search
                    placeholder="Search transactions..."
                    size="large"
                    style={{ width: '100%' }}
                />
            </div>

            {transactions.length === 0 ? (
                <div className="premium-card" style={{ padding: '64px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '48px', color: 'var(--text-muted)' }}>📋</div>
                    <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '500' }}>No Transactions Found</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Add a transaction using the + button</p>
                    </div>
                </div>
            ) : (
                <div className="premium-card" style={{ padding: '0 24px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--nav-border)' }}>
                                <th style={{ padding: '16px 0', color: 'var(--text-muted)', fontWeight: '600', fontSize: '14px' }}>Transaction</th>
                                <th style={{ padding: '16px 0', color: 'var(--text-muted)', fontWeight: '600', fontSize: '14px' }}>Category</th>
                                <th style={{ padding: '16px 0', color: 'var(--text-muted)', fontWeight: '600', fontSize: '14px' }}>Date</th>
                                <th style={{ padding: '16px 0', color: 'var(--text-muted)', fontWeight: '600', fontSize: '14px' }}>Status</th>
                                <th style={{ padding: '16px 0', color: 'var(--text-muted)', fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid var(--nav-border)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                                                {getIconForCategory(tx.category)}
                                            </div>
                                            <span style={{ fontWeight: '600' }}>{tx.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{tx.category}</td>
                                    <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{formatDate(tx.date)}</td>
                                    <td style={{ padding: '16px 0' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '600', background: tx.status === 'Completed' ? 'var(--icon-bg-income)' : 'var(--icon-bg-expense)', color: tx.status === 'Completed' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: '500', color: tx.type === 'income' ? 'var(--accent-green)' : 'inherit' }}>
                                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
}
