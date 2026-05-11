import React from 'react';
import './Dashboard.css';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion';
import { Input, Button, Select, Form, DatePicker, message } from 'antd';
import { faArrowRight, faBuilding, faWallet, faCreditCard, faBank, faExchangeAlt, faCheck, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs';

export default function Transfer() {
    const { accounts, transferFunds, formatCurrency, currencySymbol } = useData();
    const [form] = Form.useForm();
    const fromAccountId = Form.useWatch('fromAccountId', form);
    const toAccountId = Form.useWatch('toAccountId', form);

    const fromAcc = accounts.find(a => a.id.toString() === fromAccountId);
    const toAcc = accounts.find(a => a.id.toString() === toAccountId);

    const handleTransfer = (values) => {
        transferFunds(values.fromAccountId, values.toAccountId, Number(values.amount));
        message.success('Funds transferred successfully');
        form.resetFields();
    };

    const getAccountIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'bank': return faBank;
            case 'credit': return faCreditCard;
            case 'cash': return faMoneyBillWave;
            default: return faWallet;
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
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>Transfer Money</h1>
                <p style={{ color: 'var(--text-muted)' }}>Move funds between your accounts</p>
            </div>

            <div className="premium-card">
                {/* Visual Diagram */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '40px' }}>
                    <div style={{ 
                        flex: 1, 
                        background: fromAcc ? `${fromAcc.color}15` : 'var(--hover-bg)', 
                        borderRadius: '24px', 
                        padding: '40px 32px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '16px',
                        border: `2px solid ${fromAcc ? fromAcc.color : 'transparent'}`,
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ 
                            width: '72px', 
                            height: '72px', 
                            borderRadius: '20px', 
                            background: fromAcc ? fromAcc.color : 'transparent',
                            border: fromAcc ? 'none' : '2px dashed var(--nav-border)', 
                            color: fromAcc ? 'white' : 'var(--text-muted)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '28px' 
                        }}>
                            <FontAwesomeIcon icon={fromAcc ? getAccountIcon(fromAcc.type) : faWallet} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: '700', fontSize: '18px', color: fromAcc ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {fromAcc ? fromAcc.name : 'Select Source'}
                            </div>
                            {fromAcc && <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{formatCurrency(fromAcc.balance)}</div>}
                        </div>
                    </div>
                    
                    <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%', 
                        background: 'var(--accent-green)', 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        zIndex: 2
                    }}>
                        <FontAwesomeIcon icon={faExchangeAlt} />
                    </div>

                    <div style={{ 
                        flex: 1, 
                        background: toAcc ? `${toAcc.color}15` : 'var(--hover-bg)', 
                        borderRadius: '24px', 
                        padding: '40px 32px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '16px',
                        border: `2px solid ${toAcc ? toAcc.color : 'transparent'}`,
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ 
                            width: '72px', 
                            height: '72px', 
                            borderRadius: '20px', 
                            background: toAcc ? toAcc.color : 'transparent',
                            border: toAcc ? 'none' : '2px dashed var(--nav-border)', 
                            color: toAcc ? 'white' : 'var(--text-muted)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '28px' 
                        }}>
                            <FontAwesomeIcon icon={toAcc ? getAccountIcon(toAcc.type) : faWallet} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: '700', fontSize: '18px', color: toAcc ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {toAcc ? toAcc.name : 'Select Destination'}
                            </div>
                            {toAcc && <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{formatCurrency(toAcc.balance)}</div>}
                        </div>
                    </div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleTransfer}>
                    <div className="responsive-grid-2" style={{ gap: '24px' }}>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Select Source Account</span>}
                            name="fromAccountId"
                            rules={[{ required: true, message: 'Please select source account' }]}
                        >
                            <Select placeholder="Source Account" size="large" style={{ width: '100%' }}>
                                {accounts.map(a => (
                                    <Select.Option key={a.id} value={a.id.toString()}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color }}></div>
                                            {a.name} ({formatCurrency(a.balance)})
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Select Destination Account</span>}
                            name="toAccountId"
                            rules={[{ required: true, message: 'Please select destination account' }]}
                        >
                            <Select placeholder="Destination Account" size="large" style={{ width: '100%' }}>
                                {accounts.map(a => (
                                    <Select.Option key={a.id} value={a.id.toString()}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color }}></div>
                                            {a.name}
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="responsive-grid-2" style={{ gap: '24px' }}>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Amount ({currencySymbol})</span>}
                            name="amount"
                            rules={[{ required: true, message: 'Please enter amount' }]}
                        >
                            <Input type="number" placeholder="0.00" size="large" prefix={currencySymbol} style={{ borderRadius: '12px' }} />
                        </Form.Item>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Date & Time</span>}
                            name="date"
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" size="large" style={{ width: '100%', borderRadius: '12px' }} placeholder="Select Date and Time" />
                        </Form.Item>
                    </div>

                    <Form.Item style={{ marginBottom: 0, marginTop: '16px' }}>
                        <Button type="primary" htmlType="submit" block size="large" icon={<FontAwesomeIcon icon={faCheck} />} style={{ height: '56px', borderRadius: '14px', fontSize: '16px', fontWeight: '700', background: 'var(--accent-green)', borderColor: 'var(--accent-green)' }}>
                            Transfer Funds
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </motion.div>
    );
}
