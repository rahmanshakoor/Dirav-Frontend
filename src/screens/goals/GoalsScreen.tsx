import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { Button, Input, Card, ProgressBar } from '../../components';
import { colors, spacing, formatCurrency, formatDate } from '../../utils/helpers';
import { SavingGoal } from '../../types';
import { goalService } from '../../services/mockData';

const GoalsScreen: React.FC = () => {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [contributeModalVisible, setContributeModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);
  
  // Form state
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [contributeAmount, setContributeAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGoals();
    setRefreshing(false);
  }, [fetchGoals]);

  const handleCreateGoal = async () => {
    if (!goalName.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    setLoading(true);
    try {
      await goalService.createGoal({
        goalName: goalName.trim(),
        targetAmount: parseFloat(targetAmount),
        deadline: deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      setModalVisible(false);
      setGoalName('');
      setTargetAmount('');
      setDeadline('');
      fetchGoals();
      Alert.alert('Success', 'Goal created successfully!');
    } catch {
      Alert.alert('Error', 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async () => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedGoal) return;

    setLoading(true);
    try {
      await goalService.contributeToGoal(selectedGoal.id, parseFloat(contributeAmount));
      setContributeModalVisible(false);
      setContributeAmount('');
      setSelectedGoal(null);
      fetchGoals();
      Alert.alert('Success', 'Contribution added!');
    } catch {
      Alert.alert('Error', 'Failed to add contribution');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = (goal: SavingGoal) => {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goal.goalName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await goalService.deleteGoal(goal.id);
            fetchGoals();
          },
        },
      ]
    );
  };

  const openContributeModal = (goal: SavingGoal) => {
    setSelectedGoal(goal);
    setContributeModalVisible(true);
  };

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  const renderGoal = ({ item }: { item: SavingGoal }) => {
    const progress = (item.currentAmount / item.targetAmount) * 100;
    const isCompleted = progress >= 100;

    return (
      <Card style={styles.goalCard} variant="elevated">
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{item.goalName}</Text>
            <Text style={styles.goalDeadline}>Due: {formatDate(item.deadline)}</Text>
          </View>
          {isCompleted && <Text style={styles.completedBadge}>✅ Completed</Text>}
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.currentAmount}>{formatCurrency(item.currentAmount)}</Text>
          <Text style={styles.targetAmount}>/ {formatCurrency(item.targetAmount)}</Text>
        </View>

        <ProgressBar
          current={item.currentAmount}
          target={item.targetAmount}
          color={isCompleted ? colors.success : colors.primary}
          height={10}
        />

        <View style={styles.goalActions}>
          {!isCompleted && (
            <Button
              title="+ Add Savings"
              onPress={() => openContributeModal(item)}
              size="small"
              style={styles.contributeButton}
            />
          )}
          <TouchableOpacity
            style={styles.deleteGoalButton}
            onPress={() => handleDeleteGoal(item)}
          >
            <Text style={styles.deleteGoalText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <Card style={styles.summaryCard} variant="elevated">
        <Text style={styles.summaryTitle}>Total Savings Progress</Text>
        <View style={styles.summaryAmount}>
          <Text style={styles.summaryValue}>{formatCurrency(totalSaved)}</Text>
          <Text style={styles.summaryTarget}>/ {formatCurrency(totalTarget)}</Text>
        </View>
        <ProgressBar
          current={totalSaved}
          target={totalTarget}
          color={colors.primary}
          height={8}
        />
        <Text style={styles.goalsCount}>{goals.length} active goal(s)</Text>
      </Card>

      {/* Goals List */}
      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>No Saving Goals</Text>
            <Text style={styles.emptyText}>
              Start saving for something special!
            </Text>
          </Card>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Create Goal Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Saving Goal</Text>

            <Input
              label="Goal Name"
              placeholder="e.g., New Laptop, Emergency Fund"
              value={goalName}
              onChangeText={setGoalName}
            />

            <Input
              label="Target Amount ($)"
              placeholder="Enter target amount"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="decimal-pad"
            />

            <Input
              label="Deadline (YYYY-MM-DD)"
              placeholder="e.g., 2024-06-30"
              value={deadline}
              onChangeText={setDeadline}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                  setGoalName('');
                  setTargetAmount('');
                  setDeadline('');
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Create"
                onPress={handleCreateGoal}
                loading={loading}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Contribute Modal */}
      <Modal
        visible={contributeModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setContributeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Savings</Text>
            {selectedGoal && (
              <Text style={styles.modalSubtitle}>
                Contributing to: {selectedGoal.goalName}
              </Text>
            )}

            <Input
              label="Amount ($)"
              placeholder="Enter amount to save"
              value={contributeAmount}
              onChangeText={setContributeAmount}
              keyboardType="decimal-pad"
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setContributeModalVisible(false);
                  setContributeAmount('');
                  setSelectedGoal(null);
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Add"
                onPress={handleContribute}
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
  summaryCard: {
    margin: spacing.md,
    marginBottom: 0,
    backgroundColor: colors.primary,
  },
  summaryTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  summaryAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  summaryValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryTarget: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginLeft: spacing.xs,
  },
  goalsCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.md,
  },
  goalCard: {
    marginBottom: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  goalDeadline: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  completedBadge: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  targetAmount: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  contributeButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  deleteGoalButton: {
    padding: spacing.sm,
  },
  deleteGoalText: {
    color: colors.danger,
    fontSize: 14,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
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
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 28,
    color: colors.white,
    fontWeight: '300',
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
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
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

export default GoalsScreen;
