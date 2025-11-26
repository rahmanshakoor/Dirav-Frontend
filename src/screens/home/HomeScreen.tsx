import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Card, TransactionItem } from '../../components';
import {
  colors,
  spacing,
  formatCurrency,
  getGreeting,
} from '../../utils/helpers';
import { Balance, Transaction, SavingGoal } from '../../types';
import { transactionService, goalService } from '../../services/mockData';

interface HomeScreenProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [balanceData, transactions, goalsData] = await Promise.all([
        transactionService.getBalance(),
        transactionService.getTransactions(),
        goalService.getGoals(),
      ]);
      setBalance(balanceData);
      setRecentTransactions(transactions.slice(0, 5));
      setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}, {firstName}!</Text>
          <Text style={styles.subtitle}>Your Financial Companion</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('More')}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(balance?.balance || 0)}
        </Text>
        <View style={styles.balanceDetails}>
          <View style={styles.balanceItem}>
            <Text style={styles.incomeLabel}>Income</Text>
            <Text style={styles.incomeAmount}>
              +{formatCurrency(balance?.totalIncome || 0)}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.expenseLabel}>Expenses</Text>
            <Text style={styles.expenseAmount}>
              -{formatCurrency(balance?.totalExpense || 0)}
            </Text>
          </View>
        </View>
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.incomeButton]}
          onPress={() => navigation.navigate('AddTransaction', { type: 'income' })}
        >
          <Text style={styles.actionIcon}>💵</Text>
          <Text style={styles.actionText}>Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.expenseButton]}
          onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
        >
          <Text style={styles.actionIcon}>💸</Text>
          <Text style={styles.actionText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Budget')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.menuEmoji}>📊</Text>
          </View>
          <Text style={styles.menuLabel}>Budget</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Goals')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.menuEmoji}>🎯</Text>
          </View>
          <Text style={styles.menuLabel}>Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('More', { screen: 'Opportunities' })}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#F3E5F5' }]}>
            <Text style={styles.menuEmoji}>💎</Text>
          </View>
          <Text style={styles.menuLabel}>Opportunities</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('More', { screen: 'Advice' })}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.menuEmoji}>🤖</Text>
          </View>
          <Text style={styles.menuLabel}>AI Advice</Text>
        </TouchableOpacity>
      </View>

      {/* Saving Goals Preview */}
      {goals.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saving Goals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {goals.slice(0, 3).map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <Card key={goal.id} style={styles.goalCard}>
                  <Text style={styles.goalName}>{goal.goalName}</Text>
                  <Text style={styles.goalProgress}>
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(progress, 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.goalPercentage}>{progress.toFixed(0)}%</Text>
                </Card>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        {recentTransactions.length > 0 ? (
          recentTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))
        ) : (
          <Card>
            <Text style={styles.emptyText}>No transactions yet. Add your first one!</Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 24,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  balanceAmount: {
    color: colors.white,
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 4,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  balanceItem: {
    flex: 1,
  },
  incomeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  incomeAmount: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  expenseLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'right',
  },
  expenseAmount: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  incomeButton: {
    backgroundColor: colors.income,
  },
  expenseButton: {
    backgroundColor: colors.expense,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  menuItem: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  menuEmoji: {
    fontSize: 28,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  goalCard: {
    width: 160,
    marginRight: spacing.md,
    padding: spacing.md,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.divider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  goalPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    padding: spacing.md,
  },
});

export default HomeScreen;
