import React, { useState } from 'react';
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
  const { balance, savings, monthlyAllowance, transactions } = useFinances();
  const [activePromo, setActivePromo] = useState(0);

  const featuredPromos = [
    { id: 1, title: 'Back to School Tech', discount: '40% OFF', provider: 'ElectroWorld', color: colors.primary },
    { id: 2, title: 'Summer Travel Pass', discount: '$200 Grant', provider: 'GlobalRail', color: '#ec4899' },
    { id: 3, title: 'Campus Meal Plan', discount: 'Buy 1 Get 1', provider: 'UniFoods', color: colors.secondary },
  ];

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
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={[styles.transactionAmount, { color: isIncome ? colors.success : colors.textMain }]}>
          {isIncome ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back, Student</Text>
          <Text style={styles.subGreeting}>Here's your financial pulse.</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Opportunities')}>
          <Text style={styles.viewAllLink}>View all opportunities →</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Promo Card */}
      <TouchableOpacity
        style={[styles.promoCard, { backgroundColor: featuredPromos[activePromo].color }]}
        activeOpacity={0.9}
      >
        <View style={styles.promoContent}>
          <Text style={styles.promoLabel}>Featured Opportunity</Text>
          <Text style={styles.promoDiscount}>{featuredPromos[activePromo].discount}</Text>
          <Text style={styles.promoDescription}>
            at {featuredPromos[activePromo].provider} - {featuredPromos[activePromo].title}
          </Text>
          <TouchableOpacity style={styles.claimButton}>
            <Text style={styles.claimButtonText}>Claim Now</Text>
          </TouchableOpacity>
        </View>
        
        {/* Promo Indicators */}
        <View style={styles.indicators}>
          {featuredPromos.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setActivePromo(idx)}
              style={[
                styles.indicator,
                idx === activePromo && styles.indicatorActive
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>

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
          <View style={styles.cardFooter}>
            <Ionicons name="trending-up" size={14} color={colors.success} />
            <Text style={styles.changeText}>+12% vs last month</Text>
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
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Goal Progress</Text>
              <Text style={styles.progressValue}>65%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%', backgroundColor: colors.secondary }]} />
            </View>
          </View>
        </View>

        {/* Monthly Allowance Card */}
        <View style={styles.overviewCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardLabel}>Monthly Allowance</Text>
              <Text style={styles.cardValue}>${monthlyAllowance.toFixed(2)}</Text>
            </View>
            <View style={[styles.cardIcon, { backgroundColor: '#ffe4e6' }]}>
              <Ionicons name="arrow-down" size={20} color={colors.error} />
            </View>
          </View>
          <View style={styles.allowanceFooter}>
            <View style={styles.allowanceItem}>
              <Text style={styles.allowanceLabel}>Spent</Text>
              <Text style={styles.allowanceValue}>$1,340</Text>
            </View>
            <View style={[styles.allowanceItem, styles.allowanceDivider]}>
              <Text style={styles.allowanceLabel}>Remaining</Text>
              <Text style={[styles.allowanceValue, { color: colors.success }]}>$1,660</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Planning')}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsCard}>
          {transactions.slice(0, 5).map((item, index) => (
            <View key={item.id}>
              {renderTransaction({ item })}
              {index < transactions.slice(0, 5).length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </View>

      {/* Daily Insight */}
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Ionicons name="sparkles" size={18} color="#facc15" />
          <Text style={styles.insightTitle}>Daily Insight</Text>
        </View>
        <Text style={styles.insightText}>
          "Spending on coffee has increased by 15%. Consider the Campus Cafe discount (Buy 1 Get 1)!"
        </Text>
        <View style={styles.insightButtons}>
          <TouchableOpacity style={styles.insightButtonPrimary}>
            <Text style={styles.insightButtonPrimaryText}>View Tip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.insightButtonSecondary}>
            <Text style={styles.insightButtonSecondaryText}>Dismiss</Text>
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
  viewAllLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  promoCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    height: 200,
    justifyContent: 'space-between',
  },
  promoContent: {
    flex: 1,
  },
  promoLabel: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  promoDiscount: {
    fontSize: 40,
    fontWeight: '900',
    color: 'white',
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  claimButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    color: colors.textMain,
    fontWeight: 'bold',
    fontSize: 14,
  },
  indicators: {
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: 'white',
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
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '500',
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
  insightCard: {
    backgroundColor: colors.bgDark,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  insightText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
    marginBottom: 16,
  },
  insightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  insightButtonPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  insightButtonPrimaryText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  insightButtonSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#334155',
    borderRadius: 12,
    alignItems: 'center',
  },
  insightButtonSecondaryText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default DashboardScreen;
