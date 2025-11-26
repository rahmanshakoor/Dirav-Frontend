import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Card } from '../../components';
import { colors, spacing, formatDate } from '../../utils/helpers';
import { BlogPost } from '../../types';
import { blogService } from '../../services/mockData';

const BlogPostScreen = ({ route }: { route: { params: { postId: number } } }) => {
  const { postId } = route.params;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogService.getPost(postId);
        setPost(data || null);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.headerImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>

        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.meta}>
          <Text style={styles.author}>By {post.author}</Text>
          <Text style={styles.date}>{formatDate(post.publishedAt)}</Text>
        </View>

        <Card style={styles.articleCard}>
          <Text style={styles.articleContent}>{post.content}</Text>
        </Card>

        {/* Related Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Key Takeaways</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Apply these concepts to your daily financial decisions</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Start small and build good habits over time</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Track your progress using Dirav's tools</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
  },
  headerImage: {
    width: '100%',
    height: 220,
    backgroundColor: colors.divider,
  },
  content: {
    padding: spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  date: {
    fontSize: 14,
    color: colors.textLight,
  },
  articleCard: {
    marginBottom: spacing.md,
  },
  articleContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 26,
  },
  tipsCard: {
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.lg,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  tipBullet: {
    fontSize: 16,
    color: colors.primaryDark,
    marginRight: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.primaryDark,
    lineHeight: 20,
  },
});

export default BlogPostScreen;
