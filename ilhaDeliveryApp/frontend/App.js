// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { View, Text } from 'react-native';
// import GestaoClientes from './screens/gestaoClientes';
// import HomeScreen from './screens/HomeScren';

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator screenOptions={{ headerShown: false }}>
//         <Tab.Screen name="Início" component={HomeScreen} />
//         <Tab.Screen name="Produtos" component={GestaoClientes} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScren'; // sua tela principal

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}




// App.js
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScren';
// import GestaoClientes from './screens/gestaoClientes';

// const Stack = createNativeStackNavigator();

// function AppRoutes() {
//   const { usuario } = useAuth();

//   return (
// <NavigationContainer>
//   <Stack.Navigator>
//     {usuario ? (
//       <>
//         <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
//         <Stack.Screen name="Produtos" component={GestaoClientes} />
//       </>
//     ) : (
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{ headerShown: false }}
//       />
//     )}
//   </Stack.Navigator>
// </NavigationContainer>

//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <AppRoutes />
//     </AuthProvider>
//   );
// }
