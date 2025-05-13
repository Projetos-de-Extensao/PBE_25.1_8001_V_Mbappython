import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20 }
});

// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useAuth } from '../context/AuthContext';

// export default function HomeScreen() {
//   const { logout } = useAuth();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Bem-vindo à Home!</Text>
//       <Button title="Sair" onPress={logout} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 24, marginBottom: 20 }
// });
