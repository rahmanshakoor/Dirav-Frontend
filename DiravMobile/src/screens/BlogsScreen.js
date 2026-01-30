import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const BlogsScreen = () => {
  const articles = [
    {
      id: 1,
      title: "How to Build a Student Budget That Actually Works",
      excerpt: "Stop wondering where your money went. Follow these 5 simple steps to take control of your student finances without sacrificing fun.",
      category: "Budgeting",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1554224155-984063584d8c?auto=format&fit=crop&q=80&w=400",
      featured: true
    },
    {
      id: 2,
      title: "Understanding Credit Scores: A Student Guide",
      excerpt: "Your credit score matters more than you think. Learn the basics before you graduate.",
      category: "Credit",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400",
      featured: false
    },
    {
      id: 3,
      title: "Top 10 Money Saving Hacks for Campus Life",
      excerpt: "From textbooks to meal plans, discover the hidden ways to save thousands during your degree.",
      category: "Lifestyle",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
      featured: false
    },
    {
      id: 4,
      title: "Investing 101: Starting Small",
      excerpt: "You don't need to be rich to start investing. Learn about micro-investing apps.",
      category: "Investing",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=400",
      featured: false
    }
  ];

  const featuredArticle = articles.find(a => a.featured);
  const otherArticles = articles.filter(a => !a.featured);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Financial Literacy Hub</Text>
        <Text style={styles.subtitle}>Master your money with our curated guides and articles designed specifically for students.</Text>
      </View>

      {/* Featured Article */}
      {featuredArticle && (
        <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
          <Image 
            source={{ uri: featuredArticle.image }}
            style={styles.featuredImage}
            defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJpAN4pokyXwAAAABJRU5ErkJggg==' }}
          />
          <View style={styles.featuredContent}>
            <View style={styles.featuredMeta}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{featuredArticle.category}</Text>
              </View>
              <View style={styles.readTimeBadge}>
                <Ionicons name="time-outline" size={14} color={colors.textLight} />
                <Text style={styles.readTimeText}>{featuredArticle.readTime}</Text>
              </View>
            </View>
            <Text style={styles.featuredTitle}>{featuredArticle.title}</Text>
            <Text style={styles.featuredExcerpt}>{featuredArticle.excerpt}</Text>
            <View style={styles.readMore}>
              <Text style={styles.readMoreText}>Read Article</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Other Articles */}
      <View style={styles.articlesGrid}>
        {otherArticles.map((article) => (
          <TouchableOpacity key={article.id} style={styles.articleCard} activeOpacity={0.9}>
            <Image 
              source={{ uri: article.image }}
              style={styles.articleImage}
              defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJpAN4pokyXwAAAABJRU5ErkJggg==' }}
            />
            <View style={styles.articleContent}>
              <View style={styles.articleMeta}>
                <View style={styles.categoryBadgeSmall}>
                  <Text style={styles.categoryTextSmall}>{article.category}</Text>
                </View>
                <Text style={styles.readTimeSmall}>{article.readTime}</Text>
              </View>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleExcerpt} numberOfLines={2}>{article.excerpt}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textMain,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuredCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.borderLight,
  },
  featuredContent: {
    padding: 20,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  readTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 12,
    color: colors.textLight,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textMain,
    marginBottom: 8,
    lineHeight: 28,
  },
  featuredExcerpt: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 16,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  articlesGrid: {
    gap: 16,
  },
  articleCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  articleImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.borderLight,
  },
  articleContent: {
    padding: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  categoryBadgeSmall: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTextSmall: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  readTimeSmall: {
    fontSize: 11,
    color: colors.textLight,
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textMain,
    marginBottom: 6,
    lineHeight: 22,
  },
  articleExcerpt: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
});

export default BlogsScreen;
