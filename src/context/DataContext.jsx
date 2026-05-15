import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api';

const DataContext = createContext();

/** Compare account ids from API / forms (Guid string vs number). */
function normalizeAccountId(id) {
    if (id == null || id === '') return '';
    return String(id);
}

function pickFirst(tx, ...keys) {
    for (const k of keys) {
        const v = tx[k];
        if (v != null && v !== '') return v;
    }
    return null;
}

function findAccount(accs, accountId) {
    const n = normalizeAccountId(accountId);
    if (!n) return undefined;
    return accs.find(a => normalizeAccountId(a.id) === n);
}

function enrichTransactions(accs, rawTxs) {
    return rawTxs.map(t => {
        const type = (t.type || '').toString().toLowerCase();
        let accountLabel = 'Unknown';
        if (type === 'transfer') {
            const from = pickFirst(t, 'fromAccountId', 'FromAccountId', 'fromAccountID');
            const to = pickFirst(t, 'toAccountId', 'ToAccountId', 'toAccountID');
            if (from != null && to != null) {
                const fa = findAccount(accs, from);
                const ta = findAccount(accs, to);
                accountLabel = `${fa?.name || '?'} → ${ta?.name || '?'}`;
            } else {
                accountLabel = findAccount(accs, t.accountId)?.name || 'Unknown';
            }
        } else {
            accountLabel = findAccount(accs, t.accountId)?.name || 'Unknown';
        }
        return { ...t, account: accountLabel };
    });
}

export function useData() {
    return useContext(DataContext);
}

// Currency symbol lookup — defined outside component so it never re-creates
const CURRENCY_SYMBOLS = { INR: '\u20B9', USD: '$', EUR: '\u20AC', GBP: '\u00A3', JPY: '\u00A5' };
const CURRENCY_LOCALE = { INR: 'en-IN' };

export function DataProvider({ children }) {

    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userProfile, setUserProfile] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [themeMode, setThemeMode] = useState(() => localStorage.getItem('theme') || 'light');

    // ── Theme sync ────────────────────────────────────────────────────────────
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeMode);
        localStorage.setItem('theme', themeMode);
    }, [themeMode]);

    const toggleTheme = () => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');

    // ── Load all data from API ────────────────────────────────────────────────
    const loadAllData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        setError(null);
        try {
            const [accRes, txRes, catRes, profileRes] = await Promise.all([
                api.get('/accounts'),
                api.get('/transactions?pageSize=500'),
                api.get('/categories'),
                api.get('/Users/me'),
            ]);
            const accs = accRes.data ?? [];
            const rawTxs = txRes.data.items ?? txRes.data ?? [];
            const enrichedTxs = enrichTransactions(accs, rawTxs);

            setAccounts(accs);
            setTransactions(enrichedTxs);
            setCategories(catRes.data ?? []);
            setUserProfile(profileRes.data);
            localStorage.setItem('user', JSON.stringify(profileRes.data));
        } catch (err) {
            console.error('Failed to load data:', err);
            setError(err?.response?.data?.message || 'Failed to load data from server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // ── Accounts ──────────────────────────────────────────────────────────────

    const addAccount = async (newAcc) => {
        const res = await api.post('/accounts', {
            name: newAcc.name,
            holderName: newAcc.holderName,
            balance: parseFloat(newAcc.balance) || 0,
            type: newAcc.type,
            color: newAcc.color,
            isDefault: newAcc.isDefault ?? false,
        });
        setAccounts(prev => [res.data, ...prev]);
        return res.data;
    };

    const editAccount = async (id, updates) => {
        const idStr = normalizeAccountId(id);
        const balRaw = updates.balance;
        let balancePayload = undefined;
        if (balRaw !== undefined && balRaw !== null && balRaw !== '') {
            const n = parseFloat(balRaw);
            if (Number.isFinite(n)) balancePayload = n;
        }
        const res = await api.put(`/accounts/${encodeURIComponent(idStr)}`, {
            name: updates.name,
            holderName: updates.holderName,
            balance: balancePayload,
            type: updates.type,
            color: updates.color,
            isDefault: updates.isDefault,
        });
        const updated = res.data;
        setAccounts(prev =>
            prev.map(a => {
                if (normalizeAccountId(a.id) !== idStr) return a;
                const merged = { ...a, ...(updated || {}) };
                if (balancePayload !== undefined && (updated == null || updated.balance === undefined)) {
                    merged.balance = balancePayload;
                }
                return merged;
            })
        );
        return updated;
    };

    const deleteAccount = async (id) => {
        const idStr = normalizeAccountId(id);
        await api.delete(`/accounts/${encodeURIComponent(idStr)}`);
        setAccounts(prev => prev.filter(a => normalizeAccountId(a.id) !== idStr));
    };

    // ── Transactions ──────────────────────────────────────────────────────────

    const addTransaction = async (newTx) => {
        setLoading(true);
        try {
            let accountId = newTx.accountId;
            if (accountId == null || accountId === '') {
                const def = accounts.find(a => a.isDefault);
                accountId = def?.id;
            }
            const res = await api.post('/transactions', {
                name: newTx.name,
                category: newTx.category,
                amount: parseFloat(newTx.amount),
                type: newTx.type,
                accountId: accountId != null ? String(accountId) : undefined,
                description: newTx.description || '',
                date: newTx.date || new Date().toISOString(),
            });
            // Refresh accounts and transactions to get enriched data
            const [accRes, txRes] = await Promise.all([
                api.get('/accounts'),
                api.get('/transactions?pageSize=500'),
            ]);

            const accs = accRes.data ?? [];
            const rawTxs = txRes.data.items ?? txRes.data ?? [];
            const enrichedTxs = enrichTransactions(accs, rawTxs);

            setAccounts(accs);
            setTransactions(enrichedTxs);
            return res.data;
        } finally {
            setLoading(false);
        }
    };

    const editTransaction = async (id, updates) => {
        setLoading(true);
        try {
            const prevTx = transactions.find(t => normalizeAccountId(t.id) === normalizeAccountId(id));
            const mergedForPayload = prevTx
                ? {
                    ...prevTx,
                    ...updates,
                    amount: updates.amount !== undefined ? updates.amount : prevTx.amount,
                    accountId: updates.accountId ?? prevTx.accountId,
                    type: updates.type ?? prevTx.type,
                    name: updates.name ?? prevTx.name,
                    category: updates.category ?? prevTx.category,
                    description: updates.description !== undefined ? updates.description : prevTx.description,
                    date: updates.date ?? prevTx.date,
                    fromAccountId: updates.fromAccountId ?? pickFirst(prevTx, 'fromAccountId', 'FromAccountId'),
                    toAccountId: updates.toAccountId ?? pickFirst(prevTx, 'toAccountId', 'ToAccountId'),
                }
                : updates;

            const payload = {
                name: mergedForPayload.name,
                category: mergedForPayload.category,
                amount: parseFloat(mergedForPayload.amount),
                type: mergedForPayload.type,
                accountId: mergedForPayload.accountId != null ? String(mergedForPayload.accountId) : undefined,
                description: mergedForPayload.description ?? '',
                date: mergedForPayload.date,
            };
            const fromId = pickFirst(mergedForPayload, 'fromAccountId', 'FromAccountId');
            const toId = pickFirst(mergedForPayload, 'toAccountId', 'ToAccountId');
            if (fromId != null) payload.fromAccountId = String(fromId);
            if (toId != null) payload.toAccountId = String(toId);

            const res = await api.put(`/transactions/${id}`, payload);

            const [accRes, txRes] = await Promise.all([
                api.get('/accounts'),
                api.get('/transactions?pageSize=500'),
            ]);

            const accs = accRes.data ?? [];
            const rawTxs = txRes.data.items ?? txRes.data ?? [];
            const enrichedTxs = enrichTransactions(accs, rawTxs);

            setAccounts(accs);
            setTransactions(enrichedTxs);
            return res.data;
        } finally {
            setLoading(false);
        }
    };

    const deleteTransaction = async (id) => {
        setLoading(true);
        try {
            await api.delete(`/transactions/${id}`);
            const [accRes, txRes] = await Promise.all([
                api.get('/accounts'),
                api.get('/transactions?pageSize=500'),
            ]);

            const accs = accRes.data ?? [];
            const rawTxs = txRes.data.items ?? txRes.data ?? [];

            const enrichedTxs = enrichTransactions(accs, rawTxs);

            setAccounts(accs);
            setTransactions(enrichedTxs);
        } finally {
            setLoading(false);
        }
    };

    const transferFunds = async (fromId, toId, amount, date) => {
        setLoading(true);
        try {
            const res = await api.post('/transactions/transfer', {
                fromAccountId: fromId?.toString(),
                toAccountId: toId?.toString(),
                amount: parseFloat(amount),
                date: date
            });
            const [accRes, txRes] = await Promise.all([
                api.get('/accounts'),
                api.get('/transactions?pageSize=500'),
            ]);
            const accs = accRes.data ?? [];
            const rawTxs = txRes.data.items ?? txRes.data ?? [];
            const enrichedTxs = enrichTransactions(accs, rawTxs);

            setAccounts(accs);
            setTransactions(enrichedTxs);
            return res.data;
        } finally {
            setLoading(false);
        }
    };

    // ── Categories ────────────────────────────────────────────────────────────

    const addCategory = async (newCat) => {
        const res = await api.post('/categories', {
            name: newCat.name,
            icon: newCat.icon,
            color: newCat.color,
            type: newCat.type,
        });
        setCategories(prev => [...prev, res.data]);
        return res.data;
    };

    // ── User Profile ──────────────────────────────────────────────────────────

    const updateUserProfile = async (updates) => {
        const payload = {
            name: updates.name,
            currency: updates.currency,
            emailNotifications: updates.emailNotifications,
            theme: updates.theme,
        };
        // Only include picture if it's a URL (not base64 — that goes via uploadAvatar)
        if (updates.picture && updates.picture.startsWith('http')) {
            payload.picture = updates.picture;
        }

        const res = await api.put('/Users/me', payload);
        setUserProfile(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
    };

    // Upload avatar file → Resizes to 128x128 → returns updated profile
    const uploadAvatar = async (file) => {
        // 1. Resize image client-side to ensure it fits in Google Sheet cell limits
        const resizedBlob = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const size = 128; // Standard avatar size
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    // Draw centered square crop
                    const min = Math.min(img.width, img.height);
                    ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, size, size);
                    canvas.toBlob(resolve, 'image/jpeg', 0.8); // High quality JPEG
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });

        const formData = new FormData();
        formData.append('file', resizedBlob, 'avatar.jpg');

        const res = await api.post('/Users/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Refresh full profile
        const profileRes = await api.get('/Users/me');
        setUserProfile(profileRes.data);
        localStorage.setItem('user', JSON.stringify(profileRes.data));
        return res.data.pictureUrl;
    };

    // ── Formatters ────────────────────────────────────────────────────────────

    const currency = userProfile?.currency || 'INR';
    const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
    const currencyLocale = CURRENCY_LOCALE[currency] || 'en-US';

    const formatCurrency = useCallback((amount) =>
        new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount || 0),
        [currency, currencyLocale]);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // ── Derived values ────────────────────────────────────────────────────────

    const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0), [transactions]);
    const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0), [transactions]);
    const netBalance = useMemo(() => accounts.reduce((s, a) => s + (parseFloat(a.balance) || 0), 0), [accounts]);

    const todayTxCount = useMemo(() => {
        const today = new Date().toDateString();
        return transactions.filter(t => new Date(t.date).toDateString() === today).length;
    }, [transactions]);

    const avgDailySpend = useMemo(() => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const total = transactions
            .filter(t => t.type === 'expense' && new Date(t.date) >= cutoff)
            .reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
        return total / 30;
    }, [transactions]);

    const topCategory = useMemo(() => {
        const catMap = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            catMap[t.category] = (catMap[t.category] || 0) + (parseFloat(t.amount) || 0);
        });
        const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? sorted[0][0] : '\u2014';
    }, [transactions]);

    const largestExpense = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        if (!expenses.length) return null;
        return expenses.reduce((max, t) => parseFloat(t.amount) > parseFloat(max.amount) ? t : max, expenses[0]);
    }, [transactions]);

    const categoryBreakdown = useMemo(() => {
        const catMap = {};
        const totalExp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
        transactions.filter(t => t.type === 'expense').forEach(t => {
            catMap[t.category] = (catMap[t.category] || 0) + (parseFloat(t.amount) || 0);
        });
        const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#6B7280', '#EC4899', '#14B8A6'];
        return Object.entries(catMap)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount], i) => ({
                cat,
                amount,
                pct: totalExp > 0 ? `${Math.round((amount / totalExp) * 100)}%` : '0%',
                color: COLORS[i % COLORS.length],
            }));
    }, [transactions]);

    const weeklyChartData = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = d.toDateString();
            const income = transactions.filter(t => t.type === 'income' && new Date(t.date).toDateString() === dateStr).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
            const expense = transactions.filter(t => t.type === 'expense' && new Date(t.date).toDateString() === dateStr).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
            days.push({ name: label, income, expense });
        }
        return days;
    }, [transactions]);

    // ── Context value ─────────────────────────────────────────────────────────

    const value = {
        accounts,
        transactions,
        categories,
        userProfile,
        currency,
        currencySymbol,
        loading,
        error,
        loadAllData,
        addTransaction,
        deleteTransaction,
        editTransaction,
        addAccount,
        deleteAccount,
        editAccount,
        transferFunds,
        addCategory,
        updateUserProfile,
        uploadAvatar,
        formatCurrency,
        formatDate,
        totalIncome,
        totalExpense,
        netBalance,
        todayTxCount,
        avgDailySpend,
        topCategory,
        largestExpense,
        categoryBreakdown,
        weeklyChartData,
        themeMode,
        toggleTheme,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}
