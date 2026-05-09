import React, { useState } from 'react';
import './Dashboard.css';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBuilding } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function Transfer() {
    const { accounts, transferFunds, formatCurrency } = useData();
    const [transferForm, setTransferForm] = useState({ fromAccountId: '', toAccountId: '', amount: '' });

    const handleTransfer = (e) => {
        e.preventDefault();
        const success = transferFunds(transferForm.fromAccountId, transferForm.toAccountId, Number(transferForm.amount));
        if (success) {
            setTransferForm({ fromAccountId: '', toAccountId: '', amount: '' });
        }
    };

    return (
        <motion.div 
            className="page-container" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>Transfer Money</h1>
                <p style={{ color: 'var(--text-muted)' }}>Move funds between your accounts</p>
            </div>

            <div className="premium-card">
                {/* Visual Diagram */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '40px' }}>
                    <div style={{ flex: 1, background: 'var(--hover-bg)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '2px dashed var(--accent-green)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            <FontAwesomeIcon icon={faBuilding} />
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--accent-green)' }}>Select Source</span>
                    </div>
                    
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </div>

                    <div style={{ flex: 1, background: 'var(--hover-bg)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '2px dashed var(--accent-green)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            <FontAwesomeIcon icon={faBuilding} />
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--accent-green)' }}>Select Destination</span>
                    </div>
                </div>

                <form onSubmit={handleTransfer}>
                    <div className="responsive-grid-2" style={{ marginBottom: '24px', gap: '24px' }}>
                        <div className="grid gap-2">
                            <Label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Select Source Account</Label>
                            <Select value={transferForm.fromAccountId} onValueChange={val => setTransferForm({...transferForm, fromAccountId: val})}>
                                <SelectTrigger><SelectValue placeholder="Source Account" /></SelectTrigger>
                                <SelectContent>
                                    {accounts.map(a => <SelectItem key={a.id} value={a.id.toString()}>{a.name} ({formatCurrency(a.balance)})</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Select Destination Account</Label>
                            <Select value={transferForm.toAccountId} onValueChange={val => setTransferForm({...transferForm, toAccountId: val})}>
                                <SelectTrigger><SelectValue placeholder="Destination Account" /></SelectTrigger>
                                <SelectContent>
                                    {accounts.map(a => <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="responsive-grid-2" style={{ marginBottom: '24px', gap: '24px' }}>
                        <div className="grid gap-2">
                            <Label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Amount (₹)</Label>
                            <Input type="number" required value={transferForm.amount} onChange={e => setTransferForm({...transferForm, amount: e.target.value})} placeholder="0" />
                        </div>
                        <div className="grid gap-2">
                            <Label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Date</Label>
                            <Input type="date" />
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-[#10B981] hover:bg-[#059669] text-white">Transfer Funds</Button>
                </form>
            </div>
        </motion.div>
    );
}
