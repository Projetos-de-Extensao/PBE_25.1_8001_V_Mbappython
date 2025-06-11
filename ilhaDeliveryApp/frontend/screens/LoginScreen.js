import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image, // Importar Image para o logo
  Dimensions, // Para pegar a largura da tela
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg'; // Importar Svg e Path para a forma de onda

// Importe seu logo aqui. Certifique-se de ter o arquivo do logo em assets/images/
// Por exemplo:
// import LogoImage from '../assets/images/logo_ilha_primeira_delivery.png';
// Se o logo for um SVG que você converteu para um componente React, importe-o assim:
// import IlhaPrimeiraDeliveryLogo from '../assets/images/ilhaPrimeiraDeliveryLogo.svg';
// Por simplicidade, vou usar um placeholder de Image. Você deve substituir pelo seu asset real.
const LogoImage = require('../assets/logodelivery.png'); // Adicione seu logo aqui


const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      console.log("Tentando login com CPF:", cpf);

      // Garante que o CPF esteja no formato correto (apenas números)
      const cpfLimpo = cpf.replace(/\D/g, '');
      console.log("CPF processado para envio:", cpfLimpo);

      const response = await fetch('http://172.16.6.231:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: cpfLimpo, password: senha }),
      });
      let data = {};
      try {
        data = await response.json();
        console.log("Resposta do login:", JSON.stringify(data));
      } catch (e) {
        // Se não for JSON, ignora e mostra erro genérico
        console.error("Erro ao processar resposta JSON:", e);
        Alert.alert('Erro', 'Resposta inesperada do servidor.');
        return;
      }
      if (response.ok && data.access) {
        console.log("Login bem sucedido, salvando token...");
        await AsyncStorage.setItem('access', data.access);
        await AsyncStorage.setItem('cliente_id', data.cliente_id.toString());

        // Verificar se o token foi salvo corretamente
        const savedToken = await AsyncStorage.getItem('access');
        console.log("Token salvo:", savedToken ? "Existe" : "Não existe");

        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'AppTabs' }],
        });
      } else {
        console.error("Erro no login:", data.detail || data.error || 'Falha ao fazer login');
        Alert.alert('Erro', data.detail || data.error || 'Falha ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Erro na conexão com o servidor');
    }
  };

  return (
    <View style={styles.fullContainer}>
      {/* Onda azul e branca no topo */}
      <View style={styles.topBackground}>
        <Svg
          height="200"
          width={width}
          viewBox={`0 0 ${width} 200`}
          style={styles.wave}
        >
          <Path
            d={`M0 0 H${width} V150 C${width * 0.75} 200, ${width * 0.25} 200, 0 150 L0 0 Z`}
            fill="#77cbff"
          />
        </Svg>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={LogoImage}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.logoText}>ILHA PRIMEIRA DELIVERY</Text>
      </View>

      {/* Conteúdo do login */}
      <View style={styles.loginContent}>
        <Text style={styles.loginTitle}>LOGIN</Text>

        <TextInput
          style={styles.input}
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          placeholder="CPF"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Senha"
          placeholderTextColor="#999"
        />
        <View style={styles.buttonWrapper}>
          <Button title="ENTRAR" onPress={handleLogin} color="#77cbff" />
        </View>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Inicio')}
        >
          Voltar para início
        </Text>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Cadastro')}
        >
          Não tem conta? Cadastre-se
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#fff', // Fundo branco abaixo da onda
  },
  topBackground: {
    height: 250,
    backgroundColor: '#77cbff',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  wave: {
    position: 'absolute',
    bottom: -1, // Evitar linha branca entre o SVG e o conteúdo
    left: 0,
    right: 0,
  },
  logoContainer: {
    position: 'absolute',
    top: 30, // Sobe a logo
    right: 30, // Joga a logo mais para a direita
    alignItems: 'flex-end',
    zIndex: 2,
  },
  logo: {
    width: 160, // Aumenta ainda mais a logo
    height: 160,
    marginBottom: 0,
  },
  logoText: {
    position: 'absolute',
    top: 40, // Sobe a frase
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
    zIndex: 3,
  },
  loginContent: {
    flex: 1,
    padding: 20,
    marginTop: -50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 70,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: 220,
    alignSelf: 'center',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonWrapper: {
    width: 220,
    alignSelf: 'center',
    marginBottom: 10,
  },
  link: {
    color: '#2196F3', // Azul padrão de link
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});