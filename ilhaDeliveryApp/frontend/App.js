import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Suas telas
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScren'; // sua tela principal
import GestaoClientes from './screens/gestaoClientes';
import PerfilScreen from './screens/PerfilScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Clientes" component={GestaoClientes} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AppTabs" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


