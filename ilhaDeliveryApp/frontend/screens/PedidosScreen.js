import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://192.168.0.38:8000/api';


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

    const unsubscribe = navigation.addListener('focus', buscarPedidos);

    const interval = setInterval(() => {
      buscarPedidos();
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigation]);


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pedidoButton}
      onPress={() => navigation.navigate('DetalhesPedido', { pedidoId: item.id })}
    >
      <View style={styles.pedidoHeader}>
        <Text style={styles.pedidoText}>Pedido #{item.id}</Text>
        <Text style={styles.pedidoData}>{item.data_pedido ? formatarData(item.data_pedido) : '--/--/----'}</Text>
      </View>
      <Text>Status: {item.status}</Text>
      <Text>Origem: {item.origem}</Text>
      <Text>Produtos: {item.produtos?.length || 0}</Text>
    </TouchableOpacity>
  );

  function formatarData(dataIso) {
    if (!dataIso) return '';
    const d = new Date(dataIso);
    if (isNaN(d)) return dataIso;
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

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
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
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
  logo: {
    width: 90,
    height: 90,
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center'
  },
  pedidoButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#000', // Borda preta
    padding: 18,
    marginBottom: 22,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pedidoText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
  },
  pedidoData: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 30,
    fontSize: 16
  }
});
