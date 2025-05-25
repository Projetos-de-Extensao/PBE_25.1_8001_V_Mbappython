

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Button, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Telas Cliente
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScren';
import GestaoClientes from './screens/gestaoClientes';
import PerfilScreen from './screens/PerfilScreen';
import CadastroScreen from './screens/CadastroScreen';
import PedidoScreen from './screens/PedidoScreen';
import PedidosScreeen from './screens/PedidosScreen';
import DetalhesPedido from './screens/DetalhesPedidoScreen_new';

// Telas Operador
import OperadorLoginScreen from './screens/OperadorLoginScreen';
import OperadorPedidosScreen from './screens/OperadorPedidosScreen';
import OperadorDetalhesPedidoScreen from './screens/OperadorDetalhesPedidoScreen';
import OperadorPerfilScreen from './screens/OperadorPerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: '#99d6ff',
            borderRadius: 30,
            height: 70,
            borderTopWidth: 0,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 10,
          },
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'menu';
            else if (route.name === 'Pedidos') iconName = 'calendar';
            else if (route.name === 'Pedido') iconName = 'plus';
            else if (route.name === 'Perfil') iconName = 'settings';

            return (
              <Icon
                name={iconName}
                size={24}
                color={focused ? '#fff' : '#2c3e50'}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Pedidos" component={PedidosScreeen} />
        <Tab.Screen name="Pedido" component={PedidoScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
      </Tab.Navigator>
    </View>
  );
}

function OperadorTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: '#99d6ff',
            borderRadius: 30,
            height: 70,
            borderTopWidth: 0,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 10,
          },
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === 'OperadorPedidos') iconName = 'calendar';
            else if (route.name === 'OperadorPerfil') iconName = 'user';

            return (
              <Icon
                name={iconName}
                size={24}
                color={focused ? '#fff' : '#2c3e50'}
              />
            );
          },
        })}
      >
        <Tab.Screen name="OperadorPedidos" component={OperadorPedidosScreen} />
        <Tab.Screen name="OperadorPerfil" component={OperadorPerfilScreen} />
      </Tab.Navigator>
    </View>
  );
}

function OperadorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OperadorTabs" component={OperadorTabs} />
      <Stack.Screen name="OperadorDetalhesPedido" component={OperadorDetalhesPedidoScreen} />
    </Stack.Navigator>
  );
}

function TelaInicial({ navigation }) {
  return (
    <View style={styles.containerInicial}>
      <View style={styles.logoContainer}>
        <Icon name="shopping-bag" size={60} color="#0077b6" style={{ marginBottom: 10 }} />
        <Text style={styles.brand}>Ilha Delivery</Text>
      </View>
      <Text style={styles.slogan}>Seu delivery rápido, moderno e seguro</Text>
      <View style={styles.buttonGroup}>
        <View style={styles.shadowButton}>
          <Button
            title="Entrar como Cliente"
            color="#0077b6"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
        <View style={{ height: 20 }} />
        <View style={styles.shadowButton}>
          <Button
            title="Entrar como Operador"
            color="#00b4d8"
            onPress={() => navigation.navigate('OperadorLogin')}
          />
        </View>
      </View>
      <View style={styles.waveContainer}>
        <View style={styles.wave1} />
        <View style={styles.wave2} />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={TelaInicial} />

        {/* Cliente */}
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="DetalhesPedido" component={DetalhesPedido} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AppTabs" component={AppTabs} />

        {/* Operador */}
        <Stack.Screen name="OperadorLogin" component={OperadorLoginScreen} />
        <Stack.Screen name="OperadorStack" component={OperadorStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  containerInicial: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0077b6',
    letterSpacing: 2,
    marginBottom: 5,
  },
  slogan: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  shadowButton: {
    width: '90%',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: '#fff',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  wave1: {
    position: 'absolute',
    bottom: 0,
    width: '120%',
    height: 80,
    backgroundColor: '#90e0ef',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    opacity: 0.7,
    zIndex: 1,
  },
  wave2: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#00b4d8',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    opacity: 0.9,
    zIndex: 2,
  },
});
