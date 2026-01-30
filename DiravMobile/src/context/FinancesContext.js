import React, { createContext, useState, useContext, useCallback } from 'react';
import { transactionsAPI, accountsAPI, savingsAPI, budgetsAPI, setAuthToken } from '../services/api';

const FinancesContext = createContext();

export const FinancesProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Financial state
  const [balance, setBalance] = useState(0);
  const [savings, setSavings] = useState(0);
  const [monthlyAllowance, setMonthlyAllowance] = useState(0);

  // Data from API
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
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
    setMonthlyAllowance(0);
  };

  // Fetch all data from API
  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated) return;

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
        // Calculate total balance from all accounts
        const totalBalance = accountsRes.value.data.reduce((sum, acc) => sum + acc.balance, 0);
        setBalance(totalBalance);
      }

      if (transactionsRes.status === 'fulfilled') {
        setTransactions(transactionsRes.value.data);
      }

      if (savingsRes.status === 'fulfilled') {
        setSavingsGoals(savingsRes.value.data);
        // Calculate total savings from current amounts of all goals
        const totalSavings = savingsRes.value.data.reduce((sum, goal) => sum + goal.current_amount, 0);
        setSavings(totalSavings);
      }

      if (budgetsRes.status === 'fulfilled') {
        setBudgets(budgetsRes.value.data);
        // Get active monthly budget as allowance
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
  }, [isAuthenticated]);

  // Transaction operations
  const addTransaction = async (transaction) => {
    try {
      setIsLoading(true);
      const response = await transactionsAPI.create(transaction);
      setTransactions(prev => [response.data, ...prev]);

      // Update balance locally for immediate feedback
      if (transaction.type === 'income') {
        setBalance(curr => curr + Number(transaction.amount));
      } else {
        setBalance(curr => curr - Number(transaction.amount));
      }

      // Refresh to ensure consistency
      await fetchAllData();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setIsLoading(true);
      await transactionsAPI.delete(id);

      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        // Revert balance change
        if (transaction.type === 'income') {
          setBalance(curr => curr - Number(Math.abs(transaction.amount)));
        } else {
          setBalance(curr => curr + Number(Math.abs(transaction.amount)));
        }
      }

      await fetchAllData();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Savings goal operations
  const addSavingsGoal = async (goal) => {
    try {
      setIsLoading(true);
      const response = await savingsAPI.create(goal);
      setSavingsGoals(prev => [...prev, response.data]);
      await fetchAllData();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const contributeToGoal = async (goalId, amount) => {
    try {
      setIsLoading(true);
      await savingsAPI.contribute(goalId, amount);

      setSavingsGoals(prev => prev.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            current_amount: goal.current_amount + amount,
            // Assuming backend handles is_completed logic, but updating locally for UI
            // This is a simplification; ideally use backend response
          };
        }
        return goal;
      }));
      setSavings(prev => prev + amount);

      await fetchAllData();
    } catch (err) {
      setError(err.message);
      throw err;
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
      contributeToGoal,
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
