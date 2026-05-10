import React from 'react';
import './Dashboard.css';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot, faShoppingCart, faTicket, faDollarSign, faReceipt, faBolt, faBuilding, faCreditCard, faWallet } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export default function Search() {
    const { transactions, accounts, formatCurrency, formatDate } = useData();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const q = query.toLowerCase();
    const filteredTx = transactions.filter(tx => tx.name.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q));
    const filteredAcc = accounts.filter(acc => acc.name.toLowerCase().includes(q) || acc.type.toLowerCase().includes(q));

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

    const getIconForType = (type) => {
        if (type === 'Credit') return <FontAwesomeIcon icon={faCreditCard} />;
        if (type === 'Wallet') return <FontAwesomeIcon icon={faWallet} />;
        return <FontAwesomeIcon icon={faBuilding} />;
    }

    return (
        <motion.div 
            className="page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>Search Results</h1>
                <p style={{ color: 'var(--text-muted)' }}>Showing results for "<span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{query}</span>"</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="premium-card transactions-card">
                    <div className="section-header">
                        <h2>Transactions ({filteredTx.length} found)</h2>
                    </div>
                    <div className="transactions-list">
                        {filteredTx.length === 0 ? (
                            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No matching transactions found.</div>
                        ) : (
                            filteredTx.map(tx => (
                                <div className="transaction-item" key={tx.id}>
                                    <div className="tx-icon-wrapper"><span className="tx-icon" style={{ color: 'var(--text-primary)' }}>{getIconForCategory(tx.category)}</span></div>
                                    <div className="tx-details">
                                        <div className="tx-name">{tx.name}</div>
                                        <div className="tx-date">{formatDate(tx.date)} • {tx.category}</div>
                                    </div>
                                    <div className={`tx-amount ${tx.type}`}>
                                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="premium-card">
                    <div className="section-header" style={{ padding: '24px 24px 0 24px' }}>
                        <h2>Accounts ({filteredAcc.length} found)</h2>
                    </div>
                    <div className="transactions-list">
                        {filteredAcc.length === 0 ? (
                            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No matching accounts found.</div>
                        ) : (
                            filteredAcc.map(acc => (
                                <div className="transaction-item" key={acc.id} style={{ borderBottom: '1px solid var(--nav-border)', padding: '16px 24px' }}>
                                    <div className="tx-icon-wrapper"><span className="tx-icon" style={{ color: 'var(--text-primary)' }}>{getIconForType(acc.type)}</span></div>
                                    <div className="tx-details">
                                        <div className="tx-name">{acc.name}</div>
                                        <div className="tx-date">{acc.type} • {acc.number || 'N/A'}</div>
                                    </div>
                                    <div className="tx-amount" style={{ fontWeight: '500' }}>
                                        {formatCurrency(acc.balance)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
