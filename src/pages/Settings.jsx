import React from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Input, Button, Select, Switch, Form } from 'antd';

export default function Settings() {
    const [form] = Form.useForm();

    return (
        <motion.div 
            className="page-container" 
            style={{ maxWidth: '800px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your account preferences and security.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Profile Section */}
                <div className="premium-card" style={{ padding: '32px' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', borderBottom: '1px solid var(--nav-border)', paddingBottom: '16px' }}>Profile Information</h3>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                            <FontAwesomeIcon icon={faUser} size="2x" />
                        </div>
                        <div>
                            <Button variant="outlined" size="small" style={{ marginBottom: '8px', display: 'block' }}>Change Avatar</Button>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>JPG, GIF or PNG. Max size of 800K</p>
                        </div>
                    </div>
                    <div className="responsive-grid-2" style={{ gap: '16px' }}>
                        <Form.Item label="First Name">
                            <Input id="first-name" defaultValue="John" size="large" />
                        </Form.Item>
                        <Form.Item label="Last Name">
                            <Input id="last-name" defaultValue="Doe" size="large" />
                        </Form.Item>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="premium-card" style={{ padding: '32px' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', borderBottom: '1px solid var(--nav-border)', paddingBottom: '16px' }}>Preferences</h3>
                    
                    <div className="responsive-flex-between" style={{ marginBottom: '24px' }}>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Email Notifications</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Receive weekly summary reports.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <div className="responsive-flex-between">
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Default Currency</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Select your primary currency.</p>
                        </div>
                        <Select defaultValue="INR" size="large" style={{ width: '150px' }}>
                            <Select.Option value="INR">INR (₹)</Select.Option>
                            <Select.Option value="USD">USD ($)</Select.Option>
                            <Select.Option value="EUR">EUR (€)</Select.Option>
                        </Select>
                    </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button size="large">Cancel</Button>
                    <Button type="primary" size="large">Save Changes</Button>
                </div>
            </div>
        </motion.div>
    );
}
