import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinances } from '../context/FinancesContext';
import colors from '../constants/colors';

const DashboardScreen = ({ navigation }) => {
  const { balance, savings, monthlyAllowance, transactions, savingsGoals, user } = useFinances();

  // Calculate actual spending this month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter(t => 
    t.date && t.date.startsWith(currentMonth)
  );
  
  const totalSpentThisMonth = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    
  const remainingAllowance = monthlyAllowance - totalSpentThisMonth;

  // Calculate savings goal progress
  const totalSavingsTarget = savingsGoals.reduce((acc, goal) => acc + (goal.target || goal.target_amount || 0), 0);
  const totalSavingsCurrent = savingsGoals.reduce((acc, goal) => acc + (goal.current || goal.current_amount || 0), 0);
  const savingsProgress = totalSavingsTarget > 0 ? Math.round((totalSavingsCurrent / totalSavingsTarget) * 100) : 0;

  const renderTransaction = ({ item }) => {
    const isIncome = item.type === 'income';
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View style={[styles.transactionIcon, { backgroundColor: isIncome ? colors.successLight : colors.errorLight }]}>
            <Ionicons
              name={isIncome ? 'arrow-down' : 'arrow-up'}
              size={16}
              color={isIncome ? colors.success : colors.error}
            />
          </View>
          <View>
            <Text style={styles.transactionTitle}>{item.title || item.description || 'Transaction'}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={[styles.transactionAmount, { color: isIncome ? colors.success : colors.textMain }]}>
          {isIncome ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    );
  };

  const userName = user?.first_name || 'there';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back, {userName}</Text>
          <Text style={styles.subGreeting}>Here's your financial pulse.</Text>
        </View>
      </View>

      {/* Financial Overview */}
      <Text style={styles.sectionTitle}>Financial Overview</Text>
      
      <View style={styles.overviewCards}>
        {/* Balance Card */}
        <View style={styles.overviewCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardLabel}>Total Balance</Text>
              <Text style={styles.cardValue}>${balance.toFixed(2)}</Text>
            </View>
            <View style={[styles.cardIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="wallet" size={20} color={colors.primary} />
            </View>
          </View>
        </View>

        {/* Savings Card */}
        <View style={styles.overviewCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardLabel}>Total Savings</Text>
              <Text style={styles.cardValue}>${savings.toFixed(2)}</Text>
            </View>
            <View style={[styles.cardIcon, { backgroundColor: '#cffafe' }]}>
              <Ionicons name="arrow-up" size={20} color={colors.secondary} />
            </View>
          </View>
          {savingsGoals.length > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Goal Progress</Text>
                <Text style={styles.progressValue}>{savingsProgress}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(savingsProgress, 100)}%`, backgroundColor: colors.secondary }]} />
              </View>
            </View>
          )}
        </View>

        {/* Monthly Allowance Card */}
        {monthlyAllowance > 0 && (
          <View style={styles.overviewCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardLabel}>Monthly Allowance</Text>
                <Text style={styles.cardValue}>${monthlyAllowance.toFixed(2)}</Text>
              </View>
              <View style={[styles.cardIcon, { backgroundColor: '#ffe4e6' }]}>
                <Ionicons name="calendar" size={20} color={colors.error} />
              </View>
            </View>
            <View style={styles.allowanceFooter}>
              <View style={styles.allowanceItem}>
                <Text style={styles.allowanceLabel}>Spent</Text>
                <Text style={styles.allowanceValue}>${totalSpentThisMonth.toFixed(2)}</Text>
              </View>
              <View style={[styles.allowanceItem, styles.allowanceDivider]}>
                <Text style={styles.allowanceLabel}>Remaining</Text>
                <Text style={[styles.allowanceValue, { color: remainingAllowance >= 0 ? colors.success : colors.error }]}>
                  ${remainingAllowance.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Planning')}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>

        {transactions.length > 0 ? (
          <View style={styles.transactionsCard}>
            {transactions.slice(0, 5).map((item, index) => (
              <View key={item.id}>
                {renderTransaction({ item })}
                {index < transactions.slice(0, 5).length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>Add your first transaction to get started</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Planning')}
            >
              <Text style={styles.emptyButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Planning')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Add Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Savings')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#cffafe' }]}>
              <Ionicons name="flag" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.actionText}>Set Savings Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('AI Advisor')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="sparkles" size={24} color="#7c3aed" />
            </View>
            <Text style={styles.actionText}>Ask AI Advisor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textMain,
    marginBottom: 16,
  },
  overviewCards: {
    gap: 12,
    marginBottom: 24,
  },
  overviewCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textMain,
    marginTop: 4,
  },
  cardIcon: {
    padding: 8,
    borderRadius: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  progressValue: {
    fontSize: 12,
    color: colors.textLight,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  allowanceFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
    marginTop: 4,
  },
  allowanceItem: {
    flex: 1,
  },
  allowanceDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
    paddingLeft: 16,
    marginLeft: 16,
  },
  allowanceLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 4,
  },
  allowanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  transactionsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMain,
  },
  transactionDate: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 16,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMain,
    textAlign: 'center',
  },
});

export default DashboardScreen;
