import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

export function DataProvider({ children }) {
    // Initial State definition
    const defaultAccounts = [
        { id: 1, name: "Main Checking", type: "Bank Account", balance: 45250.00, color: "linear-gradient(135deg, #3B82F6, #2563EB)", number: "**** 4521" },
        { id: 2, name: "Savings", type: "Bank Account", balance: 125000.00, color: "linear-gradient(135deg, #10B981, #059669)", number: "**** 8832" },
        { id: 3, name: "Credit Card", type: "Credit", balance: -12400.00, color: "linear-gradient(135deg, #8B5CF6, #6D28D9)", number: "**** 1198" },
        { id: 4, name: "Digital Wallet", type: "Wallet", balance: 2500.00, color: "linear-gradient(135deg, #F59E0B, #D97706)", number: "pay@upi" },
    ];

    const defaultTransactions = [
        { id: 1, name: "Netflix Subscription", category: "Entertainment", amount: 849, type: "expense", date: new Date().toISOString(), status: "Completed" },
        { id: 2, name: "Salary Deposit", category: "Income", amount: 85000, type: "income", date: new Date(Date.now() - 86400000).toISOString(), status: "Completed" },
        { id: 3, name: "Starbucks Coffee", category: "Food & Dining", amount: 350, type: "expense", date: new Date(Date.now() - 86400000).toISOString(), status: "Completed" },
        { id: 4, name: "Grocery Store", category: "Shopping", amount: 4200, type: "expense", date: new Date(Date.now() - 3 * 86400000).toISOString(), status: "Completed" },
    ];

    // State Initialization
    const [accounts, setAccounts] = useState(() => {
        const stored = localStorage.getItem('mrMoney_accounts');
        return stored ? JSON.parse(stored) : defaultAccounts;
    });

    const [transactions, setTransactions] = useState(() => {
        const stored = localStorage.getItem('mrMoney_transactions');
        return stored ? JSON.parse(stored) : defaultTransactions;
    });

    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeMode);
        localStorage.setItem('theme', themeMode);
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
    };



    // Sync to LocalStorage
    useEffect(() => {
        localStorage.setItem('mrMoney_accounts', JSON.stringify(accounts));
    }, [accounts]);

    useEffect(() => {
        localStorage.setItem('mrMoney_transactions', JSON.stringify(transactions));
    }, [transactions]);

    // Data Modification Methods
    const addTransaction = (newTx) => {
        const tx = {
            ...newTx,
            id: Date.now(),
            date: new Date().toISOString(),
            status: "Completed",
        };
        setTransactions(prev => [tx, ...prev]);

        // Automatically update account balance if an account is linked (Optional enhancement)
        if (tx.accountId) {
            setAccounts(prev => prev.map(acc => {
                if (acc.id === parseInt(tx.accountId)) {
                    const newBalance = tx.type === 'income' 
                        ? acc.balance + parseFloat(tx.amount) 
                        : acc.balance - parseFloat(tx.amount);
                    return { ...acc, balance: newBalance };
                }
                return acc;
            }));
        }
    };

    const addAccount = (newAcc) => {
        const acc = {
            ...newAcc,
            id: Date.now(),
            balance: parseFloat(newAcc.balance) || 0
        };
        setAccounts(prev => [...prev, acc]);
    };

    const transferFunds = (fromId, toId, amount) => {
        const transferAmount = parseFloat(amount);
        if (!transferAmount || transferAmount <= 0) return;

        setAccounts(prev => prev.map(acc => {
            if (acc.id === parseInt(fromId)) return { ...acc, balance: acc.balance - transferAmount };
            if (acc.id === parseInt(toId)) return { ...acc, balance: acc.balance + transferAmount };
            return acc;
        }));

        // Log the transfer as transactions
        const date = new Date().toISOString();
        const expenseTx = {
            id: Date.now(), name: "Transfer Out", category: "Transfer", amount: transferAmount, type: "expense", date, status: "Completed", accountId: fromId
        };
        const incomeTx = {
            id: Date.now() + 1, name: "Transfer In", category: "Transfer", amount: transferAmount, type: "income", date, status: "Completed", accountId: toId
        };
        setTransactions(prev => [expenseTx, incomeTx, ...prev]);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Derived Data for Dashboard
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = accounts.reduce((sum, a) => sum + a.balance, 0); // Or totalIncome - totalExpense

    const value = {
        accounts,
        transactions,
        addTransaction,
        addAccount,
        transferFunds,
        formatCurrency,
        formatDate,
        totalIncome,
        totalExpense,
        netBalance,
        themeMode,
        toggleTheme
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}
