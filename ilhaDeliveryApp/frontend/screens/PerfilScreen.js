import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function PerfilScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://192.168.15.3:8000/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message);
        navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
        });

      } else {
        Alert.alert('Erro', data.error || 'Falha ao fazer logout');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Erro na conexão com o servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>
      <Button title="Sair" onPress={handleLogout} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 30 },
});
