import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.16.6.231:8000/api';

export default function ListarPedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarPedidos = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access');
      const response = await axios.get(`${API_URL}/pedidos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPedidos(response.data);
    } catch (error) {
      Alert.alert('Erro ao buscar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pedidoButton}
      onPress={() => navigation.navigate('DetalhesPedido', { pedidoId: item.id })}
    >
      <Text style={styles.pedidoText}>Pedido #{item.id} - Cliente: {item.cliente.nome}</Text>
      <Text>Status: {item.status}</Text>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  pedidoButton: {
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  pedidoText: { fontWeight: 'bold', fontSize: 16 },
});
