import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../../components';
import { colors, spacing } from '../../utils/helpers';

interface MoreMenuScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const MoreMenuScreen: React.FC<MoreMenuScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Opportunity Hub',
      icon: '💎',
      description: 'Discounts, scholarships, and opportunities',
      screen: 'Opportunities',
    },
    {
      title: 'Financial Blog',
      icon: '📚',
      description: 'Learn about money management',
      screen: 'Blog',
    },
    {
      title: 'AI Advisor',
      icon: '🤖',
      description: 'Get personalized financial advice',
      screen: 'Advice',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <Card style={styles.profileCard} variant="elevated">
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>
      </Card>

      {/* Menu Items */}
      <Text style={styles.sectionTitle}>Features</Text>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate(item.screen)}
          activeOpacity={0.7}
        >
          <Card style={styles.menuCard}>
            <View style={styles.menuRow}>
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}

      {/* App Info */}
      <Text style={styles.sectionTitle}>About</Text>
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Build</Text>
          <Text style={styles.infoValue}>MVP Demo</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={[styles.infoValue, styles.statusActive]}>Active</Text>
        </View>
      </Card>

      {/* Logout Button */}
      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>💰 Dirav</Text>
        <Text style={styles.footerText}>
          Financial Empowerment for Students
        </Text>
        <Text style={styles.footerCopyright}>
          © 2024 Dirav. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileCard: {
    margin: spacing.md,
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginLeft: spacing.md,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  menuCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  menuDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: colors.textLight,
  },
  infoCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  statusActive: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  logoutButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  footerLogo: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footerCopyright: {
    fontSize: 12,
    color: colors.textLight,
  },
});

export default MoreMenuScreen;
