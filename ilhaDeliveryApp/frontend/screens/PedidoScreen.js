import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


export default function CriarPedido() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [link, setLink] = useState('');
  const [descricao, setDescricao] = useState('');
  const [origem, setOrigem] = useState('IFOOD');
  const [preco, setPreco] = useState('');
  const [carregando, setCarregando] = useState(false);
  

  const handleCriarPedido = async () => {
    if (!nome || !quantidade || !link || !preco) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }    try {
      setCarregando(true);
      
      const token = await AsyncStorage.getItem('access');
      console.log("Token recuperado:", token ? "Existe" : "Não existe");
      
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        setCarregando(false);
        return;
      }

      const payload = {
        origem: origem,
        produtos: [
          {
            nome_produto: nome,
            quantidade: parseInt(quantidade),
            link,
            descricao,
            preco_unitario: parseFloat(preco),
          },
        ],
      };
      console.log("Enviando payload:", JSON.stringify(payload));
      console.log("Authorization header:", `Bearer ${token}`);
      

      const response = await fetch('http://172.16.6.231:8000/api/pedidos/criar', {

        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Pedido criado com sucesso!');
        setNome('');
        setQuantidade('');
        setLink('');
        setDescricao('');
        setPreco('');
      } else {
        console.log(data);
        Alert.alert('Erro', data.erro || 'Erro ao criar pedido. Verifique os dados.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Topo azul com logo */}
      <View style={styles.topoAzul}>
        <Image source={require('../assets/logodelivery.png')} style={styles.logoGrande} resizeMode="contain" />
        <Text style={styles.nomeApp}>Ilha Delivery</Text>
      </View>
      <View style={styles.formCard}>
        <Text style={styles.title}>Novo Pedido</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do produto"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />
        <TextInput
          style={styles.input}
          placeholder="Link do produto"
          value={link}
          onChangeText={setLink}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
        <Picker
          selectedValue={origem}
          onValueChange={setOrigem}
          style={styles.input}>
          <Picker.Item label="iFood" value="IFOOD" />
          <Picker.Item label="Amazon" value="AMAZON" />
          <Picker.Item label="Mercado Livre" value="ML" />
          <Picker.Item label="Outro" value="OUTRO" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Preço do produto (R$)"
          keyboardType="decimal-pad"
          value={preco}
          onChangeText={setPreco}
        />
        <Button
          title={carregando ? 'Enviando...' : 'Criar Pedido'}
          onPress={handleCriarPedido}
          disabled={carregando}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 80, // Add padding at the bottom to ensure content doesn't hide under the bottom menu
  },
  topoAzul: {
    backgroundColor: '#77cbff',
    paddingTop: 40,
    paddingBottom: 18,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 0,
  },
  logoGrande: {
    width: 90,
    height: 90,
    marginBottom: 2,
  },
  nomeApp: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 2,
  },
  formCard: {
    backgroundColor: '#f6f6f6',
    borderRadius: 18,
    margin: 18,
    marginTop: 0,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    marginBottom: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  input: {
    borderColor: '#b3e0ff',
    borderWidth: 1.2,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 15,
  },
});
