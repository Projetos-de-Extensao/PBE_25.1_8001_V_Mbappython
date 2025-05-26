import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.15.3:8000/api';

export default function PedidosScreen() {
  const navigation = useNavigation();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarPedidos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access');
      const response = await fetch(`${API_URL}/pedidos`, {
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
    const unsubscribe = navigation.addListener('focus', buscarPedidos);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalhesPedido', { pedidoId: item.id })}
    >
      <Text style={styles.title}>Pedido #{item.id}</Text>
      <Text>Origem: {item.origem}</Text>
      <Text>Status: {formatarStatus(item.status)}</Text>
      <Text>Data de Criação: {new Date(item.data_criacao).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  const formatarStatus = (status) => {
    const statusMap = {
      SOL: 'Solicitado',
      AC: 'Aguardando Confirmação',
      CE: 'Cotação Enviada',
      PA: 'Pagamento Aprovado',
      AND: 'Em Andamento',
      ENT: 'Entregue',
      CAN: 'Cancelado',
    };
    return statusMap[status] || status;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={buscarPedidos} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum pedido encontrado.</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});
