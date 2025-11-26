import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { Card } from '../../components';
import { colors, spacing, formatDate, getOpportunityTypeColor } from '../../utils/helpers';
import { Opportunity } from '../../types';
import { opportunityService } from '../../services/mockData';

const OpportunitiesScreen: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'discount' | 'scholarship' | 'opportunity'>('all');

  const fetchOpportunities = useCallback(async () => {
    try {
      const data = await opportunityService.getOpportunities();
      setOpportunities(data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOpportunities();
    setRefreshing(false);
  }, [fetchOpportunities]);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.error('Failed to open URL');
    });
  };

  const filteredOpportunities = opportunities.filter(o => {
    if (filter === 'all') return true;
    return o.type === filter;
  });

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'discount':
        return '🏷️';
      case 'scholarship':
        return '🎓';
      case 'opportunity':
        return '💼';
      default:
        return '✨';
    }
  };

  const getTypeLabel = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const renderOpportunity = ({ item }: { item: Opportunity }) => (
    <Card style={styles.opportunityCard} variant="elevated">
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getOpportunityTypeColor(item.type) + '20' },
          ]}
        >
          <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
          <Text
            style={[styles.typeText, { color: getOpportunityTypeColor(item.type) }]}
          >
            {getTypeLabel(item.type)}
          </Text>
        </View>
        <Text style={styles.deadline}>Due: {formatDate(item.deadline)}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.eligibilityContainer}>
        <Text style={styles.eligibilityLabel}>Eligibility:</Text>
        <Text style={styles.eligibilityText}>{item.eligibility}</Text>
      </View>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => handleOpenLink(item.link)}
      >
        <Text style={styles.linkButtonText}>Learn More →</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💎 Opportunity Hub</Text>
        <Text style={styles.headerSubtitle}>
          Discover discounts, scholarships, and opportunities for students
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'discount', 'scholarship', 'opportunity'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : getTypeLabel(f)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Opportunities List */}
      <FlatList
        data={filteredOpportunities}
        renderItem={renderOpportunity}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No opportunities found</Text>
            <Text style={styles.emptyText}>
              Check back later for new opportunities!
            </Text>
          </Card>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.white,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.md,
  },
  opportunityCard: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: 4,
  },
  typeIcon: {
    fontSize: 14,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deadline: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  eligibilityContainer: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  eligibilityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  eligibilityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  linkButton: {
    alignSelf: 'flex-start',
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
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
});

export default OpportunitiesScreen;
