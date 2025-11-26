import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction } from '../types';
import { colors, spacing, formatCurrency, formatDateShort, getCategoryIcon } from '../utils/helpers';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getCategoryIcon(transaction.category)}</Text>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description || 'No description'}
        </Text>
        <Text style={styles.date}>{formatDateShort(transaction.date)}</Text>
      </View>
      
      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default TransactionItem;
