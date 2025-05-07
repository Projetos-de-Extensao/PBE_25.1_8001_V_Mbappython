import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Switch } from 'react-native';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; 

export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [disponivel, setDisponivel] = useState(true);
  const [loading, setLoading] = useState(false);

  const buscarProdutos = async () => {
    setLoading(true);  
    try {
      const response = await axios.get(`${API_URL}/verProdutos`);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert('Erro ao buscar produtos');
    } finally {
      setLoading(false);
    }
  };


  const adicionarProduto = async () => {
    if (!nome || !preco || !descricao) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    try {
      await axios.post(`${API_URL}/addProduto`, {
        nome,
        preco: parseFloat(preco),
        descricao,
        disponivel
      });
      Alert.alert('Produto adicionado com sucesso!');
      setNome('');
      setPreco('');
      setDescricao('');
      setDisponivel(true);
      buscarProdutos(); 
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      Alert.alert('Erro ao adicionar produto');
    }
  };


  const excluirProduto = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteProduto/${id}`);
      console.log(response.data);
      Alert.alert('Produto excluído com sucesso!');
      
      setProdutos(produtos.filter((produto) => produto.id !== id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error.response ? error.response.data : error.message);
      Alert.alert('Erro ao excluir produto', error.response ? error.response.data.message : 'Erro desconhecido');
    }
  };
  
  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Adicionar Produto</Text>

          <TextInput
            placeholder="Nome do produto"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <TextInput
            placeholder="Preço"
            value={preco}
            onChangeText={setPreco}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            style={styles.input}
          />

          <View style={styles.switchContainer}>
            <Text>Disponível:</Text>
            <Switch
              value={disponivel}
              onValueChange={setDisponivel}
            />
          </View>

          <Button title="Adicionar" onPress={adicionarProduto} />
          <Text style={styles.title}>Produtos</Text>
        </>
      }
      data={produtos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.produto}>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text>R$ {item.preco}</Text>
          <Text>{item.descricao}</Text>
          <Text>{item.disponivel ? 'Disponível' : 'Indisponível'}</Text>
          <Button 
            title="Excluir" 
            onPress={() => excluirProduto(item.id)} 
            color="#d9534f" // cor vermelha para excluir
          />
        </View>
      )}
      ListFooterComponent={loading ? <Text>Carregando...</Text> : null} 
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    width: '100%',
    padding: 10,
    marginBottom: 10
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  produto: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6
  },
  produtoNome: {
    fontWeight: 'bold'
  }
});
