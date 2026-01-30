import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const OpportunitiesScreen = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const opportunities = [
    { id: 1, title: '50% Off Textbooks', provider: 'BookWorld', category: 'education', type: 'discount', location: 'Online' },
    { id: 2, title: 'STEM Future Scholarship', provider: 'TechFoundation', category: 'education', type: 'scholarship', amount: '$5,000', location: 'Global' },
    { id: 3, title: 'Free Coffee Mondays', provider: 'Campus Cafe', category: 'food', type: 'privilege', location: 'Campus Center' },
    { id: 4, title: 'Student Tech Bundle', provider: 'ElectroStore', category: 'tech', type: 'discount', location: 'In-store' },
    { id: 5, title: 'Summer Exchange Program', provider: 'Global Edu', category: 'travel', type: 'scholarship', amount: 'Funded', location: 'Europe' },
    { id: 6, title: 'Cinema Student Night', provider: 'City Movies', category: 'entertainment', type: 'discount', location: 'City Center' },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'education', label: 'Education' },
    { id: 'food', label: 'Food' },
    { id: 'tech', label: 'Tech' },
    { id: 'travel', label: 'Travel' },
  ];

  const filtered = filter === 'all' 
    ? opportunities 
    : opportunities.filter(o => o.category === filter);

  const searchFiltered = searchQuery 
    ? filtered.filter(o => 
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.provider.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filtered;

  const getTypeStyle = (type) => {
    switch (type) {
      case 'scholarship':
        return { bg: '#f3e8ff', color: '#7c3aed' };
      case 'discount':
        return { bg: colors.errorLight, color: colors.error };
      default:
        return { bg: '#cffafe', color: '#0891b2' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Opportunities</Text>
          <Text style={styles.subtitle}>Exclusive discounts, scholarships, and privileges for you.</Text>
        </View>

        {/* Search & Filter */}
        <View style={styles.filterCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for discounts..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterButton,
                  filter === cat.id && styles.filterButtonActive
                ]}
                onPress={() => setFilter(cat.id)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === cat.id && styles.filterButtonTextActive
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Opportunities Grid */}
        <View style={styles.opportunitiesGrid}>
          {searchFiltered.map((opp) => {
            const typeStyle = getTypeStyle(opp.type);
            return (
              <TouchableOpacity key={opp.id} style={styles.opportunityCard} activeOpacity={0.7}>
                <View style={styles.opportunityHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                    <Text style={[styles.typeBadgeText, { color: typeStyle.color }]}>
                      {opp.type.toUpperCase()}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="open-outline" size={18} color={colors.textLight} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.opportunityTitle}>{opp.title}</Text>
                <Text style={styles.opportunityProvider}>{opp.provider}</Text>

                <View style={styles.opportunityFooter}>
                  {opp.amount && (
                    <Text style={styles.opportunityAmount}>{opp.amount}</Text>
                  )}
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.locationText}>{opp.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  filterCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgMain,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textMain,
  },
  filterScroll: {
    marginHorizontal: -4,
  },
  filterContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  opportunitiesGrid: {
    gap: 12,
  },
  opportunityCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  opportunityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textMain,
    marginBottom: 4,
  },
  opportunityProvider: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 16,
  },
  opportunityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  opportunityAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default OpportunitiesScreen;
