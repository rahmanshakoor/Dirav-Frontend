// Color theme
export const colors = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#C8E6C9',
  secondary: '#2196F3',
  accent: '#FF9800',
  danger: '#F44336',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Grays
  white: '#FFFFFF',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#9E9E9E',
  border: '#E0E0E0',
  divider: '#EEEEEE',
  
  // Income/Expense
  income: '#4CAF50',
  expense: '#F44336',
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  bodySmall: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: colors.textLight,
  },
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format date short
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Calculate progress percentage
export const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
};

// Get greeting based on time of day
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

// Get category icon
export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    Food: '🍔',
    Transport: '🚌',
    Entertainment: '🎮',
    Education: '📚',
    Shopping: '🛍️',
    Health: '💊',
    Utilities: '💡',
    Allowance: '💰',
    'Part-time': '💼',
    Scholarship: '🎓',
    Gifts: '🎁',
    Freelance: '💻',
    Other: '📦',
  };
  return icons[category] || '📦';
};

// Get opportunity type color
export const getOpportunityTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    discount: colors.info,
    scholarship: colors.success,
    opportunity: colors.accent,
  };
  return typeColors[type] || colors.textSecondary;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password (min 6 characters)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
