import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTeelfone] = useState('');
  const [senha, setSenha] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [ilha, setIlha] = useState('');

const handleCadastro = async () => {
  try {
    const response = await fetch('http://192.168.15.3:8000/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome, cpf, telefone, rua, numero, cidade, estado, cep, ilha, senha
      })
    });

    let data = {};
    try {
      data = await response.json();
    } catch (e) {
      // Se não for JSON, ignora
    }

    if (response.ok) {
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        { text: 'Ir para Login', onPress: () => navigation.navigate('Login') },
      ]);
      // Limpa os campos após sucesso
      setNome('');
      setCpf('');
      setTeelfone('');
      setSenha('');
      setRua('');
      setNumero('');
      setCidade('');
      setEstado('');
      setCep('');
      setIlha('');
    } else {
      Alert.alert('Erro', data.error || 'Erro ao cadastrar');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Erro', 'Erro de rede');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="telefone"
        value={telefone}
        onChangeText={setTeelfone}
        keyboardType="numeric"
      />
      <TextInput
      style={styles.input}
      placeholder="rua"
      value={rua}
      onChangeText={setRua}
      />
      <TextInput
      style={styles.input}
      placeholder="numero"
      value={numero}
      onChangeText={setNumero}
      />
      <TextInput
      style={styles.input}
      placeholder="cidade"
      value={cidade}
      onChangeText={setCidade}
      />
      <TextInput
      style={styles.input}
      placeholder="estado"
      value={estado}
      onChangeText={setEstado}
      />
      <TextInput
      style={styles.input}
      placeholder="cep"
      value={cep}
      onChangeText={setCep}
      />
      <TextInput
      style={styles.input}
      placeholder="ilha"
      value={ilha}
      onChangeText={setIlha}
      />
      <TextInput
        style={styles.input}
        placeholder="senha"
        value={senha}
        onChangeText={setSenha}
      />

      <Button title="Cadastrar" onPress={handleCadastro} />
      <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        Já tem conta? Faça login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  loginLink: { marginTop: 20, textAlign: 'center', color: 'blue' },
});
