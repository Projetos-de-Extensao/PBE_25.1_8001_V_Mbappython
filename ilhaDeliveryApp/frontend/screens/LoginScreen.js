import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.4:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();

if (response.ok) {
  Alert.alert('Sucesso', data.message);
  await AsyncStorage.setItem('cliente_id', data.cliente_id);
  navigation.reset({
    index: 0,
    routes: [{ name: 'AppTabs' }],
  });
}
 else {
        Alert.alert('Erro', data.error || 'Falha ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Erro na conexão com o servidor');
    }
  };

  return (
    <View style={styles.container}>
    
      <Text style={styles.label}>CPF:</Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} secureTextEntry />
      
      <Text style={styles.label}>Senha:</Text>
      <TextInput style={styles.input} value={senha} onChangeText={setSenha} />
      <Button title="Entrar" onPress={handleLogin} />

      <Text style={{ color: 'blue', marginTop: 20 }} onPress={() => navigation.navigate('Cadastro')}>
        Não tem conta? Cadastre-se
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  label: { fontSize: 18, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
