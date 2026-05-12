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
        const transferData = {
            fromAccountId: values.fromAccountId,
            toAccountId: values.toAccountId,
            amount: Number(values.amount),
            date: values.date ? dayjs(values.date).toISOString() : new Date().toISOString()
        };
        transferFunds(transferData.fromAccountId, transferData.toAccountId, transferData.amount);
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
                <div className="transfer-visual-container">
                    <div 
                        className="transfer-account-card"
                        style={{ 
                            background: fromAcc ? `${fromAcc.color}15` : 'var(--hover-bg)', 
                            border: `2px solid ${fromAcc ? fromAcc.color : 'transparent'}`
                        }}
                    >
                        <div 
                            className="transfer-account-icon"
                            style={{ 
                                background: fromAcc ? fromAcc.color : 'transparent',
                                border: fromAcc ? 'none' : '2px dashed var(--nav-border)', 
                                color: fromAcc ? 'white' : 'var(--text-muted)'
                            }}
                        >
                            <FontAwesomeIcon icon={fromAcc ? getAccountIcon(fromAcc.type) : faWallet} />
                        </div>
                        <div className="transfer-account-info">
                            <div className="transfer-account-name" style={{ color: fromAcc ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {fromAcc ? fromAcc.name : 'Select Source'}
                            </div>
                            {fromAcc && <div className="transfer-account-balance">{formatCurrency(fromAcc.balance)}</div>}
                        </div>
                    </div>
                    
                    <div className="transfer-icon-divider">
                        <FontAwesomeIcon icon={faExchangeAlt} />
                    </div>

                    <div 
                        className="transfer-account-card"
                        style={{ 
                            background: toAcc ? `${toAcc.color}15` : 'var(--hover-bg)', 
                            border: `2px solid ${toAcc ? toAcc.color : 'transparent'}`
                        }}
                    >
                        <div 
                            className="transfer-account-icon"
                            style={{ 
                                background: toAcc ? toAcc.color : 'transparent',
                                border: toAcc ? 'none' : '2px dashed var(--nav-border)', 
                                color: toAcc ? 'white' : 'var(--text-muted)'
                            }}
                        >
                            <FontAwesomeIcon icon={toAcc ? getAccountIcon(toAcc.type) : faWallet} />
                        </div>
                        <div className="transfer-account-info">
                            <div className="transfer-account-name" style={{ color: toAcc ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {toAcc ? toAcc.name : 'Select Destination'}
                            </div>
                            {toAcc && <div className="transfer-account-balance">{formatCurrency(toAcc.balance)}</div>}
                        </div>
                    </div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleTransfer} initialValues={{
                    date: dayjs()
                }}>
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
