import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://172.16.6.231:8000/api';


export default function OperadorPedidosScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [statusFiltro, setStatusFiltro] = useState('TODOS'); // 'TODOS' mostra todos

  const buscarPedidos = async () => {
    try {
      const token = await AsyncStorage.getItem('operador_access');
      let url = `${API_URL}/operador/pedidos/`;
      if (statusFiltro !== 'TODOS') {
        url += `?status=${statusFiltro}`;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
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
    const interval = setInterval(buscarPedidos, 5000);
    return () => clearInterval(interval);
  }, [statusFiltro]);

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <Text style={styles.filterLabel}>Filtrar por Status:</Text>
        <Picker
          selectedValue={statusFiltro}
          style={styles.picker}
          onValueChange={(itemValue) => setStatusFiltro(itemValue)}
        >
          <Picker.Item label="Todos" value="TODOS" />
          <Picker.Item label="Solicitado" value="SOL" />
          <Picker.Item label="Cotação Enviada" value="CE" />
          <Picker.Item label="Pagamento Aprovado" value="PA" />
          <Picker.Item label="Em Andamento" value="AND" />
          <Picker.Item label="Entregue" value="ENT" />
          <Picker.Item label="Cancelado" value="CAN" />
        </Picker>
      </View>

      {pedidos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Nenhum pedido {statusFiltro === 'TODOS' ? 'encontrado' : `com status ${statusFiltro}`}.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('OperadorDetalhesPedido', { pedidoId: item.id })}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Pedido #{item.id}</Text>
                <Text style={[styles.statusBadge, getStatusColor(item.status)]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.cardSubtitle}>Origem: {item.origem}</Text>
              <Text style={styles.cardSubtitle}>Cliente: {item.cliente}</Text>
              <Text style={styles.cardDate}>
                {item.data_criacao ? new Date(item.data_criacao).toLocaleString() : 'N/A'}
              </Text>
            </TouchableOpacity>
          )}
          refreshing={false}
          onRefresh={buscarPedidos}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'SOL':
      return { backgroundColor: '#ff9800', color: '#fff' };
    case 'CE':
      return { backgroundColor: '#f39c12', color: '#fff' };
    case 'PA':
      return { backgroundColor: '#9b59b6', color: '#fff' };
    case 'AND':
      return { backgroundColor: '#2196f3', color: '#fff' };
    case 'ENT':
      return { backgroundColor: '#4caf50', color: '#fff' };
    case 'CAN':
      return { backgroundColor: '#f44336', color: '#fff' };
    default:
      return { backgroundColor: '#eee', color: '#333' };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fb' },
  filterBar: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: { fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  picker: { height: 50, flex: 1 },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  statusBadge: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  cardSubtitle: { fontSize: 15, color: '#555', marginBottom: 2 },
  cardDate: { fontSize: 13, color: '#aaa', marginTop: 4, textAlign: 'right' },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 17, color: '#888', textAlign: 'center' },
});
