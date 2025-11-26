import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/helpers';

// Home Stack
import HomeScreen from '../screens/home/HomeScreen';
import AddTransactionScreen from '../screens/transactions/AddTransactionScreen';

// Transaction Stack
import TransactionListScreen from '../screens/transactions/TransactionListScreen';

// Budget Screen
import BudgetScreen from '../screens/budget/BudgetScreen';

// Goals Screen
import GoalsScreen from '../screens/goals/GoalsScreen';

// More Stack
import MoreMenuScreen from '../screens/more/MoreMenuScreen';
import OpportunitiesScreen from '../screens/opportunities/OpportunitiesScreen';
import BlogScreen from '../screens/blog/BlogScreen';
import BlogPostScreen from '../screens/blog/BlogPostScreen';
import AdviceScreen from '../screens/advice/AdviceScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const TransactionStack = createStackNavigator();
const MoreStack = createStackNavigator();

// Home Stack Navigator
const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.white,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <HomeStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{ title: 'Add Transaction' }}
    />
  </HomeStack.Navigator>
);

// Transaction Stack Navigator
const TransactionStackNavigator: React.FC = () => (
  <TransactionStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.white,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <TransactionStack.Screen
      name="TransactionList"
      component={TransactionListScreen}
      options={{ title: 'Transactions' }}
    />
    <TransactionStack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{ title: 'Add Transaction' }}
    />
  </TransactionStack.Navigator>
);

// More Stack Navigator
const MoreStackNavigator: React.FC = () => (
  <MoreStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.white,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <MoreStack.Screen
      name="MoreMenu"
      component={MoreMenuScreen}
      options={{ title: 'More' }}
    />
    <MoreStack.Screen
      name="Opportunities"
      component={OpportunitiesScreen}
      options={{ headerShown: false }}
    />
    <MoreStack.Screen
      name="Blog"
      component={BlogScreen}
      options={{ headerShown: false }}
    />
    <MoreStack.Screen
      name="BlogPost"
      component={BlogPostScreen as React.ComponentType}
      options={{ title: 'Article' }}
    />
    <MoreStack.Screen
      name="Advice"
      component={AdviceScreen}
      options={{ title: 'AI Advisor' }}
    />
  </MoreStack.Navigator>
);

// Main Tab Navigator
const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Transactions':
              iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
              break;
            case 'Budget':
              iconName = focused ? 'pie-chart' : 'pie-chart-outline';
              break;
            case 'Goals':
              iconName = focused ? 'flag' : 'flag-outline';
              break;
            case 'More':
              iconName = focused ? 'menu' : 'menu-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.divider,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Transactions" component={TransactionStackNavigator} />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          headerShown: true,
          headerTitle: 'Budget',
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Saving Goals',
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <Tab.Screen name="More" component={MoreStackNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
