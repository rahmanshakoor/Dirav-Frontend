import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinances } from '../context/FinancesContext';
import colors from '../constants/colors';

const SavingsScreen = () => {
  const { savings, savingsGoals, addSavingsGoal, contributeToGoal } = useFinances();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const handleAddGoal = () => {
    if (!newGoalTitle || !newGoalTarget) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    addSavingsGoal({
      title: newGoalTitle,
      target: Number(newGoalTarget),
      color: colors.primary,
    });

    setIsModalVisible(false);
    setNewGoalTitle('');
    setNewGoalTarget('');
    Alert.alert('Success', 'Savings goal created!');
  };

  const handleContribute = (goalId, goalTitle) => {
    Alert.prompt(
      'Add Money',
      `How much would you like to add to "${goalTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (amount) => {
            if (amount && !isNaN(amount)) {
              contributeToGoal(goalId, Number(amount));
              Alert.alert('Success', `$${amount} added to ${goalTitle}!`);
            }
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Savings Goals</Text>
            <Text style={styles.subtitle}>Set goals and watch your money grow.</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
            <Ionicons name="add" size={20} color={colors.white} />
            <Text style={styles.addButtonText}>New Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Total Savings Card */}
        <View style={styles.totalCard}>
          <View style={styles.totalContent}>
            <View>
              <Text style={styles.totalLabel}>Total Saved</Text>
              <Text style={styles.totalAmount}>${savings.toFixed(2)}</Text>
            </View>
            <Ionicons name="cash" size={48} color="rgba(255,255,255,0.3)" />
          </View>
        </View>

        {/* Goals Grid */}
        <View style={styles.goalsGrid}>
          {savingsGoals.length > 0 ? (
            savingsGoals.map((goal) => {
              const currentAmount = goal.current || goal.current_amount || 0;
              const targetAmount = goal.target || goal.target_amount || 0;
              const progress = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
              const isCompleted = goal.completed || goal.is_completed || progress >= 100;
              return (
                <View 
                  key={goal.id} 
                  style={[
                    styles.goalCard,
                    { borderLeftColor: isCompleted ? colors.success : colors.primary }
                  ]}
                >
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title || goal.name}</Text>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>Completed</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.goalProgress}>
                    <View style={styles.goalProgressLabels}>
                      <Text style={styles.goalSaved}>${currentAmount.toFixed(2)} saved</Text>
                      <Text style={styles.goalTarget}>Target: ${targetAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${progress}%`,
                            backgroundColor: goal.color || colors.primary 
                          }
                        ]} 
                      />
                    </View>
                  </View>

                  {!isCompleted && (
                    <TouchableOpacity 
                      style={styles.goalButton}
                      onPress={() => handleContribute(goal.id, goal.title || goal.name)}
                    >
                      <Text style={styles.goalButtonText}>Add Money</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="flag-outline" size={48} color={colors.textLight} />
              <Text style={styles.emptyText}>No savings goals yet</Text>
              <Text style={styles.emptySubtext}>Create your first savings goal to start saving</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Goal</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Goal Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., New Laptop, Vacation"
                placeholderTextColor={colors.textLight}
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Target Amount ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="1000"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
                value={newGoalTarget}
                onChangeText={setNewGoalTarget}
              />
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleAddGoal}>
              <Text style={styles.createButtonText}>Create Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textMain,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  totalCard: {
    backgroundColor: '#0e7490', // Cyan 700
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  totalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#a5f3fc', // Cyan 200
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
  },
  goalsGrid: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textMain,
  },
  completedBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.success,
  },
  goalProgress: {
    marginBottom: 16,
  },
  goalProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalSaved: {
    fontSize: 13,
    color: colors.textMuted,
  },
  goalTarget: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMain,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textMain,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMain,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textMain,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
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
});

export default SavingsScreen;
