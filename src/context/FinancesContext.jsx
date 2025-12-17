import React, { createContext, useState, useContext } from 'react';

const FinancesContext = createContext();

export const FinancesProvider = ({ children }) => {
    const [balance, setBalance] = useState(2450.00);
    const [savings, setSavings] = useState(1200.00);
    const [monthlyAllowance, setMonthlyAllowance] = useState(3000);

    const [transactions, setTransactions] = useState([
        { id: 1, title: 'Monthly Allowance', date: '2025-10-01', amount: 3000, type: 'income' },
        { id: 2, title: 'Textbooks', date: '2025-10-03', amount: -150, type: 'expense' },
        { id: 3, title: 'Coffee Shop', date: '2025-10-04', amount: -12.50, type: 'expense' },
        { id: 4, title: 'Freelance Gig', date: '2025-10-05', amount: 200, type: 'income' },
        { id: 5, title: 'Grocery Run', date: '2025-10-06', amount: -65.20, type: 'expense' },
    ]);

    const addTransaction = (transaction) => {
        const newTransaction = { ...transaction, id: Date.now() };
        setTransactions([newTransaction, ...transactions]);
        if (transaction.type === 'income') {
            setBalance(curr => curr + Number(transaction.amount));
        } else {
            setBalance(curr => curr - Number(transaction.amount));
        }
    };

    return (
        <FinancesContext.Provider value={{
            balance,
            savings,
            monthlyAllowance,
            transactions,
            addTransaction
        }}>
            {children}
        </FinancesContext.Provider>
    );
};

export const useFinances = () => useContext(FinancesContext);
