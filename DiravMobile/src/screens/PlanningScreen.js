import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinances } from '../context/FinancesContext';
import colors from '../constants/colors';

const PlanningScreen = () => {
  const { monthlyAllowance, addTransaction, transactions } = useFinances();
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = () => {
    if (!amount || !title) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    addTransaction({
      title,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString().split('T')[0]
    });

    setAmount('');
    setTitle('');
    Alert.alert('Success', 'Transaction added successfully!');
  };

  const totalSpent = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const progress = Math.min((totalSpent / monthlyAllowance) * 100, 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budget Planning</Text>
        <Text style={styles.subtitle}>Manage your allowance and track your spending manually.</Text>
      </View>

      {/* Monthly Budget Tracker */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Allowance</Text>
        
        <View style={styles.allowanceDisplay}>
          <Text style={styles.allowanceAmount}>${monthlyAllowance.toFixed(2)}</Text>
          <Text style={styles.allowancePeriod}>/ month</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Spent (${totalSpent.toFixed(2)})</Text>
            <Text style={styles.progressLabel}>Remaining (${(monthlyAllowance - totalSpent).toFixed(2)})</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: progress > 90 ? colors.error : colors.primary 
                }
              ]} 
            />
          </View>
          {progress > 90 && (
            <Text style={styles.warningText}>Warning: You are approaching your budget limit!</Text>
          )}
        </View>
      </View>

      {/* Add Transaction Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add Transaction</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Grocery, Freelance"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Amount ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && styles.typeButtonActiveExpense
            ]}
            onPress={() => setType('expense')}
          >
            <Ionicons 
              name="remove-circle" 
              size={18} 
              color={type === 'expense' ? colors.error : colors.textMuted} 
            />
            <Text style={[
              styles.typeButtonText,
              type === 'expense' && styles.typeButtonTextActiveExpense
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && styles.typeButtonActiveIncome
            ]}
            onPress={() => setType('income')}
          >
            <Ionicons 
              name="add-circle" 
              size={18} 
              color={type === 'income' ? colors.success : colors.textMuted} 
            />
            <Text style={[
              styles.typeButtonText,
              type === 'income' && styles.typeButtonTextActiveIncome
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        
        {transactions.slice(0, 10).map((item, index) => {
          const isIncome = item.type === 'income';
          return (
            <View key={item.id}>
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
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionDate}>{item.date}</Text>
                  </View>
                </View>
                <Text style={[styles.transactionAmount, { color: isIncome ? colors.success : colors.textMain }]}>
                  {isIncome ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                </Text>
              </View>
              {index < transactions.slice(0, 10).length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textMain,
    marginBottom: 16,
  },
  allowanceDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  allowanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  allowancePeriod: {
    fontSize: 16,
    color: colors.textLight,
    marginLeft: 8,
    marginBottom: 4,
  },
  progressSection: {
    gap: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMain,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.borderLight,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  warningText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
    marginTop: 4,
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
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeButtonActiveExpense: {
    backgroundColor: colors.errorLight,
    borderColor: '#fecaca',
  },
  typeButtonActiveIncome: {
    backgroundColor: colors.successLight,
    borderColor: '#a7f3d0',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  typeButtonTextActiveExpense: {
    color: colors.error,
  },
  typeButtonTextActiveIncome: {
    color: colors.success,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
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
  },
});

export default PlanningScreen;
