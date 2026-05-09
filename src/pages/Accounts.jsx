import React, { useState } from 'react';
import './Dashboard.css';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBuilding, faCreditCard, faWallet, faEllipsisH, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function Accounts() {
    const { accounts, addAccount, formatCurrency } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', type: 'Bank Account', balance: '', number: '' });

    const getIconForType = (type) => {
        if (type === 'Credit') return <FontAwesomeIcon icon={faCreditCard} />;
        if (type === 'Wallet') return <FontAwesomeIcon icon={faWallet} />;
        return <FontAwesomeIcon icon={faBuilding} />;
    }

    const handleAddAccount = (e) => {
        e.preventDefault();
        addAccount({
            ...form,
            color: selectedColor
        });
        setForm({ name: '', type: 'Savings', balance: '', number: '', holderName: '' });
    }

    const [selectedColor, setSelectedColor] = useState('#10B981');
    const colorOptions = ['#10B981', '#34D399', '#D97706', '#65A30D', '#0D9488', '#3B82F6', '#8B5CF6', '#6366F1'];

    return (
        <motion.div 
            className="page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-header responsive-flex-between" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>Accounts</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your connected accounts and wallets.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {accounts.map((acc, index) => (
                    <motion.div 
                        key={acc.id} 
                        className="premium-card" 
                        style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: acc.color, opacity: '0.1', zIndex: 0 }}></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                                        {getIconForType(acc.type)}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>{acc.name}</h3>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{acc.type}</span>
                                    </div>
                                </div>
                                <span style={{ color: 'var(--text-muted)' }}><FontAwesomeIcon icon={faEllipsisH} /></span>
                            </div>
                            
                            <div>
                                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Current Balance</p>
                                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>{formatCurrency(acc.balance)}</h2>
                                <p style={{ margin: '16px 0 0 0', fontSize: '14px', fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--text-muted)' }}>{acc.number || 'N/A'}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="premium-card" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>Add New Account</h2>
                </div>

                <form onSubmit={handleAddAccount}>
                    <div className="responsive-grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
                        <div className="grid gap-2">
                            <Label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Account Name</Label>
                            <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. HDFC Savings" />
                        </div>
                        <div className="grid gap-2">
                            <Label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Holder Name</Label>
                            <Input value={form.holderName || ''} onChange={e => setForm({...form, holderName: e.target.value})} placeholder="e.g. Mohanraj" />
                        </div>
                    </div>

                    <div className="responsive-grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
                        <div className="grid gap-2">
                            <Label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Opening Balance (₹)</Label>
                            <Input type="number" required value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} placeholder="0" />
                        </div>
                        <div className="grid gap-2">
                            <Label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Account Type</Label>
                            <Select value={form.type} onValueChange={val => setForm({...form, type: val})}>
                                <SelectTrigger><SelectValue placeholder="Savings" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Savings">Savings</SelectItem>
                                    <SelectItem value="Current">Current</SelectItem>
                                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                                    <SelectItem value="Wallet">Wallet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <Label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Card Color</Label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {colorOptions.map(color => (
                                <button 
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    style={{ 
                                        width: '32px', height: '32px', borderRadius: '8px', 
                                        background: color, border: selectedColor === color ? '2px solid var(--text-primary)' : '2px solid transparent',
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-[#10B981] hover:bg-[#059669] text-white">Create Account</Button>
                </form>
            </div>
        </motion.div>
    );
}
