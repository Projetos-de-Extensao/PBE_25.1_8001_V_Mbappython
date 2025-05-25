import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.4:8000/api';

export default function OperadorPedidosScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [filtroTodos, setFiltroTodos] = useState(false);

  const buscarPedidos = async () => {
    try {
      const token = await AsyncStorage.getItem('operador_access');
      let url = filtroTodos
        ? `${API_URL}/operador/pedidos/`
        : `${API_URL}/operador/pedidos/pendentes/`;
      const response = await fetch(url, {
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
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, [filtroTodos]);

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

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        <Text
          style={{
            marginRight: 16,
            color: !filtroTodos ? '#007bff' : '#888',
            fontWeight: !filtroTodos ? 'bold' : 'normal',
            textDecorationLine: !filtroTodos ? 'underline' : 'none',
          }}
          onPress={() => setFiltroTodos(false)}
        >
          Apenas abertos
        </Text>
        <Text
          style={{
            color: filtroTodos ? '#007bff' : '#888',
            fontWeight: filtroTodos ? 'bold' : 'normal',
            textDecorationLine: filtroTodos ? 'underline' : 'none',
          }}
          onPress={() => setFiltroTodos(true)}
        >
          Todos
        </Text>
      </View>
      {pedidos.length === 0 ? (
         <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
              Nenhum pedido pendente no momento.
          </Text>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshing={false}
          onRefresh={buscarPedidos}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
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
