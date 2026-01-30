import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import { FinancesProvider } from './src/context/FinancesContext';
import {
  DashboardScreen,
  PlanningScreen,
  SavingsScreen,
  OpportunitiesScreen,
  AIAdvisorScreen,
  BlogsScreen,
  LoginScreen,
  RegisterScreen,
} from './src/screens';
import colors from './src/constants/colors';

SplashScreen.preventAutoHideAsync();

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFinances } from './src/context/FinancesContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgMain },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

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
          fontFamily: 'PlusJakartaSans-Medium',
        },
        headerStyle: {
          backgroundColor: colors.bgMain,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: colors.textMain,
          fontFamily: 'PlusJakartaSans-Bold',
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

function RootNavigator() {
  const { isAuthenticated } = useFinances();
  return isAuthenticated ? <MainTabs /> : <AuthStack />;
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'PlusJakartaSans-Regular': require('./assets/fonts/PlusJakartaSans-Regular.ttf'),
          'PlusJakartaSans-Medium': require('./assets/fonts/PlusJakartaSans-Medium.ttf'),
          'PlusJakartaSans-SemiBold': require('./assets/fonts/PlusJakartaSans-SemiBold.ttf'),
          'PlusJakartaSans-Bold': require('./assets/fonts/PlusJakartaSans-Bold.ttf'),
          'NotoSansArabic-Regular': require('./assets/fonts/NotoSansArabic-Regular.ttf'),
          'NotoSansArabic-Medium': require('./assets/fonts/NotoSansArabic-Medium.ttf'),
          'NotoSansArabic-SemiBold': require('./assets/fonts/NotoSansArabic-SemiBold.ttf'),
          'NotoSansArabic-Bold': require('./assets/fonts/NotoSansArabic-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <FinancesProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar style="dark" />
            <RootNavigator />
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
