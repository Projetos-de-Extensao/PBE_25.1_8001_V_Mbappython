import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.15.3:8000/api';

export default function OperadorDetalhesPedidoScreen({ route, navigation }) {
  const { pedidoId } = route.params;
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataEntrega, setDataEntrega] = useState('');

  const buscarPedido = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('operador_access');
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPedido(data);
      } else {
        Alert.alert('Erro', 'Erro ao buscar detalhes do pedido');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedido();
    const unsubscribe = navigation.addListener('focus', buscarPedido);
    return unsubscribe;
  }, [navigation, pedidoId]);

  const enviarCotacao = async () => {
    const token = await AsyncStorage.getItem('operador_access');
    const response = await fetch(`${API_URL}/operador/pedido/${pedidoId}/enviar-cotacao/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data_entrega: dataEntrega }),
    });

    if (response.ok) {
      Alert.alert('Sucesso', 'Cotação enviada');
      buscarPedido();
    } else {
      Alert.alert('Erro', 'Erro ao enviar cotação');
    }
  };

  const atualizarStatus = async (status) => {
    const token = await AsyncStorage.getItem('operador_access');
    const response = await fetch(`${API_URL}/operador/pedido/${pedidoId}/atualizar-status/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      Alert.alert('Sucesso', 'Status atualizado');
      buscarPedido();
    } else {
      Alert.alert('Erro', 'Erro ao atualizar status');
    }
  };

  const finalizarPedido = async () => {
    const token = await AsyncStorage.getItem('operador_access');
    const response = await fetch(`${API_URL}/operador/pedido/${pedidoId}/finalizar/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      Alert.alert('Sucesso', 'Pedido finalizado');
      buscarPedido();
    } else {
      Alert.alert('Erro', 'Erro ao finalizar');
    }
  };

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Carregando detalhes do pedido...</Text>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Pedido não encontrado</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={buscarPedido} />
      }
    >
      <Text style={styles.title}>Pedido #{pedido.id}</Text>

      <View style={styles.infoCard}>
        <Text>Origem: {pedido.origem}</Text>
        <Text>Status: {formatarStatus(pedido.status)}</Text>
        <Text>
          Data de Criação:{' '}
          {pedido.data_criacao
            ? new Date(pedido.data_criacao).toLocaleString()
            : 'N/A'}
        </Text>
        <Text>
          Data Estimada de Entrega:{' '}
          {pedido.data_entrega_estimada
            ? new Date(pedido.data_entrega_estimada).toLocaleString()
            : 'Não definida'}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Data estimada entrega (opcional)"
        value={dataEntrega}
        onChangeText={setDataEntrega}
      />
      <Button title="Enviar Cotação" onPress={enviarCotacao} />

      <View style={styles.divider} />

      <Button
        title="Atualizar para ANDAMENTO"
        onPress={() => atualizarStatus('AND')}
      />
      <Button
        title="Atualizar para CANCELADO"
        onPress={() => atualizarStatus('CAN')}
      />

      <View style={styles.divider} />

      <Button
        title="Finalizar Pedido (ENTREGUE)"
        onPress={finalizarPedido}
        color="green"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  divider: { marginVertical: 10 },
  infoCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#cc0000',
    textAlign: 'center',
    marginVertical: 20,
  },
});
