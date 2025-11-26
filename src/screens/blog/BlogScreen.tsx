import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { Card } from '../../components';
import { colors, spacing, formatDate } from '../../utils/helpers';
import { BlogPost } from '../../types';
import { blogService } from '../../services/mockData';

interface BlogScreenProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
}

const BlogScreen: React.FC<BlogScreenProps> = ({ navigation }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await blogService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      Budgeting: '📊',
      'Saving Tips': '💡',
      'Financial Literacy': '📚',
      Credit: '💳',
      Investing: '📈',
    };
    return icons[category] || '📖';
  };

  const renderPost = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('BlogPost', { postId: item.id })}
      activeOpacity={0.8}
    >
      <Card variant="elevated" style={styles.card}>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.postContent}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(item.category)}</Text>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postExcerpt} numberOfLines={2}>
            {item.content.substring(0, 150)}...
          </Text>
          <View style={styles.postMeta}>
            <Text style={styles.authorText}>By {item.author}</Text>
            <Text style={styles.dateText}>{formatDate(item.publishedAt)}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Financial Literacy</Text>
        <Text style={styles.headerSubtitle}>
          Learn to manage your money wisely
        </Text>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>No articles yet</Text>
            <Text style={styles.emptyText}>
              Check back later for financial tips!
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
  listContent: {
    padding: spacing.md,
  },
  postCard: {
    marginBottom: spacing.md,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.divider,
  },
  postContent: {
    padding: spacing.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  postExcerpt: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: 12,
    color: colors.textLight,
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

export default BlogScreen;
