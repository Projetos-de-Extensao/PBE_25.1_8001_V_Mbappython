// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { View } from 'react-native';
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScren'; 
// import GestaoClientes from './screens/gestaoClientes';
// import PerfilScreen from './screens/PerfilScreen';
// import Icon from 'react-native-vector-icons/Feather'; 
// import CadastroScreen from './screens/CadastroScreen';
// import PedidoScreen from './screens/PedidoScreen';
// import PedidosScreeen from './screens/PedidosScreen'
// import DetalhesPedido from './screens/DetalhesPedidoScreen_new';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();


// function AppTabs() {
//   return (
//     <View style={{ flex: 1, backgroundColor: '#fff' }}>
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           headerShown: false,
//           tabBarShowLabel: false,
//           tabBarStyle: {
//             position: 'absolute',
//             bottom: 20,
//             left: 20,
//             right: 20,
//             backgroundColor: '#99d6ff', 
//             borderRadius: 30,
//             height: 70,
//             borderTopWidth: 0,
//             elevation: 5,
//             shadowColor: '#000',
//             shadowOpacity: 0.1,
//             shadowOffset: { width: 0, height: 5 },
//             shadowRadius: 10,
//           },
//           tabBarIcon: ({ focused, color, size }) => {
//             let iconName;

//             if (route.name === 'Home') {
//               iconName = 'menu';
//             } else if (route.name === 'Clientes') {
//               iconName = 'user';
//             } else if (route.name === 'Perfil') {
//               iconName = 'settings';
//             } else if (route.name == 'Pedido'){
//               iconName = 'plus';
//             } else if (route.name == 'Pedidos'){
//               iconName = 'calendar';
//             }


//             return (
//               <Icon
//                 name={iconName}
//                 size={24}
//                 color={focused ? '#fff' : '#2c3e50'}
//               />
//             );
//           },
//         })}
//       >
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Pedidos" component={PedidosScreeen} />
//         <Tab.Screen name="Pedido" component={PedidoScreen} />
//         <Tab.Screen name="Perfil" component={PerfilScreen} />
//       </Tab.Navigator>
//     </View>
//   );
// }



// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Cadastro" component={CadastroScreen} />
//         <Stack.Screen name="DetalhesPedido" component={DetalhesPedido} />
//         <Stack.Screen name="Login" component={LoginScreen}/>
//         <Stack.Screen name="AppTabs" component={AppTabs} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


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
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Ilha Delivery</Text>
      <Button title="Entrar como Cliente" onPress={() => navigation.navigate('Login')} />
      <View style={{ height: 20 }} />
      <Button title="Entrar como Operador" onPress={() => navigation.navigate('OperadorLogin')} />
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 40, fontWeight: 'bold' },
});
