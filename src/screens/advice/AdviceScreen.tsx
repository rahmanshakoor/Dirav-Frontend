import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Card, ProgressBar } from '../../components';
import { colors, spacing, formatCurrency } from '../../utils/helpers';
import { AdviceResponse } from '../../types';
import { adviceService } from '../../services/mockData';

const AdviceScreen: React.FC = () => {
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdvice = useCallback(async () => {
    try {
      const data = await adviceService.getAdvice();
      setAdvice(data);
    } catch (error) {
      console.error('Error fetching advice:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAdvice();
    setRefreshing(false);
  }, [fetchAdvice]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingIcon}>🤖</Text>
        <Text style={styles.loadingText}>Analyzing your finances...</Text>
      </View>
    );
  }

  const { spendingAnalysis, advice: adviceList, recommendations } = advice || {
    spendingAnalysis: null,
    advice: [],
    recommendations: [],
  };

  const categoryColors: Record<string, string> = {
    Food: '#FF9800',
    Transport: '#2196F3',
    Entertainment: '#9C27B0',
    Education: '#4CAF50',
    Shopping: '#E91E63',
    Health: '#00BCD4',
    Utilities: '#607D8B',
    Other: '#795548',
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🤖</Text>
        <Text style={styles.headerTitle}>AI Financial Advisor</Text>
        <Text style={styles.headerSubtitle}>
          Personalized insights based on your spending habits
        </Text>
      </View>

      {/* Savings Rate Card */}
      {spendingAnalysis && (
        <Card style={styles.savingsCard} variant="elevated">
          <Text style={styles.savingsTitle}>Savings Rate</Text>
          <View style={styles.savingsRow}>
            <Text style={styles.savingsValue}>
              {spendingAnalysis.savingsRate.toFixed(1)}%
            </Text>
            <View style={styles.savingsTarget}>
              <Text style={styles.targetLabel}>Target: 20%</Text>
              {spendingAnalysis.savingsRate >= 20 ? (
                <Text style={styles.targetMet}>✅ Target Met!</Text>
              ) : (
                <Text style={styles.targetNotMet}>Keep going!</Text>
              )}
            </View>
          </View>
          <ProgressBar
            current={spendingAnalysis.savingsRate}
            target={20}
            color={spendingAnalysis.savingsRate >= 20 ? colors.success : colors.warning}
            showPercentage={false}
            height={10}
          />
        </Card>
      )}

      {/* AI Advice */}
      <Text style={styles.sectionTitle}>💬 Personalized Advice</Text>
      <Card variant="elevated">
        {adviceList.map((item, index) => (
          <View key={index} style={[styles.adviceItem, index !== adviceList.length - 1 && styles.adviceItemBorder]}>
            <Text style={styles.adviceText}>{item}</Text>
          </View>
        ))}
      </Card>

      {/* Spending Breakdown */}
      {spendingAnalysis && Object.keys(spendingAnalysis.categoryBreakdown).length > 0 && (
        <>
          <Text style={styles.sectionTitle}>📊 Spending Breakdown</Text>
          <Card variant="elevated">
            {Object.entries(spendingAnalysis.categoryBreakdown).map(([category, amount], index) => {
              const percentage = spendingAnalysis.totalExpense > 0
                ? ((amount as number) / spendingAnalysis.totalExpense) * 100
                : 0;
              return (
                <View key={category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <View
                      style={[
                        styles.categoryDot,
                        { backgroundColor: categoryColors[category] || colors.textSecondary },
                      ]}
                    />
                    <Text style={styles.categoryName}>{category}</Text>
                  </View>
                  <View style={styles.categoryValues}>
                    <Text style={styles.categoryAmount}>{formatCurrency(amount as number)}</Text>
                    <Text style={styles.categoryPercent}>{percentage.toFixed(0)}%</Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </>
      )}

      {/* Recommendations */}
      <Text style={styles.sectionTitle}>💡 Recommendations</Text>
      <Card variant="elevated">
        {recommendations.map((item, index) => (
          <View key={index} style={[styles.recommendationItem, index !== recommendations.length - 1 && styles.recommendationBorder]}>
            <Text style={styles.recommendationText}>{item}</Text>
          </View>
        ))}
      </Card>

      {/* Quick Stats */}
      {spendingAnalysis && (
        <>
          <Text style={styles.sectionTitle}>📈 Financial Summary</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statValue}>{formatCurrency(spendingAnalysis.totalIncome)}</Text>
              <Text style={styles.statLabel}>Total Income</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>💸</Text>
              <Text style={styles.statValue}>{formatCurrency(spendingAnalysis.totalExpense)}</Text>
              <Text style={styles.statLabel}>Total Expenses</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>💵</Text>
              <Text style={[styles.statValue, { color: spendingAnalysis.balance >= 0 ? colors.income : colors.expense }]}>
                {formatCurrency(spendingAnalysis.balance)}
              </Text>
              <Text style={styles.statLabel}>Net Balance</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statValue}>
                {Object.keys(spendingAnalysis.categoryBreakdown).length}
              </Text>
              <Text style={styles.statLabel}>Categories</Text>
            </Card>
          </View>
        </>
      )}

      {/* Disclaimer */}
      <Card style={styles.disclaimerCard}>
        <Text style={styles.disclaimerText}>
          ℹ️ This advice is generated based on your transaction history and general financial principles. For complex financial decisions, consider consulting a professional advisor.
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  savingsCard: {
    backgroundColor: colors.primary,
    marginBottom: spacing.lg,
  },
  savingsTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  savingsValue: {
    color: colors.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  savingsTarget: {
    alignItems: 'flex-end',
  },
  targetLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  targetMet: {
    color: '#C8E6C9',
    fontSize: 14,
    fontWeight: '600',
  },
  targetNotMet: {
    color: '#FFECB3',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  adviceItem: {
    paddingVertical: spacing.sm,
  },
  adviceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  adviceText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text,
  },
  categoryValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.sm,
  },
  categoryPercent: {
    fontSize: 12,
    color: colors.textSecondary,
    width: 36,
    textAlign: 'right',
  },
  recommendationItem: {
    paddingVertical: spacing.sm,
  },
  recommendationBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.md,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  disclaimerCard: {
    backgroundColor: colors.background,
    marginTop: spacing.lg,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default AdviceScreen;
