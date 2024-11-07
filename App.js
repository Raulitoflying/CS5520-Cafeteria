import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Cart from './screen/Cart';
import Favorite from './screen/Favorite';
import History from './screen/History';
import Home from './screen/Home';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  function HomeStack() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeScreen" component={Home} />
      </Stack.Navigator>
    );
  }

  function HistoryStack() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="HistoryScreen" component={History} />
      </Stack.Navigator>
    );
  }

  function FavoriteStack() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="FavoriteScreen" component={Favorite} />
      </Stack.Navigator>
    );
  }

  function CartStack() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="CartScreen" component={Cart} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="History" component={HistoryStack} />
        <Tab.Screen name="Favorite" component={FavoriteStack} />
        <Tab.Screen name="Cart" component={CartStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
