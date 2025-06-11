import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, ScrollView, Platform } from 'react-native';

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
      const response = await fetch('http://172.16.6.231:8000/api/cadastro', {
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
    <View style={styles.background}>
      <View style={styles.topBar}>
        <Image
          source={require('../assets/logodelivery.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>ILHA PRIMEIRA DELIVERY</Text>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formWrapper}>
          <Text style={styles.sectionTitle}>DADOS PESSOAIS</Text>
          <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTeelfone} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
          <View style={styles.fotoContainer}>
            <View style={styles.fotoCircle}>
              {/* Aqui pode ir um ícone de usuário */}
            </View>
            <Text style={styles.fotoText}>ADICIONAR FOTO</Text>
          </View>
          <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} />
          <TextInput style={styles.input} placeholder="Número" value={numero} onChangeText={setNumero} />
          <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
          <TextInput style={styles.input} placeholder="Estado" value={estado} onChangeText={setEstado} />
          <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={setCep} />
          <TextInput style={styles.input} placeholder="Ilha" value={ilha} onChangeText={setIlha} />
          <View style={styles.buttonWrapper}>
            <Button title="CADASTRAR" color="#4DB6FF" onPress={handleCadastro} />
          </View>
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            Já tem conta? Faça login
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff', // Fundo branco
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  topBar: {
    width: '100%',
    height: 110,
    backgroundColor: '#77cbff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 10,
    marginBottom: 10,
    position: 'relative',
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 30, // Adiciona espaço extra no final para garantir que o último elemento seja visível
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
    marginTop: 10,
  },
  logoText: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    marginTop: 10,
  },
  formWrapper: {
    backgroundColor: '#f4f4f4', // Cinza claro para o card de formulário
    borderRadius: 20,
    padding: 18,
    width: '92%',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#b3e0ff',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#222',
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#b3e0ff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff', // Inputs brancos
    width: '100%',
    fontSize: 15,
  },
  fotoContainer: {
    alignItems: 'center',
    marginVertical: 18,
  },
  fotoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#b3e0ff',
  },
  fotoText: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  loginLink: {
    marginTop: 10,
    textAlign: 'center',
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
