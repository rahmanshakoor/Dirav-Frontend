import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Input, Card } from '../../components';
import { colors, spacing, getCategoryIcon } from '../../utils/helpers';
import { TransactionInput } from '../../types';
import { transactionService, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../services/mockData';

interface AddTransactionScreenProps {
  navigation: {
    goBack: () => void;
  };
  route: {
    params?: {
      type?: 'income' | 'expense';
    };
  };
}

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({ navigation, route }) => {
  const initialType = route.params?.type || 'expense';
  
  const [type, setType] = useState<'income' | 'expense'>(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const input: TransactionInput = {
        type,
        amount: parseFloat(amount),
        category,
        description,
        date: new Date().toISOString().split('T')[0],
      };

      await transactionService.createTransaction(input);
      Alert.alert(
        'Success',
        `${type === 'income' ? 'Income' : 'Expense'} added successfully!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && styles.typeButtonActiveIncome,
            ]}
            onPress={() => {
              setType('income');
              setCategory('');
            }}
          >
            <Text style={styles.typeIcon}>💵</Text>
            <Text
              style={[
                styles.typeText,
                type === 'income' && styles.typeTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && styles.typeButtonActiveExpense,
            ]}
            onPress={() => {
              setType('expense');
              setCategory('');
            }}
          >
            <Text style={styles.typeIcon}>💸</Text>
            <Text
              style={[
                styles.typeText,
                type === 'expense' && styles.typeTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <Card style={styles.amountCard}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Input
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              containerStyle={styles.amountInputWrapper}
              error={errors.amount}
            />
          </View>
        </Card>

        {/* Category Selection */}
        <Card>
          <Text style={styles.label}>Category</Text>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
          <View style={styles.categoryGrid}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryItem,
                  category === cat && styles.categoryItemActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.categoryIcon}>{getCategoryIcon(cat)}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Description Input */}
        <Card>
          <Input
            label="Description (Optional)"
            placeholder="Add a note..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.descriptionInput}
          />
        </Card>

        {/* Submit Button */}
        <Button
          title={`Add ${type === 'income' ? 'Income' : 'Expense'}`}
          onPress={handleSubmit}
          loading={loading}
          variant={type === 'income' ? 'primary' : 'danger'}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.white,
    gap: spacing.sm,
  },
  typeButtonActiveIncome: {
    backgroundColor: colors.income,
  },
  typeButtonActiveExpense: {
    backgroundColor: colors.expense,
  },
  typeIcon: {
    fontSize: 24,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  typeTextActive: {
    color: colors.white,
  },
  amountCard: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.sm,
  },
  amountInputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '600',
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryItem: {
    width: '30%',
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  categoryItemActive: {
    backgroundColor: colors.primaryLight,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: spacing.md,
  },
});

export default AddTransactionScreen;
