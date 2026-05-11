import React, { useState } from 'react';
import './Dashboard.css';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBuilding, faCreditCard, faWallet, faPen, faTrash, faStar, faThLarge, faList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button, Select, Form, Modal, Switch, Tooltip } from 'antd';
import { EllipsisOutlined, EditOutlined, DeleteOutlined, StarFilled } from '@ant-design/icons';
import { Dropdown } from 'antd';
import toast from 'react-hot-toast';

const PRESET_COLORS = ['#10B981', '#34D399', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#0D9488'];

// ─── Color Picker (presets + custom hex) ────────────────────────────────────
function ColorPicker({ selected, onChange }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {PRESET_COLORS.map(color => (
                <button
                    key={color}
                    type="button"
                    onClick={() => onChange(color)}
                    style={{
                        width: '30px', height: '30px', borderRadius: '8px', background: color, cursor: 'pointer',
                        border: selected === color ? '3px solid var(--text-primary)' : '2px solid transparent',
                        boxShadow: selected === color ? '0 0 0 2px white inset' : 'none',
                        transition: 'all 0.15s ease', flexShrink: 0,
                    }}
                />
            ))}
            {/* Custom color */}
            <Tooltip title="Custom colour">
                <label style={{ position: 'relative', width: '30px', height: '30px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: (selected && !PRESET_COLORS.includes(selected)) ? '3px solid var(--text-primary)' : '2px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected || '#ffffff', flexShrink: 0 }}>
                    <input
                        type="color"
                        value={selected || '#000000'}
                        onChange={e => onChange(e.target.value)}
                        style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12px', pointerEvents: 'none', color: selected ? 'white' : 'var(--text-muted)', fontWeight: '700', textShadow: selected ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}>+</span>
                </label>
            </Tooltip>
        </div>
    );
}

// ─── View mode icons ─────────────────────────────────────────────────────────
const VIEW_MODES = [
    { key: 'grid', icon: faThLarge, label: 'Card Grid' },
    { key: 'list', icon: faList, label: 'List' },
    { key: 'compact', icon: faTableCellsLarge, label: 'Compact' },
];

function getIconForType(type) {
    if (type === 'Card') return <FontAwesomeIcon icon={faCreditCard} />;
    if (type === 'Cash') return <FontAwesomeIcon icon={faWallet} />;
    return <FontAwesomeIcon icon={faBuilding} />;
}

export default function Accounts() {
    const { accounts, addAccount, deleteAccount, editAccount, formatCurrency, currencySymbol } = useData();
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const getRandomColor = () => PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];

    const [addColor, setAddColor] = useState(null);
    const [editColor, setEditColor] = useState('#10B981');
    const [isDefault, setIsDefault] = useState(false);
    const [editIsDefault, setEditIsDefault] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [editingAccount, setEditingAccount] = useState(null);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleAddAccount = (values) => {
        const colorToUse = addColor || getRandomColor();
        addAccount({ ...values, color: colorToUse, isDefault });
        addForm.resetFields();
        setAddColor(null);
        setIsDefault(false);
        toast.success('Account created successfully');
    };

    const openEdit = (acc) => {
        setEditingAccount(acc);
        setEditColor(acc.color || '#10B981');
        setEditIsDefault(acc.isDefault || false);
        editForm.setFieldsValue({
            name: acc.name, holderName: acc.holderName || '',
            balance: acc.balance, type: acc.type,
        });
    };

    const handleEdit = (values) => {
        editAccount(editingAccount.id, { ...values, color: editColor, isDefault: editIsDefault });
        setEditingAccount(null);
        toast.success('Account updated successfully');
    };

    const getMenuItems = (acc) => [
        { key: 'edit', label: 'Edit Account', icon: <EditOutlined />, onClick: () => openEdit(acc) },
        {
            key: 'delete', label: 'Delete Account', icon: <DeleteOutlined />, danger: true,
            onClick: () => Modal.confirm({
                icon: null,
                title: (
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                            <DeleteOutlined />
                        </div>
                        <div style={{ paddingTop: '2px' }}>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Delete Account</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', fontWeight: '400' }}>
                                Are you sure you want to delete <strong>{acc.name}</strong>? This action cannot be undone and all associated data will be removed.
                            </div>
                        </div>
                    </div>
                ),
                content: null,
                width: 460,
                centered: true,
                okText: 'Delete',
                cancelText: 'Cancel',
                okButtonProps: { 
                    danger: true, 
                    size: 'large', 
                    style: { borderRadius: '8px', fontWeight: '500', padding: '0 24px' } 
                },
                cancelButtonProps: { 
                    size: 'large', 
                    style: { borderRadius: '8px', fontWeight: '500', padding: '0 20px', border: '1px solid var(--card-border)' } 
                },
                styles: {
                    content: { padding: '28px', borderRadius: '20px' }
                },
                onOk: () => {
                    deleteAccount(acc.id);
                    toast.success('Account deleted successfully');
                },
            }),
        },
    ];

    // ── Account Card (grid) ───────────────────────────────────────────────────
    const GridCard = ({ acc, index }) => (
        <motion.div
            key={acc.id}
            className="premium-card"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: acc.color }} />
            <div style={{ position: 'absolute', inset: 0, background: acc.color, opacity: 0.06, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: acc.color + '22', border: `1px solid ${acc.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: acc.color, fontSize: '18px' }}>
                            {getIconForType(acc.type)}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{acc.name}</h3>
                                {acc.isDefault && <StarFilled style={{ color: '#F59E0B', fontSize: '12px' }} />}
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{acc.type}</span>
                        </div>
                    </div>
                    <Dropdown menu={{ items: getMenuItems(acc) }} trigger={['click']} placement="bottomRight">
                        <button style={{ background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <EllipsisOutlined />
                        </button>
                    </Dropdown>
                </div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500' }}>Current Balance</p>
                <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: acc.balance < 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{formatCurrency(acc.balance)}</h2>
                {acc.holderName && <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{acc.holderName}</p>}
            </div>
        </motion.div>
    );

    // ── Account Row (list) ────────────────────────────────────────────────────
    const ListRow = ({ acc, index }) => (
        <motion.div
            key={acc.id}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--nav-border)', gap: '16px' }}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }} transition={{ delay: index * 0.04 }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <div style={{ width: '6px', height: '40px', borderRadius: '3px', background: acc.color, flexShrink: 0 }} />
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: acc.color + '22', border: `1px solid ${acc.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: acc.color, fontSize: '16px', flexShrink: 0 }}>
                    {getIconForType(acc.type)}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{acc.name}</span>
                        {acc.isDefault && <StarFilled style={{ color: '#F59E0B', fontSize: '11px' }} />}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{acc.type}{acc.holderName ? ` · ${acc.holderName}` : ''}</span>
                </div>
                <span style={{ fontWeight: '700', fontSize: '16px', color: acc.balance < 0 ? 'var(--accent-red)' : 'var(--accent-green)', flexShrink: 0 }}>{formatCurrency(acc.balance)}</span>
            </div>
            <Dropdown menu={{ items: getMenuItems(acc) }} trigger={['click']} placement="bottomRight">
                <button style={{ background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                    <EllipsisOutlined />
                </button>
            </Dropdown>
        </motion.div>
    );

    // ── Compact tile ──────────────────────────────────────────────────────────
    const CompactTile = ({ acc, index }) => (
        <motion.div
            key={acc.id}
            style={{ padding: '14px 16px', border: '1px solid var(--card-border)', borderRadius: '12px', borderLeftWidth: '4px', borderLeftColor: acc.color, background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ delay: index * 0.04 }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <div style={{ color: acc.color, fontSize: '16px', flexShrink: 0 }}>{getIconForType(acc.type)}</div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.name}</span>
                        {acc.isDefault && <StarFilled style={{ color: '#F59E0B', fontSize: '10px', flexShrink: 0 }} />}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{acc.type}</span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: acc.balance < 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{formatCurrency(acc.balance)}</span>
                <Dropdown menu={{ items: getMenuItems(acc) }} trigger={['click']} placement="bottomRight">
                    <button style={{ background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px' }}>
                        <EllipsisOutlined />
                    </button>
                </Dropdown>
            </div>
        </motion.div>
    );

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>Accounts</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Manage your connected accounts and wallets.</p>
                </div>

                {/* View Toggle */}
                <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px', gap: '2px' }}>
                    {VIEW_MODES.map(v => (
                        <Tooltip key={v.key} title={v.label}>
                            <button
                                onClick={() => setViewMode(v.key)}
                                style={{
                                    width: '36px', height: '36px', borderRadius: '7px', border: 'none',
                                    background: viewMode === v.key ? 'var(--accent-green)' : 'transparent',
                                    color: viewMode === v.key ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '14px', transition: 'all 0.2s ease',
                                }}
                            >
                                <FontAwesomeIcon icon={v.icon} />
                            </button>
                        </Tooltip>
                    ))}
                </div>
            </div>

            {/* Accounts View */}
            {accounts.length === 0 ? (
                <div className="premium-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏦</div>
                    <p style={{ margin: 0, fontWeight: '500' }}>No accounts yet. Add your first account below.</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {viewMode === 'grid' && (
                        <motion.div key="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            <AnimatePresence>
                                {accounts.map((acc, i) => <GridCard key={acc.id} acc={acc} index={i} />)}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {viewMode === 'list' && (
                        <motion.div key="list" className="premium-card" style={{ marginBottom: '32px', padding: 0, overflow: 'hidden' }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            <AnimatePresence>
                                {accounts.map((acc, i) => <ListRow key={acc.id} acc={acc} index={i} />)}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {viewMode === 'compact' && (
                        <motion.div key="compact" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginBottom: '32px' }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            <AnimatePresence>
                                {accounts.map((acc, i) => <CompactTile key={acc.id} acc={acc} index={i} />)}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Add New Account Form */}
            <div className="premium-card" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Add New Account</h2>
                </div>

                <Form form={addForm} layout="vertical" onFinish={handleAddAccount}>
                    <div className="responsive-grid-2" style={{ gap: '20px' }}>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Account Name *</span>}
                            name="name"
                            rules={[{ required: true, message: 'Please enter account name' }]}
                        >
                            <Input placeholder="e.g. HDFC Savings" size="large" />
                        </Form.Item>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Holder Name</span>}
                            name="holderName"
                        >
                            <Input placeholder="e.g. Mohanraj" size="large" />
                        </Form.Item>
                    </div>

                    <div className="responsive-grid-2" style={{ gap: '20px' }}>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Opening Balance ({currencySymbol}) *</span>}
                            name="balance"
                            initialValue={0}
                            rules={[{ required: true, message: 'Please enter opening balance' }]}
                        >
                            <Input type="number" placeholder="0" size="large" />
                        </Form.Item>
                        <Form.Item
                            label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Account Type</span>}
                            name="type"
                            initialValue="Savings"
                        >
                            <Select size="large" style={{ width: '100%' }}>
                                <Select.Option value="Card">Card</Select.Option>
                                <Select.Option value="Cash">Cash</Select.Option>
                                <Select.Option value="Savings">Savings</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {/* Card Color */}
                    <Form.Item label={<span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Card Color</span>}>
                        <ColorPicker selected={addColor} onChange={setAddColor} />
                    </Form.Item>

                    {/* Default Account Toggle */}
                    <div
                        onClick={() => setIsDefault(!isDefault)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: isDefault ? 'rgba(245, 158, 11, 0.05)' : '#F9FAFB', borderRadius: '12px', marginBottom: '24px', border: isDefault ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FontAwesomeIcon icon={faStar} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '14px' }}>Set as Default Account</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>New transactions will auto-select this account</div>
                            </div>
                        </div>
                        <Switch
                            checked={isDefault}
                            onChange={(checked, e) => { e.stopPropagation(); setIsDefault(checked); }}
                            style={{ background: isDefault ? '#F59E0B' : undefined }}
                        />
                    </div>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" block size="large">
                            Create Account
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            {/* Edit Account Modal */}
            <Modal
                title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}><FontAwesomeIcon icon={faPen} style={{ color: 'white' }} /><span>Edit Account</span></div>}
                open={!!editingAccount}
                onCancel={() => setEditingAccount(null)}
                footer={null}
                width={480}
                centered
                destroyOnClose
                className="premium-modal"
            >
                <Form form={editForm} layout="vertical" onFinish={handleEdit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item label="Account Name" name="name" rules={[{ required: true }]}>
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item label="Holder Name" name="holderName">
                            <Input size="large" />
                        </Form.Item>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item label={`Balance (${currencySymbol})`} name="balance" rules={[{ required: true }]}>
                            <Input type="number" size="large" />
                        </Form.Item>
                        <Form.Item label="Account Type" name="type">
                            <Select size="large" style={{ width: '100%' }}>
                                <Select.Option value="Card">Card</Select.Option>
                                <Select.Option value="Cash">Cash</Select.Option>
                                <Select.Option value="Savings">Savings</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item label="Card Color">
                        <ColorPicker selected={editColor} onChange={setEditColor} />
                    </Form.Item>

                    {/* Edit Default Account Toggle */}
                    <div
                        onClick={() => setEditIsDefault(!editIsDefault)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: editIsDefault ? 'rgba(245, 158, 11, 0.05)' : '#F9FAFB', borderRadius: '12px', marginBottom: '20px', border: editIsDefault ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FontAwesomeIcon icon={faStar} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '14px' }}>Set as Default Account</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>New transactions will auto-select this account</div>
                            </div>
                        </div>
                        <Switch
                            checked={editIsDefault}
                            onChange={(checked, e) => { e.stopPropagation(); setEditIsDefault(checked); }}
                            style={{ background: editIsDefault ? '#F59E0B' : undefined }}
                        />
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Button size="large" onClick={() => setEditingAccount(null)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" size="large">Save Changes</Button>
                    </div>
                </Form>
            </Modal>
        </motion.div>
    );
}
