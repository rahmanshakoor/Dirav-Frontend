import React, { createContext, useState, useContext, useCallback } from 'react';
import { transactionsAPI, accountsAPI, savingsAPI, budgetsAPI, setAuthToken } from '../services/api';

const FinancesContext = createContext();

export const FinancesProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Financial state
  const [balance, setBalance] = useState(2450.00);
  const [savings, setSavings] = useState(1200.00);
  const [monthlyAllowance, setMonthlyAllowance] = useState(3000);
  
  // Data from API
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Monthly Allowance', date: '2025-10-01', amount: 3000, type: 'income' },
    { id: 2, title: 'Textbooks', date: '2025-10-03', amount: -150, type: 'expense' },
    { id: 3, title: 'Coffee Shop', date: '2025-10-04', amount: -12.50, type: 'expense' },
    { id: 4, title: 'Freelance Gig', date: '2025-10-05', amount: 200, type: 'income' },
    { id: 5, title: 'Grocery Run', date: '2025-10-06', amount: -65.20, type: 'expense' },
  ]);
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, title: 'New Laptop', target: 2000, current: 850, color: '#3b82f6' },
    { id: 2, title: 'Summer Trip', target: 1500, current: 350, color: '#ec4899' },
    { id: 3, title: 'Emergency Fund', target: 1000, current: 1000, color: '#10b981', completed: true },
  ]);
  const [budgets, setBudgets] = useState([]);

  // Authentication
  const login = async (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    await fetchAllData();
  };

  const logout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    resetState();
  };

  const resetState = () => {
    setAccounts([]);
    setTransactions([]);
    setSavingsGoals([]);
    setBudgets([]);
    setBalance(0);
    setSavings(0);
  };

  // Fetch all data from API
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [accountsRes, transactionsRes, savingsRes, budgetsRes] = await Promise.allSettled([
        accountsAPI.list(),
        transactionsAPI.list(),
        savingsAPI.list(),
        budgetsAPI.list(),
      ]);

      if (accountsRes.status === 'fulfilled') {
        setAccounts(accountsRes.value.data);
        // Calculate total balance from accounts
        const totalBalance = accountsRes.value.data.reduce((sum, acc) => sum + acc.balance, 0);
        setBalance(totalBalance);
      }

      if (transactionsRes.status === 'fulfilled') {
        setTransactions(transactionsRes.value.data);
      }

      if (savingsRes.status === 'fulfilled') {
        setSavingsGoals(savingsRes.value.data);
        // Calculate total savings
        const totalSavings = savingsRes.value.data.reduce((sum, goal) => sum + goal.current_amount, 0);
        setSavings(totalSavings);
      }

      if (budgetsRes.status === 'fulfilled') {
        setBudgets(budgetsRes.value.data);
        // Get monthly budget as allowance
        const monthlyBudget = budgetsRes.value.data.find(b => b.period === 'monthly' && b.is_active);
        if (monthlyBudget) {
          setMonthlyAllowance(monthlyBudget.amount);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Transaction operations
  const addTransaction = async (transaction) => {
    try {
      setIsLoading(true);
      // For demo mode (no backend), add locally
      const newTransaction = { ...transaction, id: Date.now() };
      setTransactions(prev => [newTransaction, ...prev]);
      
      if (transaction.type === 'income') {
        setBalance(curr => curr + Number(transaction.amount));
      } else {
        setBalance(curr => curr - Number(transaction.amount));
      }

      // If connected to API:
      // const response = await transactionsAPI.create(transaction);
      // setTransactions(prev => [response.data, ...prev]);
      // await fetchAllData(); // Refresh all data
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setIsLoading(true);
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        if (transaction.type === 'income') {
          setBalance(curr => curr - Number(Math.abs(transaction.amount)));
        } else {
          setBalance(curr => curr + Number(Math.abs(transaction.amount)));
        }
      }
      // await transactionsAPI.delete(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Savings goal operations
  const addSavingsGoal = async (goal) => {
    try {
      setIsLoading(true);
      const newGoal = { ...goal, id: Date.now(), current: 0, completed: false };
      setSavingsGoals(prev => [...prev, newGoal]);
      // const response = await savingsAPI.create(goal);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const contributeTGoal = async (goalId, amount) => {
    try {
      setIsLoading(true);
      setSavingsGoals(prev => prev.map(goal => {
        if (goal.id === goalId) {
          const newCurrent = goal.current + amount;
          return {
            ...goal,
            current: newCurrent,
            completed: newCurrent >= goal.target
          };
        }
        return goal;
      }));
      setSavings(prev => prev + amount);
      // await savingsAPI.contribute(goalId, amount);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FinancesContext.Provider value={{
      // State
      isLoading,
      error,
      isAuthenticated,
      balance,
      savings,
      monthlyAllowance,
      accounts,
      transactions,
      savingsGoals,
      budgets,
      
      // Auth actions
      login,
      logout,
      
      // Data actions
      fetchAllData,
      addTransaction,
      deleteTransaction,
      addSavingsGoal,
      contributeTGoal,
    }}>
      {children}
    </FinancesContext.Provider>
  );
};

export const useFinances = () => {
  const context = useContext(FinancesContext);
  if (!context) {
    throw new Error('useFinances must be used within a FinancesProvider');
  }
  return context;
};
