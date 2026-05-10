import React, { useState } from 'react';
import './Dashboard.css';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBuilding } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion';
import { Input, Button, Select, Form } from 'antd';

export default function Transfer() {
    const { accounts, transferFunds, formatCurrency } = useData();
    const [form] = Form.useForm();

    const handleTransfer = (values) => {
        transferFunds(values.fromAccountId, values.toAccountId, Number(values.amount));
        form.resetFields();
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
                                        {a.name} ({formatCurrency(a.balance)})
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
                                        {a.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="responsive-grid-2" style={{ gap: '24px' }}>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Amount (₹)</span>}
                            name="amount"
                            rules={[{ required: true, message: 'Please enter amount' }]}
                        >
                            <Input type="number" placeholder="0" size="large" />
                        </Form.Item>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Date</span>}
                            name="date"
                        >
                            <Input type="date" size="large" />
                        </Form.Item>
                    </div>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" block size="large">
                            Transfer Funds
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </motion.div>
    );
}
