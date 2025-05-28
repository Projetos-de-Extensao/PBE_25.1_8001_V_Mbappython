import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.16.6.231:8000/api';

export default function OperadorPedidosScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosOriginais, setPedidosOriginais] = useState([]); // Guarda todos os pedidos
  const [filtroTodos, setFiltroTodos] = useState(false);
  const [filtroCliente, setFiltroCliente] = useState('');

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
        setPedidosOriginais(data); // Salva todos os pedidos
        setPedidos(data); // Exibe todos inicialmente
      } else {
        Alert.alert('Erro', 'Erro ao buscar pedidos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão');
    }
  };

  // Aplica filtro localmente sempre que filtroCliente mudar
  useEffect(() => {
    if (filtroCliente.trim() === '') {
      setPedidos(pedidosOriginais);
    } else {
      const filtro = filtroCliente.trim().toLowerCase();
      setPedidos(
        pedidosOriginais.filter((pedido) => {
          const nome = String(pedido.cliente_nome || pedido.cliente || '').toLowerCase();
          const cpf = String(pedido.cliente_cpf || '').toLowerCase();
          const endereco = String(pedido.origem || '').toLowerCase();
          return nome.includes(filtro) || cpf.includes(filtro) || endereco.includes(filtro);
        })
      );
    }
  }, [filtroCliente, pedidosOriginais]);

  useEffect(() => {
    buscarPedidos();
  }, [filtroTodos]);

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterButton, !filtroTodos && styles.filterButtonActive]}
          onPress={() => setFiltroTodos(false)}
        >
          <Text style={[styles.filterText, !filtroTodos && styles.filterTextActive]}>Abertos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filtroTodos && styles.filterButtonActive]}
          onPress={() => setFiltroTodos(true)}
        >
          <Text style={[styles.filterText, filtroTodos && styles.filterTextActive]}>Todos</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Filtrar por nome, CPF ou endereço do cliente"
        value={filtroCliente}
        onChangeText={setFiltroCliente}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {pedidos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Nenhum pedido {filtroTodos ? 'encontrado' : 'pendente no momento'}.
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
                <Text style={[styles.statusBadge, getStatusColor(item.status)]}>{item.status}</Text>
              </View>
              <Text style={styles.cardSubtitle}>Origem: <Text style={{fontWeight:'bold'}}>{item.origem}</Text></Text>
              <Text style={styles.cardSubtitle}>Cliente: <Text style={{fontWeight:'bold'}}>{(item.cliente_id ? `#${item.cliente_id} - ` : '')}{item.cliente_nome || item.cliente || '-'}</Text></Text>
              <Text style={styles.cardSubtitle}>CPF: <Text style={{fontWeight:'bold'}}>{item.cliente_cpf ? item.cliente_cpf : '-'}</Text></Text>
              <Text style={styles.cardDate}>{item.data_criacao ? new Date(item.data_criacao).toLocaleString() : 'N/A'}</Text>
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
    case 'SOL': return { backgroundColor: '#ff9800', color: '#fff' };
    case 'AND': return { backgroundColor: '#2196f3', color: '#fff' };
    case 'ENT': return { backgroundColor: '#4caf50', color: '#fff' };
    case 'CAN': return { backgroundColor: '#f44336', color: '#fff' };
    default: return { backgroundColor: '#eee', color: '#333' };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, backgroundColor: '#f4f6fb' },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  statusBadge: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 4,
    textAlign: 'right',
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 17,
    color: '#888',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});
