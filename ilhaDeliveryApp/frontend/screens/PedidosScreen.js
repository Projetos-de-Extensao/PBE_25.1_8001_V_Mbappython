import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.4:8000/api';

export default function ListarPedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarPedidos = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }      console.log("Buscando pedidos com token:", token);
        // Faz a requisição para a API
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        console.log("Erro na resposta:", response.status, response.statusText);
        
        // Tenta novamente sem a barra final se a primeira tentativa falhar
        if (response.status === 404) {
          console.log("Tentando novamente sem a barra final...");
          const retryResponse = await fetch(`${API_URL}/pedidos`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!retryResponse.ok) {
            console.log("Segunda tentativa também falhou:", retryResponse.status);
            throw new Error(`Erro na requisição: ${retryResponse.status}`);
          }
          
          const retryData = await retryResponse.json();
          console.log("Pedidos recebidos na segunda tentativa:", retryData);
          setPedidos(retryData);
          return;
        }
        
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      // Converte a resposta para JSON
      const data = await response.json();
      console.log("Pedidos recebidos:", data);
      
      // Atualiza o estado com os pedidos
      setPedidos(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
    
    // Configura um refresh dos pedidos quando a tela receber foco
    const unsubscribe = navigation.addListener('focus', () => {
      buscarPedidos();
    });
    
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pedidoButton}
      onPress={() => navigation.navigate('DetalhesPedido', { pedidoId: item.id })}
    >
      <Text style={styles.pedidoText}>Pedido #{item.id}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Origem: {item.origem}</Text>
      <Text>Produtos: {item.produtos?.length || 0}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seus Pedidos</Text>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={buscarPedidos}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Carregando pedidos...' : 'Você ainda não tem pedidos.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center'
  },
  pedidoButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pedidoText: { 
    fontWeight: 'bold', 
    fontSize: 18,
    marginBottom: 5 
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 30,
    fontSize: 16
  }
});
