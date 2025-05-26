import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.15.3:8000/api';

export default function OperadorPedidosScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarPedidos = async () => {
    try {
      const token = await AsyncStorage.getItem('operador_access');
      const response = await fetch(`${API_URL}/operador/pedidos/pendentes/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPedidos(data);
      } else {
        Alert.alert('Erro', 'Erro ao buscar pedidos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();

    const interval = setInterval(() => {
      buscarPedidos();
    }, 5000);

    const unsubscribe = navigation.addListener('focus', buscarPedidos);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OperadorDetalhesPedido', { pedidoId: item.id })}
    >
      <Text style={styles.title}>Pedido #{item.id}</Text>
      <Text>Origem: {item.origem}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={false}
        onRefresh={buscarPedidos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
});

