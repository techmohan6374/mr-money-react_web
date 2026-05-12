import React from 'react';
import './Dashboard.css';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion';
import { Input, Select, Table, Tag, Empty, Modal, Form, Popconfirm, DatePicker, Button, message, Segmented } from 'antd';
import { useState } from 'react';
import { faMugHot, faShoppingCart, faTicket, faDollarSign, faReceipt, faBolt, faBriefcase, faChartLine, faHamburger, faGift, faHome, faUserCircle, faHeartbeat, faEdit, faTrash, faArrowTrendUp, faArrowTrendDown, faExchangeAlt, faCheck, faSearch, faCalendarDays, faFileExport } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

const typeFilters = [
    { key: 'All', label: 'All' },
    { key: 'Income', label: 'Income' },
    { key: 'Expense', label: 'Expense' },
    { key: 'Transfer', label: 'Transfer' },
];

export default function Transactions() {
    const { transactions, formatCurrency, accounts, categories, editTransaction, deleteTransaction, currencySymbol } = useData();
    const [filterType, setFilterType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [accountFilter, setAccountFilter] = useState('All');
    const [dateRange, setDateRange] = useState(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [form] = Form.useForm();
    const txType = Form.useWatch('type', form);

    const iconMap = {
        faMugHot, faShoppingCart, faTicket, faReceipt, faBolt, faBriefcase, faChartLine, faHamburger, faGift, faHome, faUserCircle, faHeartbeat, faDollarSign
    };

    const getIconForCategory = (categoryName) => {
        const cat = categories.find(c => c.name.toLowerCase() === categoryName?.toLowerCase());
        if (cat && iconMap[cat.icon]) {
            return <FontAwesomeIcon icon={iconMap[cat.icon]} style={{ color: cat.color }} />;
        }
        return <FontAwesomeIcon icon={faReceipt} />;
    }
    const formatDateTime = (isoString) => {
        if (!isoString) return '-';

        return dayjs(isoString)
            .format('MMM D, YYYY hh:mm A');
    }
    const handleEdit = (record) => {
        setEditingTransaction(record);
        form.setFieldsValue({
            ...record,
            date: record.date ? dayjs(record.date) : dayjs()
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values) => {
        editTransaction(editingTransaction.id, {
            ...values,
            date: values.date.toISOString()
        });
        setIsEditModalOpen(false);
        message.success('Transaction updated successfully');
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesType = filterType === 'All' || tx.type?.toLowerCase() === filterType.toLowerCase();
        const matchesSearch = tx.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAccount = accountFilter === 'All' || tx.account === accountFilter;

        let matchesDate = true;
        if (dateRange && dateRange[0] && dateRange[1]) {
            const txDate = dayjs(tx.date);
            matchesDate = txDate.isAfter(dateRange[0].startOf('day')) &&
                txDate.isBefore(dateRange[1].endOf('day'));
        }

        return matchesType && matchesSearch && matchesAccount && matchesDate;
    });

    const handleDownloadExcel = () => {
        if (filteredTransactions.length === 0) {
            message.warning('No data to export');
            return;
        }

        const dataToExport = filteredTransactions.map(tx => ({
            'Date': dayjs(tx.date).format('YYYY-MM-DD HH:mm'),
            'Category': tx.category,
            'Description': tx.name,
            'Type': tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
            'Account': tx.account,
            'Amount': tx.amount,
            'Notes': tx.description || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

        const maxWidths = Object.keys(dataToExport[0]).map(key => ({
            wch: Math.max(key.length, ...dataToExport.map(row => row[key]?.toString().length || 0)) + 2
        }));
        worksheet['!cols'] = maxWidths;

        XLSX.writeFile(workbook, `MrMoney_Transactions_${dayjs().format('YYYY-MM-DD')}.xlsx`);
        message.success('Report downloaded successfully');
    };

    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Transactions</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                        Showing {filteredTransactions.length} of {transactions.length} records
                    </p>
                </div>
                <button className="tx-export-btn" onClick={handleDownloadExcel}>
                    <FontAwesomeIcon icon={faFileExport} />
                    <span>Export</span>
                </button>
            </div>

            <div className="tx-tabs">
                {typeFilters.map(tab => (
                    <button
                        key={tab.key}
                        className={`tx-tab ${filterType === tab.key ? 'active' : ''}`}
                        onClick={() => setFilterType(tab.key)}
                    >
                        {tab.label}
                        {filterType === tab.key && <span className="tx-tab-count">{filteredTransactions.length}</span>}
                    </button>
                ))}
            </div>

            <div className="tx-filter-bar">
                <div className="tx-search-box">
                    <FontAwesomeIcon icon={faSearch} className="tx-search-icon" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="tx-search-input"
                    />
                </div>
                <div className="tx-filter-controls">
                    <Select
                        value={accountFilter}
                        onChange={setAccountFilter}
                        className="tx-filter-select"
                        variant="borderless"
                        popupMatchSelectWidth={180}
                    >
                        <Select.Option value="All">All Accounts</Select.Option>
                        {accounts?.map(acc => (
                            <Select.Option key={acc.id} value={acc.name}>{acc.name}</Select.Option>
                        ))}
                    </Select>
                    <div className="tx-filter-divider" />
                    <RangePicker
                        className="tx-filter-datepicker"
                        variant="borderless"
                        onChange={setDateRange}
                        placeholder={['From', 'To']}
                        separator="→"
                    />
                </div>
            </div>

            <div className="tx-table-wrap">
                <Table
                    dataSource={filteredTransactions}
                    columns={[
                        {
                            title: 'Category',
                            dataIndex: 'category',
                            key: 'category',
                            sorter: (a, b) => a.category.localeCompare(b.category),
                            render: (cat) => (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontSize: '14px' }}>
                                        {getIconForCategory(cat)}
                                    </div>
                                    <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{cat}</span>
                                </div>
                            )
                        },
                        {
                            title: 'Type',
                            dataIndex: 'type',
                            key: 'type',
                            width: 120,
                            render: (type) => {
                                let color = 'default';
                                let icon = null;
                                if (type === 'income') { color = 'success'; icon = faArrowTrendUp; }
                                else if (type === 'expense') { color = 'error'; icon = faArrowTrendDown; }
                                else if (type === 'transfer') { color = 'processing'; icon = faExchangeAlt; }

                                return (
                                    <Tag
                                        color={color}
                                        style={{
                                            borderRadius: '6px',
                                            textTransform: 'capitalize',
                                            fontWeight: '600',
                                            padding: '4px 12px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            border: 'none'
                                        }}
                                    >
                                        {icon && <FontAwesomeIcon icon={icon} />}
                                        <span>{type}</span>
                                    </Tag>
                                );
                            }
                        },
                        {
                            title: 'Description',
                            dataIndex: 'name',
                            key: 'name',
                            sorter: (a, b) => a.name.localeCompare(b.name),
                            render: (text) => <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{text}</span>
                        },
                        {
                            title: 'Date & Time',
                            dataIndex: 'date',
                            key: 'date',
                            sorter: (a, b) => new Date(a.date) - new Date(b.date),
                            render: (date) => <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{formatDateTime(date)}</span>
                        },
                        {
                            title: 'Amount',
                            dataIndex: 'amount',
                            key: 'amount',
                            align: 'right',
                            sorter: (a, b) => a.amount - b.amount,
                            render: (amount, record) => (
                                <span style={{
                                    fontWeight: '700',
                                    fontSize: '15px',
                                    color: record.type === 'income' ? 'var(--accent-green)' :
                                        record.type === 'transfer' ? 'var(--accent-blue)' : 'var(--text-primary)'
                                }}>
                                    {record.type === 'income' ? '+' : record.type === 'transfer' ? '' : '-'} {formatCurrency(amount)}
                                </span>
                            )
                        },
                        {
                            title: 'Actions',
                            key: 'actions',
                            align: 'center',
                            width: 100,
                            render: (_, record) => (
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    <Button
                                        type="text"
                                        icon={<FontAwesomeIcon icon={faEdit} style={{ color: 'var(--accent-green)' }} />}
                                        onClick={() => handleEdit(record)}
                                    />
                                    <Popconfirm
                                        title="Delete Transaction"
                                        description="Are you sure you want to delete this transaction?"
                                        onConfirm={() => {
                                            deleteTransaction(record.id);
                                            message.success('Transaction deleted');
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                        okButtonProps={{ danger: true }}
                                    >
                                        <Button
                                            type="text"
                                            danger
                                            icon={<FontAwesomeIcon icon={faTrash} />}
                                        />
                                    </Popconfirm>
                                </div>
                            )
                        }
                    ]}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        position: ['bottomCenter'],
                        className: "premium-pagination"
                    }}
                    rowKey="id"
                    locale={{ emptyText: <Empty description="No transactions found" /> }}
                    className="premium-table"
                />
            </div>

            {/* Edit Transaction Modal */}
            <Modal
                title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}><FontAwesomeIcon icon={faReceipt} style={{ color: 'white' }} /><span>Edit Transaction</span></div>}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width={500}
                centered
                className="premium-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                    style={{ marginTop: '16px' }}
                >
                    <div style={{ marginBottom: '20px' }}>
                        <Form.Item name="type" style={{ marginBottom: 0 }}>
                            <Segmented
                                block
                                size="large"
                                className="transaction-type-segmented"
                                options={[
                                    { label: 'Expense', value: 'expense', icon: <FontAwesomeIcon icon={faArrowTrendDown} style={{ color: '#EF4444' }} /> },
                                    { label: 'Income', value: 'income', icon: <FontAwesomeIcon icon={faArrowTrendUp} style={{ color: '#10B981' }} /> },
                                    { label: 'Transfer', value: 'transfer', icon: <FontAwesomeIcon icon={faExchangeAlt} style={{ color: '#3B82F6' }} /> }
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 2 }}>
                            <Form.Item label="Transaction Name" name="name" rules={[{ required: true }]}>
                                <Input size="large" style={{ borderRadius: '10px' }} />
                            </Form.Item>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
                                <Input type="number" prefix={currencySymbol} size="large" style={{ borderRadius: '10px' }} />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={2} style={{ borderRadius: '10px' }} />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <Form.Item label="Date & Time" name="date">
                                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%', borderRadius: '10px' }} size="large" />
                            </Form.Item>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Form.Item label="Account" name="accountId">
                                <Select size="large" style={{ width: '100%', borderRadius: '10px' }}>
                                    {accounts?.map(acc => <Select.Option key={acc.id} value={acc.id}>{acc.name}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item label="Category" name="category" className="category-item-custom">
                        <div className="category-chip-grid">
                            {categories.filter(cat => cat.type === txType || cat.type === 'all').map(cat => (
                                <div
                                    key={cat.name}
                                    className={`category-chip ${form.getFieldValue('category') === cat.name ? 'active' : ''}`}
                                    onClick={() => {
                                        form.setFieldsValue({ category: cat.name });
                                        setIsEditModalOpen(prev => prev);
                                        setTimeout(() => setIsEditModalOpen(true), 0);
                                    }}
                                >
                                    <span>{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                        <Button type="primary" htmlType="submit" block size="large" icon={<FontAwesomeIcon icon={faCheck} />} style={{ height: '52px', borderRadius: '12px', fontWeight: '700', fontSize: '16px', background: 'var(--accent-green)', borderColor: 'var(--accent-green)' }}>
                            Update Transaction
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </motion.div>
    );
}
