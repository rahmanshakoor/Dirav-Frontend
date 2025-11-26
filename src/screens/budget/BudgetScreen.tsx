import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { Button, Input, Card, ProgressBar } from '../../components';
import { colors, spacing, formatCurrency } from '../../utils/helpers';
import { Budget, Balance } from '../../types';
import { budgetService, transactionService } from '../../services/mockData';

const BudgetScreen: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form state
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [budgetData, balanceData] = await Promise.all([
        budgetService.getBudgets(),
        transactionService.getBalance(),
      ]);
      setBudgets(budgetData);
      setBalance(balanceData);
    } catch (error) {
      console.error('Error fetching budgets:', error);
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

  const handleCreateBudget = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    setLoading(true);
    try {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const endDate = period === 'weekly'
        ? new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

      await budgetService.createBudget({
        period,
        amount: parseFloat(amount),
        startDate,
        endDate,
      });

      setModalVisible(false);
      setAmount('');
      fetchData();
      Alert.alert('Success', 'Budget created successfully!');
    } catch {
      Alert.alert('Error', 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = (id: number) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await budgetService.deleteBudget(id);
            fetchData();
          },
        },
      ]
    );
  };

  const currentBudget = budgets[0];
  const spent = balance?.totalExpense || 0;
  const budgetAmount = currentBudget?.amount || 0;
  const remaining = budgetAmount - spent;
  const spentPercentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Current Budget Card */}
        {currentBudget ? (
          <Card style={styles.budgetCard} variant="elevated">
            <View style={styles.budgetHeader}>
              <View>
                <Text style={styles.budgetLabel}>
                  {currentBudget.period.charAt(0).toUpperCase() + currentBudget.period.slice(1)} Budget
                </Text>
                <Text style={styles.budgetAmount}>{formatCurrency(budgetAmount)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteBudget(currentBudget.id)}>
                <Text style={styles.deleteButton}>🗑️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Spent: {formatCurrency(spent)}</Text>
                <Text style={styles.progressLabel}>
                  {spentPercentage.toFixed(0)}%
                </Text>
              </View>
              <ProgressBar
                current={spent}
                target={budgetAmount}
                color={spentPercentage > 90 ? colors.danger : spentPercentage > 75 ? colors.warning : colors.primary}
                showPercentage={false}
                height={12}
              />
            </View>

            <View style={styles.remainingSection}>
              <Text style={styles.remainingLabel}>Remaining</Text>
              <Text
                style={[
                  styles.remainingAmount,
                  remaining < 0 && styles.overBudget,
                ]}
              >
                {formatCurrency(remaining)}
              </Text>
              {remaining < 0 && (
                <Text style={styles.warningText}>⚠️ You've exceeded your budget!</Text>
              )}
            </View>
          </Card>
        ) : (
          <Card style={styles.emptyCard} variant="elevated">
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No Budget Set</Text>
            <Text style={styles.emptyText}>
              Set a budget to start tracking your spending
            </Text>
            <Button
              title="Create Budget"
              onPress={() => setModalVisible(true)}
              style={styles.createButton}
            />
          </Card>
        )}

        {/* Spending Breakdown */}
        <Text style={styles.sectionTitle}>Spending Insights</Text>
        <Card>
          <View style={styles.insightRow}>
            <Text style={styles.insightIcon}>💰</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Total Income</Text>
              <Text style={[styles.insightValue, styles.income]}>
                {formatCurrency(balance?.totalIncome || 0)}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.insightRow}>
            <Text style={styles.insightIcon}>💸</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Total Expenses</Text>
              <Text style={[styles.insightValue, styles.expense]}>
                {formatCurrency(balance?.totalExpense || 0)}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.insightRow}>
            <Text style={styles.insightIcon}>💵</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Net Balance</Text>
              <Text
                style={[
                  styles.insightValue,
                  (balance?.balance || 0) >= 0 ? styles.income : styles.expense,
                ]}
              >
                {formatCurrency(balance?.balance || 0)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Tips */}
        <Text style={styles.sectionTitle}>Budget Tips</Text>
        <Card>
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              Try to save at least 20% of your income each month
            </Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              Track every expense, no matter how small
            </Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              Review your budget weekly to stay on track
            </Text>
          </View>
        </Card>

        {currentBudget && (
          <Button
            title="Update Budget"
            onPress={() => setModalVisible(true)}
            variant="outline"
            style={styles.updateButton}
          />
        )}
      </ScrollView>

      {/* Create Budget Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Budget</Text>

            <Text style={styles.label}>Budget Period</Text>
            <View style={styles.periodSelector}>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  period === 'weekly' && styles.periodButtonActive,
                ]}
                onPress={() => setPeriod('weekly')}
              >
                <Text
                  style={[
                    styles.periodText,
                    period === 'weekly' && styles.periodTextActive,
                  ]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  period === 'monthly' && styles.periodButtonActive,
                ]}
                onPress={() => setPeriod('monthly')}
              >
                <Text
                  style={[
                    styles.periodText,
                    period === 'monthly' && styles.periodTextActive,
                  ]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>

            <Input
              label="Budget Amount ($)"
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                  setAmount('');
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={handleCreateBudget}
                loading={loading}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  budgetCard: {
    backgroundColor: colors.primary,
    marginBottom: spacing.lg,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  budgetLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  budgetAmount: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  deleteButton: {
    fontSize: 20,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  remainingSection: {
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  remainingLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  remainingAmount: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  overBudget: {
    color: '#FFCDD2',
  },
  warningText: {
    color: '#FFCDD2',
    fontSize: 12,
    marginTop: spacing.xs,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  insightContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  income: {
    color: colors.income,
  },
  expense: {
    color: colors.expense,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  updateButton: {
    marginTop: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  periodButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: colors.white,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});

export default BudgetScreen;
