import {
  User,
  Transaction,
  TransactionInput,
  Budget,
  BudgetInput,
  SavingGoal,
  SavingGoalInput,
  BlogPost,
  Opportunity,
  Balance,
  AdviceResponse,
  LoginInput,
  RegisterInput,
} from '../types';

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage (simulating a database)
let mockUser: User | null = null;
let mockToken: string | null = null;

let mockTransactions: Transaction[] = [
  {
    id: 1,
    userId: 1,
    type: 'income',
    amount: 1500,
    category: 'Allowance',
    description: 'Monthly allowance from parents',
    date: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    type: 'expense',
    amount: 45,
    category: 'Food',
    description: 'Groceries',
    date: '2024-01-03',
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    id: 3,
    userId: 1,
    type: 'expense',
    amount: 120,
    category: 'Transport',
    description: 'Monthly bus pass',
    date: '2024-01-05',
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 4,
    userId: 1,
    type: 'income',
    amount: 200,
    category: 'Part-time',
    description: 'Weekend tutoring',
    date: '2024-01-07',
    createdAt: '2024-01-07T00:00:00Z',
  },
  {
    id: 5,
    userId: 1,
    type: 'expense',
    amount: 80,
    category: 'Entertainment',
    description: 'Concert tickets',
    date: '2024-01-10',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 6,
    userId: 1,
    type: 'expense',
    amount: 150,
    category: 'Education',
    description: 'Textbooks',
    date: '2024-01-12',
    createdAt: '2024-01-12T00:00:00Z',
  },
];

let mockBudgets: Budget[] = [
  {
    id: 1,
    userId: 1,
    period: 'monthly',
    amount: 1200,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

let mockGoals: SavingGoal[] = [
  {
    id: 1,
    userId: 1,
    goalName: 'New Laptop',
    targetAmount: 1200,
    currentAmount: 450,
    deadline: '2024-06-30',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    goalName: 'Emergency Fund',
    targetAmount: 500,
    currentAmount: 320,
    deadline: '2024-04-30',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    userId: 1,
    goalName: 'Spring Break Trip',
    targetAmount: 800,
    currentAmount: 200,
    deadline: '2024-03-15',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Budgeting 101: A Student\'s Guide',
    content: `Budgeting is the foundation of financial health, especially for students. Here's how to get started:

1. **Track Your Income**: Know exactly how much money you have coming in each month.

2. **List Your Expenses**: Write down all your regular expenses - rent, food, transportation, etc.

3. **Use the 50/30/20 Rule**: Allocate 50% for needs, 30% for wants, and 20% for savings.

4. **Use Budgeting Apps**: Tools like Dirav can help you track spending automatically.

5. **Review Weekly**: Check your budget weekly to stay on track.

Remember, a budget isn't about restricting yourself - it's about understanding where your money goes so you can make informed decisions.`,
    author: 'Sarah Johnson',
    category: 'Budgeting',
    publishedAt: '2024-01-15T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
  },
  {
    id: 2,
    title: 'How to Save Money on Textbooks',
    content: `Textbooks can be a huge expense for students. Here are some ways to save:

1. **Buy Used**: Check your campus bookstore's used section or online marketplaces.

2. **Rent Instead of Buy**: Many services let you rent textbooks for the semester.

3. **Use the Library**: Your library may have copies available for short-term borrowing.

4. **Digital Versions**: E-books are often cheaper than physical copies.

5. **Share with Classmates**: Split the cost and share access to expensive textbooks.

6. **Wait for the First Class**: Sometimes professors say you don't need the textbook.`,
    author: 'Mike Chen',
    category: 'Saving Tips',
    publishedAt: '2024-01-10T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
  },
  {
    id: 3,
    title: 'Understanding Student Loans',
    content: `Student loans can be confusing. Here's what you need to know:

**Types of Loans:**
- Federal subsidized loans
- Federal unsubsidized loans
- Private loans

**Key Terms:**
- Principal: The amount you borrow
- Interest: The cost of borrowing
- Grace Period: Time after graduation before payments start

**Tips:**
1. Only borrow what you need
2. Understand your interest rates
3. Make payments while in school if possible
4. Look into loan forgiveness programs`,
    author: 'Dr. Emily Rodriguez',
    category: 'Financial Literacy',
    publishedAt: '2024-01-05T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
  },
  {
    id: 4,
    title: 'Building Credit as a Student',
    content: `Good credit is essential for your financial future. Start building it now:

1. **Get a Student Credit Card**: Many banks offer cards designed for students.

2. **Pay Bills on Time**: Payment history is the biggest factor in your credit score.

3. **Keep Utilization Low**: Try to use less than 30% of your credit limit.

4. **Don't Close Old Accounts**: Length of credit history matters.

5. **Check Your Credit Report**: You're entitled to free annual reports.

Building good credit now will help you when it's time to rent an apartment, buy a car, or apply for other loans.`,
    author: 'James Wilson',
    category: 'Credit',
    publishedAt: '2024-01-02T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
  },
];

const mockOpportunities: Opportunity[] = [
  {
    id: 1,
    title: 'Spotify Student Discount',
    description: 'Get Spotify Premium, Hulu, and SHOWTIME for just $5.99/month with a valid student email.',
    type: 'discount',
    eligibility: 'Must be enrolled at a US Title IV accredited college or university',
    link: 'https://www.spotify.com/student',
    deadline: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Gates Millennium Scholars Program',
    description: 'Full scholarship covering tuition, fees, books, and living expenses for outstanding minority students.',
    type: 'scholarship',
    eligibility: 'Must be African American, American Indian/Alaska Native, Asian Pacific Islander American, or Hispanic American',
    link: 'https://gmsp.org',
    deadline: '2024-09-15',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    title: 'Amazon Prime Student',
    description: '6-month free trial of Prime, then 50% off the regular price. Includes free shipping, streaming, and more.',
    type: 'discount',
    eligibility: 'Valid .edu email address required',
    link: 'https://www.amazon.com/primestudent',
    deadline: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    title: 'Google Summer Internship',
    description: 'Paid internship opportunity at Google. Great for CS and related majors.',
    type: 'opportunity',
    eligibility: 'Currently enrolled in a degree program in Computer Science or related field',
    link: 'https://careers.google.com/students',
    deadline: '2024-02-28',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    title: 'Dell Student Discount',
    description: 'Save up to 10% on laptops and accessories with student verification.',
    type: 'discount',
    eligibility: 'Valid student ID or .edu email',
    link: 'https://www.dell.com/learn/us/en/6099/campaigns/advantage-students',
    deadline: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    title: 'Fulbright U.S. Student Program',
    description: 'Grants for graduate study, research, or teaching assistantship abroad.',
    type: 'scholarship',
    eligibility: 'U.S. citizens, recent graduates or enrolled students',
    link: 'https://us.fulbrightonline.org',
    deadline: '2024-10-10',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Auth Service
export const authService = {
  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    await delay(500);
    
    // Simulate login - accept any credentials for demo
    mockUser = {
      id: 1,
      email: input.email,
      fullName: 'Demo User',
      createdAt: new Date().toISOString(),
    };
    mockToken = 'mock-jwt-token-' + Date.now();
    
    return { user: mockUser, token: mockToken };
  },

  async register(input: RegisterInput): Promise<{ user: User; token: string }> {
    await delay(500);
    
    mockUser = {
      id: 1,
      email: input.email,
      fullName: input.fullName,
      createdAt: new Date().toISOString(),
    };
    mockToken = 'mock-jwt-token-' + Date.now();
    
    return { user: mockUser, token: mockToken };
  },

  async logout(): Promise<void> {
    await delay(200);
    mockUser = null;
    mockToken = null;
  },

  getCurrentUser(): User | null {
    return mockUser;
  },
};

// Transaction Service
export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    await delay(300);
    return [...mockTransactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  async createTransaction(input: TransactionInput): Promise<Transaction> {
    await delay(300);
    const newTransaction: Transaction = {
      id: mockTransactions.length + 1,
      userId: 1,
      ...input,
      createdAt: new Date().toISOString(),
    };
    mockTransactions.push(newTransaction);
    return newTransaction;
  },

  async deleteTransaction(id: number): Promise<void> {
    await delay(200);
    mockTransactions = mockTransactions.filter(t => t.id !== id);
  },

  async getBalance(): Promise<Balance> {
    await delay(200);
    const totalIncome = mockTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = mockTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  },
};

// Budget Service
export const budgetService = {
  async getBudgets(): Promise<Budget[]> {
    await delay(300);
    return [...mockBudgets];
  },

  async createBudget(input: BudgetInput): Promise<Budget> {
    await delay(300);
    const newBudget: Budget = {
      id: mockBudgets.length + 1,
      userId: 1,
      ...input,
      createdAt: new Date().toISOString(),
    };
    mockBudgets.push(newBudget);
    return newBudget;
  },

  async updateBudget(id: number, input: BudgetInput): Promise<Budget> {
    await delay(300);
    const index = mockBudgets.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Budget not found');
    
    mockBudgets[index] = { ...mockBudgets[index], ...input };
    return mockBudgets[index];
  },

  async deleteBudget(id: number): Promise<void> {
    await delay(200);
    mockBudgets = mockBudgets.filter(b => b.id !== id);
  },
};

// Goals Service
export const goalService = {
  async getGoals(): Promise<SavingGoal[]> {
    await delay(300);
    return [...mockGoals];
  },

  async createGoal(input: SavingGoalInput): Promise<SavingGoal> {
    await delay(300);
    const newGoal: SavingGoal = {
      id: mockGoals.length + 1,
      userId: 1,
      ...input,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    };
    mockGoals.push(newGoal);
    return newGoal;
  },

  async updateGoal(id: number, input: Partial<SavingGoal>): Promise<SavingGoal> {
    await delay(300);
    const index = mockGoals.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Goal not found');
    
    mockGoals[index] = { ...mockGoals[index], ...input };
    return mockGoals[index];
  },

  async contributeToGoal(id: number, amount: number): Promise<SavingGoal> {
    await delay(300);
    const index = mockGoals.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Goal not found');
    
    mockGoals[index].currentAmount += amount;
    return mockGoals[index];
  },

  async deleteGoal(id: number): Promise<void> {
    await delay(200);
    mockGoals = mockGoals.filter(g => g.id !== id);
  },
};

// Blog Service
export const blogService = {
  async getPosts(): Promise<BlogPost[]> {
    await delay(300);
    return [...mockBlogPosts];
  },

  async getPost(id: number): Promise<BlogPost | undefined> {
    await delay(200);
    return mockBlogPosts.find(p => p.id === id);
  },
};

// Opportunity Service
export const opportunityService = {
  async getOpportunities(): Promise<Opportunity[]> {
    await delay(300);
    return [...mockOpportunities];
  },

  async getOpportunity(id: number): Promise<Opportunity | undefined> {
    await delay(200);
    return mockOpportunities.find(o => o.id === id);
  },

  async getOpportunitiesByType(type: Opportunity['type']): Promise<Opportunity[]> {
    await delay(300);
    return mockOpportunities.filter(o => o.type === type);
  },
};

// AI Advice Service
export const adviceService = {
  async getAdvice(): Promise<AdviceResponse> {
    await delay(500);
    
    const totalIncome = mockTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = mockTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    // Calculate category breakdown
    const categoryBreakdown: Record<string, number> = {};
    mockTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });

    // Generate advice based on spending patterns
    const advice: string[] = [];
    const recommendations: string[] = [];

    if (savingsRate < 10) {
      advice.push('⚠️ Your savings rate is below 10%. Try to save at least 20% of your income.');
    } else if (savingsRate < 20) {
      advice.push('📈 You\'re saving, but aim for 20% or more for better financial security.');
    } else {
      advice.push('✅ Great job! You\'re saving a healthy portion of your income.');
    }

    if (mockBudgets.length > 0) {
      const budget = mockBudgets[0];
      if (totalExpense > budget.amount) {
        advice.push(`🚨 You've exceeded your budget by $${(totalExpense - budget.amount).toFixed(2)}. Review your expenses.`);
      } else {
        advice.push(`💪 You're under budget! Consider putting the extra $${(budget.amount - totalExpense).toFixed(2)} into savings.`);
      }
    }

    if (categoryBreakdown['Food'] && categoryBreakdown['Food'] > totalExpense * 0.3) {
      recommendations.push('📍 High food spending detected: Consider meal prepping to save on food costs.');
    }

    if (categoryBreakdown['Entertainment'] && categoryBreakdown['Entertainment'] > totalExpense * 0.15) {
      recommendations.push('📍 High entertainment spending: Take advantage of free campus events.');
    }

    // Add general recommendations
    recommendations.push('💡 Set up an emergency fund with 3-6 months of expenses');
    recommendations.push('💡 Review and cancel unused subscriptions');
    recommendations.push('💡 Look for student discounts wherever you shop');
    recommendations.push('💡 Use the Opportunity Hub to find scholarships and deals');

    return {
      advice: advice.slice(0, 5),
      spendingAnalysis: {
        totalIncome,
        totalExpense,
        balance,
        savingsRate,
        categoryBreakdown,
      },
      recommendations: recommendations.slice(0, 5),
    };
  },
};

// Category options for transactions
export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Education',
  'Shopping',
  'Health',
  'Utilities',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Allowance',
  'Part-time',
  'Scholarship',
  'Gifts',
  'Freelance',
  'Other',
];
