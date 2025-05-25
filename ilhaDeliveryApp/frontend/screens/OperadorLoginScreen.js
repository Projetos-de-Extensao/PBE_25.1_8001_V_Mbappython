import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OperadorLoginScreen({ navigation }) {
  const [turno, setTurno] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.4:8000/api/operador/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turno, password: senha }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('operador_access', data.access);
        await AsyncStorage.setItem('operador_id', data.operador_id.toString());
        await AsyncStorage.setItem('operador_turno', data.turno);
        Alert.alert('Sucesso', 'Login realizado!');
        navigation.reset({
        index: 0,
        routes: [{ name: 'OperadorStack' }],
        });

      } else {
        Alert.alert('Erro', data.detail || 'Falha no login');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro na conexão');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Operador</Text>
      <TextInput
        style={styles.input}
        placeholder="Turno (ex: manha, tarde)"
        value={turno}
        onChangeText={setTurno}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});
