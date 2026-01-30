import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { FinancesProvider } from './src/context/FinancesContext';
import {
  DashboardScreen,
  PlanningScreen,
  SavingsScreen,
  OpportunitiesScreen,
  AIAdvisorScreen,
  BlogsScreen,
} from './src/screens';
import colors from './src/constants/colors';

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Planning':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Savings':
              iconName = focused ? 'cash' : 'cash-outline';
              break;
            case 'Opportunities':
              iconName = focused ? 'sparkles' : 'sparkles-outline';
              break;
            case 'AI Advisor':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Blogs':
              iconName = focused ? 'book' : 'book-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.bgMain,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: colors.textMain,
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Planning" component={PlanningScreen} />
      <Tab.Screen name="Savings" component={SavingsScreen} />
      <Tab.Screen name="Opportunities" component={OpportunitiesScreen} />
      <Tab.Screen 
        name="AI Advisor" 
        component={AIAdvisorScreen}
        options={{
          tabBarLabel: 'AI',
        }}
      />
      <Tab.Screen name="Blogs" component={BlogsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <FinancesProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar style="dark" />
            <MainTabs />
          </View>
        </NavigationContainer>
      </FinancesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
    paddingTop: 50, // Safe area for status bar
  },
});
