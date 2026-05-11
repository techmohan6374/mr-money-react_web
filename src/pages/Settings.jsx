import React, { useEffect, useRef, useState } from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCheck, faCamera, faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Input, Button, Select, Switch, Form, Spin } from 'antd';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

// ── Avatar — handles Google URL, Drive URL, and initials fallback ─────────────
function Avatar({ src, name, size = 80 }) {
    const [failed, setFailed] = useState(false);

    // Reset failed state when src changes (new upload)
    useEffect(() => { setFailed(false); }, [src]);

    const initials = (name || '')
        .trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    if (!src || failed) {
        return (
            <div style={{
                width: size, height: size, borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '700', fontSize: size * 0.3,
                flexShrink: 0, border: '3px solid var(--accent-green)', userSelect: 'none',
            }}>
                {initials || <FontAwesomeIcon icon={faUser} />}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={name}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => setFailed(true)}
            style={{
                width: size, height: size, borderRadius: '50%',
                objectFit: 'cover', flexShrink: 0,
                border: '3px solid var(--accent-green)',
            }}
        />
    );
}

export default function Settings() {
    const { userProfile, updateUserProfile, uploadAvatar, loading } = useData();
    const [form] = Form.useForm();
    const [saving,         setSaving]         = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const fileInputRef = useRef(null);

    // ── Populate form when profile loads ─────────────────────────────────────
    useEffect(() => {
        if (!userProfile) return;
        const parts = (userProfile.name || '').trim().split(' ');
        form.setFieldsValue({
            firstName:          parts[0] || '',
            lastName:           parts.slice(1).join(' ') || '',
            emailNotifications: userProfile.emailNotifications ?? true,
            currency:           userProfile.currency || 'INR',
        });
    }, [userProfile, form]);

    // ── Photo upload — sends file directly to backend → Google Drive ──────────
    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = ''; // allow re-selecting same file

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (JPG, PNG, GIF, WebP).');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be smaller than 2 MB.');
            return;
        }

        setUploadingPhoto(true);
        const toastId = toast.loading('Uploading photo to Google Drive...');
        try {
            await uploadAvatar(file);
            toast.success('Profile photo updated!', { id: toastId });
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || 'Upload failed. Please try again.';
            toast.error(msg, { id: toastId });
        } finally {
            setUploadingPhoto(false);
        }
    };

    // ── Save profile settings ─────────────────────────────────────────────────
    const handleSave = async (values) => {
        setSaving(true);
        try {
            const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
            await updateUserProfile({
                name:               fullName,
                currency:           values.currency,
                emailNotifications: values.emailNotifications,
            });
            toast.success('Settings saved successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // ── Cancel ────────────────────────────────────────────────────────────────
    const handleCancel = () => {
        if (!userProfile) return;
        const parts = (userProfile.name || '').trim().split(' ');
        form.setFieldsValue({
            firstName:          parts[0] || '',
            lastName:           parts.slice(1).join(' ') || '',
            emailNotifications: userProfile.emailNotifications ?? true,
            currency:           userProfile.currency || 'INR',
        });
        toast('Changes discarded.', { icon: '↩️' });
    };

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

            {loading && !userProfile ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* ── Profile Section ───────────────────────────────── */}
                        <div className="premium-card" style={{ padding: '32px' }}>
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', borderBottom: '1px solid var(--nav-border)', paddingBottom: '16px' }}>
                                Profile Information
                            </h3>

                            {/* Avatar + upload */}
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '28px' }}>

                                {/* Clickable avatar */}
                                <div
                                    style={{ position: 'relative', flexShrink: 0, cursor: uploadingPhoto ? 'wait' : 'pointer' }}
                                    onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
                                    title="Click to change photo"
                                >
                                    {uploadingPhoto ? (
                                        <div style={{
                                            width: 80, height: 80, borderRadius: '50%',
                                            background: 'var(--hover-bg)', border: '3px solid var(--accent-green)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--accent-green)', fontSize: 24,
                                        }}>
                                            <FontAwesomeIcon icon={faSpinner} spin />
                                        </div>
                                    ) : (
                                        <Avatar src={userProfile?.picture} name={userProfile?.name} size={80} />
                                    )}

                                    {/* Camera overlay */}
                                    {!uploadingPhoto && (
                                        <div
                                            className="avatar-camera-overlay"
                                            style={{
                                                position: 'absolute', inset: 0, borderRadius: '50%',
                                                background: 'rgba(0,0,0,0.45)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                opacity: 0, transition: 'opacity 0.2s',
                                                color: 'white', fontSize: 20,
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                            onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                        >
                                            <FontAwesomeIcon icon={faCamera} />
                                        </div>
                                    )}
                                </div>

                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />

                                {/* Info + upload button */}
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '2px' }}>
                                        {userProfile?.name || '—'}
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                        {userProfile?.email || '—'}
                                    </div>

                                    <Button
                                        size="small"
                                        loading={uploadingPhoto}
                                        icon={!uploadingPhoto && <FontAwesomeIcon icon={faUpload} style={{ marginRight: 6 }} />}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingPhoto}
                                    >
                                        {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                                    </Button>

                                    <p style={{ margin: '8px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                                        JPG, PNG, GIF or WebP · Max 2 MB · Stored in Google Drive
                                    </p>
                                </div>
                            </div>

                            {/* Name fields */}
                            <div className="responsive-grid-2" style={{ gap: '16px' }}>
                                <Form.Item
                                    label="First Name"
                                    name="firstName"
                                    rules={[{ required: true, message: 'First name is required' }]}
                                >
                                    <Input size="large" placeholder="First name" />
                                </Form.Item>
                                <Form.Item label="Last Name" name="lastName">
                                    <Input size="large" placeholder="Last name" />
                                </Form.Item>
                            </div>

                            <Form.Item label="Email Address">
                                <Input size="large" value={userProfile?.email || ''} disabled style={{ opacity: 0.6 }} />
                            </Form.Item>
                        </div>

                        {/* ── Preferences ───────────────────────────────────── */}
                        <div className="premium-card" style={{ padding: '32px' }}>
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', borderBottom: '1px solid var(--nav-border)', paddingBottom: '16px' }}>
                                Preferences
                            </h3>

                            <div className="responsive-flex-between" style={{ marginBottom: '28px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Email Notifications</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Receive weekly summary reports.</p>
                                </div>
                                <Form.Item name="emailNotifications" valuePropName="checked" style={{ margin: 0 }}>
                                    <Switch />
                                </Form.Item>
                            </div>

                            <div className="responsive-flex-between">
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Default Currency</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Select your primary currency.</p>
                                </div>
                                <Form.Item name="currency" style={{ margin: 0 }}>
                                    <Select size="large" style={{ width: '150px' }}>
                                        <Select.Option value="INR">INR (₹)</Select.Option>
                                        <Select.Option value="USD">USD ($)</Select.Option>
                                        <Select.Option value="EUR">EUR (€)</Select.Option>
                                        <Select.Option value="GBP">GBP (£)</Select.Option>
                                        <Select.Option value="JPY">JPY (¥)</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>

                        {/* ── Account Info ──────────────────────────────────── */}
                        <div className="premium-card" style={{ padding: '32px' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', borderBottom: '1px solid var(--nav-border)', paddingBottom: '16px' }}>
                                Account Info
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Since</div>
                                    <div style={{ fontWeight: '600', fontSize: '15px' }}>
                                        {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                                    </div>
                                </div>
                                <div style={{ padding: '16px', background: 'var(--hover-bg)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Login</div>
                                    <div style={{ fontWeight: '600', fontSize: '15px' }}>
                                        {userProfile?.lastLoginAt ? new Date(userProfile.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Action Buttons ────────────────────────────────── */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <Button size="large" onClick={handleCancel} disabled={saving}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={saving}
                                icon={!saving && <FontAwesomeIcon icon={faCheck} />}
                                style={{ background: 'var(--accent-green)', borderColor: 'var(--accent-green)', minWidth: '140px' }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>

                    </div>
                </Form>
            )}
        </motion.div>
    );
}
