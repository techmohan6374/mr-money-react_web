import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

export function DataProvider({ children }) {

    // ── State Initialization (empty defaults, always from localStorage) ──
    const [accounts, setAccounts] = useState(() => {
        try {
            const stored = localStorage.getItem('mrMoney_accounts');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    const [transactions, setTransactions] = useState(() => {
        try {
            const stored = localStorage.getItem('mrMoney_transactions');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    const [categories, setCategories] = useState(() => {
        try {
            const stored = localStorage.getItem('mrMoney_categories');
            return stored ? JSON.parse(stored) : [
                { name: 'Food', icon: 'faMugHot', color: '#F97316', type: 'expense' },
                { name: 'Shopping', icon: 'faShoppingCart', color: '#A855F7', type: 'expense' },
                { name: 'Travel', icon: 'faTicket', color: '#EC4899', type: 'expense' },
                { name: 'Bills', icon: 'faReceipt', color: '#EF4444', type: 'expense' },
                { name: 'Salary', icon: 'faBriefcase', color: '#10B981', type: 'income' },
                { name: 'Invest', icon: 'faChartLine', color: '#3B82F6', type: 'income' },
                { name: 'Others', icon: 'faPlus', color: '#6B7280', type: 'all' }
            ];
        } catch { return []; }
    });

    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    // ── Theme sync ──
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeMode);
        localStorage.setItem('theme', themeMode);
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // ── Persist to localStorage on every change ──
    useEffect(() => {
        localStorage.setItem('mrMoney_accounts', JSON.stringify(accounts));
    }, [accounts]);

    useEffect(() => {
        localStorage.setItem('mrMoney_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('mrMoney_categories', JSON.stringify(categories));
    }, [categories]);

    // ── Data Modification Methods ──
    const addTransaction = (newTx) => {
        const amount = parseFloat(newTx.amount) || 0;
        const tx = {
            ...newTx,
            amount,
            id: Date.now(),
            date: new Date().toISOString(),
            status: 'Completed',
        };
        setTransactions(prev => [tx, ...prev]);

        // Update linked account balance
        if (tx.accountId) {
            setAccounts(prev => prev.map(acc => {
                if (acc.id === parseInt(tx.accountId)) {
                    const newBalance = tx.type === 'income'
                        ? acc.balance + amount
                        : acc.balance - amount;
                    return { ...acc, balance: newBalance };
                }
                return acc;
            }));
        }
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const addCategory = (newCat) => {
        setCategories(prev => [...prev, { ...newCat, id: Date.now() }]);
    };

    const editTransaction = (id, updates) => {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const addAccount = (newAcc) => {
        const acc = {
            ...newAcc,
            id: Date.now(),
            balance: parseFloat(newAcc.balance) || 0,
        };
        setAccounts(prev => [...prev, acc]);
    };

    const deleteAccount = (id) => {
        setAccounts(prev => prev.filter(a => a.id !== id));
    };

    const editAccount = (id, updates) => {
        setAccounts(prev => prev.map(a =>
            a.id === id
                ? { ...a, ...updates, balance: parseFloat(updates.balance) ?? a.balance }
                : a
        ));
    };

    const transferFunds = (fromId, toId, amount) => {
        const transferAmount = parseFloat(amount);
        if (!transferAmount || transferAmount <= 0) return;

        setAccounts(prev => prev.map(acc => {
            if (acc.id === parseInt(fromId)) return { ...acc, balance: acc.balance - transferAmount };
            if (acc.id === parseInt(toId))   return { ...acc, balance: acc.balance + transferAmount };
            return acc;
        }));

        const date = new Date().toISOString();
        setTransactions(prev => [
            { id: Date.now(),     name: 'Transfer Out', category: 'Transfer', amount: transferAmount, type: 'expense', date, status: 'Completed', accountId: fromId },
            { id: Date.now() + 1, name: 'Transfer In',  category: 'Transfer', amount: transferAmount, type: 'income',  date, status: 'Completed', accountId: toId },
            ...prev,
        ]);
    };

    // ── Formatters ──
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // ── Dynamic Derived Data ──
    const totalIncome  = useMemo(() => transactions.filter(t => t.type === 'income') .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0), [transactions]);
    const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0), [transactions]);
    const netBalance   = useMemo(() => accounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0), [accounts]);

    // Today's transaction count
    const todayTxCount = useMemo(() => {
        const today = new Date().toDateString();
        return transactions.filter(t => new Date(t.date).toDateString() === today).length;
    }, [transactions]);

    // Average daily spend (last 30 days)
    const avgDailySpend = useMemo(() => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const recent = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= cutoff);
        const total = recent.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        return total / 30;
    }, [transactions]);

    // Top spending category
    const topCategory = useMemo(() => {
        const catMap = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            catMap[t.category] = (catMap[t.category] || 0) + (parseFloat(t.amount) || 0);
        });
        const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? sorted[0][0] : '—';
    }, [transactions]);

    // Largest single expense
    const largestExpense = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        if (expenses.length === 0) return null;
        return expenses.reduce((max, t) => (parseFloat(t.amount) > parseFloat(max.amount) ? t : max), expenses[0]);
    }, [transactions]);

    // Category breakdown for reports (dynamic)
    const categoryBreakdown = useMemo(() => {
        const catMap = {};
        const totalExp = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
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

    // Weekly chart data (last 7 days)
    const weeklyChartData = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = d.toDateString();
            const income  = transactions.filter(t => t.type === 'income'  && new Date(t.date).toDateString() === dateStr).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
            const expense = transactions.filter(t => t.type === 'expense' && new Date(t.date).toDateString() === dateStr).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
            days.push({ name: label, income, expense });
        }
        return days;
    }, [transactions]);

    const value = {
        accounts,
        transactions,
        addTransaction,
        deleteTransaction,
        addAccount,
        deleteAccount,
        editAccount,
        transferFunds,
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
        categories,
        addCategory,
        editTransaction
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}
