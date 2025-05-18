import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function CriarPedido() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [link, setLink] = useState('');
  const [descricao, setDescricao] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleCriarPedido = async () => {
    if (!nome || !quantidade || !link || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const payload = {
      origem: 'app',
      produtos: [
        {
          nome,
          quantidade,
          link,
          descricao,
        },
      ],
    };

    try {
      setCarregando(true);

      const response = await fetch('http://192.168.0.4:8000/api/pedidos/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Token SEU_TOKEN_DO_CLIENTE', // se estiver usando autenticação
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Pedido criado com sucesso!');
        // Limpar campos
        setNome('');
        setQuantidade('');
        setLink('');
        setDescricao('');
      } else {
        console.log(data);
        Alert.alert('Erro', 'Erro ao criar pedido. Verifique os dados.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
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

      <Button
        title={carregando ? 'Enviando...' : 'Criar Pedido'}
        onPress={handleCriarPedido}
        disabled={carregando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
});
