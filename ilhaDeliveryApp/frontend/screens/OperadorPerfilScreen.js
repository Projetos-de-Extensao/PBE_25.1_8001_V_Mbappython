import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OperadorPerfilScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('operador_access');
    await AsyncStorage.removeItem('operador_id');
    await AsyncStorage.removeItem('operador_turno');
    Alert.alert('Logout', 'Logout realizado com sucesso!');
    navigation.reset({
      index: 0,
      routes: [{ name: 'OperadorLogin' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Operador</Text>
      <Button title="Sair" onPress={handleLogout} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 40, fontWeight: 'bold' },
});
