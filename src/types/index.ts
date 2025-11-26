// User types
export interface User {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
}

// Transaction types
export interface Transaction {
  id: number;
  userId: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface TransactionInput {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

// Budget types
export interface Budget {
  id: number;
  userId: number;
  period: 'weekly' | 'monthly';
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface BudgetInput {
  period: 'weekly' | 'monthly';
  amount: number;
  startDate: string;
  endDate: string;
}

// Saving Goal types
export interface SavingGoal {
  id: number;
  userId: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

export interface SavingGoalInput {
  goalName: string;
  targetAmount: number;
  deadline: string;
}

// Blog types
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
}

// Opportunity types
export interface Opportunity {
  id: number;
  title: string;
  description: string;
  type: 'discount' | 'scholarship' | 'opportunity';
  eligibility: string;
  link: string;
  deadline: string;
  createdAt: string;
}

// Balance summary
export interface Balance {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// AI Advice types
export interface AdviceResponse {
  advice: string[];
  spendingAnalysis: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    savingsRate: number;
    categoryBreakdown: Record<string, number>;
  };
  recommendations: string[];
}

// Auth types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Budget: undefined;
  Goals: undefined;
  More: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  AddTransaction: { type: 'income' | 'expense' };
};

export type TransactionStackParamList = {
  TransactionList: undefined;
  AddTransaction: { type?: 'income' | 'expense' };
};

export type GoalStackParamList = {
  GoalsList: undefined;
  AddGoal: undefined;
  GoalDetails: { goalId: number };
};

export type MoreStackParamList = {
  MoreMenu: undefined;
  Opportunities: undefined;
  Blog: undefined;
  BlogPost: { postId: number };
  Advice: undefined;
  Profile: undefined;
};
