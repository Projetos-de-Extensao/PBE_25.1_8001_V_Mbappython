import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.4:8000/api';

export default function OperadorDetalhesPedidoScreen({ route, navigation }) {
  const { pedidoId } = route.params;
  const [dataEntrega, setDataEntrega] = useState('');
  const [precoFinal, setPrecoFinal] = useState('');
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  const buscarPedido = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('operador_access');
      const response = await fetch(`${API_URL}/operador/pedido/${pedidoId}/detalhes/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Erro ao buscar detalhes do pedido');
      const data = await response.json();
      setPedido(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do pedido.');
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
    if (!precoFinal || isNaN(Number(precoFinal))) {
      Alert.alert('Erro', 'Informe o preço final (produto + frete) corretamente.');
      return;
    }
    const token = await AsyncStorage.getItem('operador_access');
    const response = await fetch(`${API_URL}/operador/pedido/${pedidoId}/enviar-cotacao/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data_entrega: dataEntrega, preco_final: precoFinal }),
    });

    if (response.ok) {
      Alert.alert('Sucesso', 'Cotação enviada');
      navigation.goBack();
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
      navigation.goBack();
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
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Erro ao finalizar');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Carregando detalhes do pedido...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedido #{pedidoId}</Text>
        {pedido && (
          <Text style={[styles.statusBadge, getStatusColor(pedido.status)]}>{pedido.status}</Text>
        )}
      </View>
      <Button
        title="← Voltar para pedidos"
        color="#007bff"
        onPress={() => navigation.goBack()}
      />
      {pedido && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações do Pedido</Text>
          <Text style={styles.infoText}>Origem: <Text style={{fontWeight:'bold'}}>{pedido.origem}</Text></Text>
          <Text style={styles.infoText}>Data de Criação: <Text style={{fontWeight:'bold'}}>{pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleString() : 'N/A'}</Text></Text>
          <Text style={styles.infoText}>Data Estimada de Entrega: <Text style={{fontWeight:'bold'}}>{pedido.data_entrega_estimada ? new Date(pedido.data_entrega_estimada).toLocaleString() : 'Não definida'}</Text></Text>
          <Text style={styles.infoText}>Cliente: <Text style={{fontWeight:'bold'}}>{pedido.cliente_nome || pedido.cliente || 'N/A'}</Text></Text>
        </View>
      )}
      {pedido && pedido.produtos && pedido.produtos.length > 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Produtos</Text>
          {pedido.produtos.map((produto, index) => (
            <View key={index} style={styles.produto}>
              <Text style={styles.produtoTitle}>{produto.nome_produto}</Text>
              <Text style={styles.produtoInfo}>Quantidade: <Text style={{fontWeight:'bold'}}>{produto.quantidade}</Text></Text>
              <Text style={styles.produtoInfo}>Preço: <Text style={{fontWeight:'bold'}}>{produto.preco_unitario ? `R$ ${parseFloat(produto.preco_unitario).toFixed(2)}` : 'N/A'}</Text></Text>
              <Text style={styles.produtoDesc}>{produto.descricao}</Text>
              <Text style={styles.produtoLink}>{produto.link}</Text>
            </View>
          ))}
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Preço final (produto + frete) em R$"
        value={precoFinal}
        onChangeText={setPrecoFinal}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Data estimada entrega (opcional)"
        value={dataEntrega}
        onChangeText={setDataEntrega}
      />
      <Button title="Enviar Cotação" onPress={enviarCotacao} />
      <View style={styles.divider} />
      <Button title="Atualizar para ANDAMENTO" onPress={() => atualizarStatus('AND')} />
      <Button title="Atualizar para CANCELADO" onPress={() => atualizarStatus('CAN')} />
      <View style={styles.divider} />
      <Button title="Finalizar Pedido (ENTREGUE)" onPress={finalizarPedido} color="green" />
    </ScrollView>
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
  container: { flex: 1, backgroundColor: '#f4f6fb', padding: 0 },
  header: {
    backgroundColor: '#fff',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  statusBadge: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  infoText: { fontSize: 15, color: '#555', marginBottom: 2 },
  produto: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#0066cc' },
  produtoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  produtoInfo: { fontSize: 14, color: '#444' },
  produtoDesc: { marginTop: 5, color: '#666' },
  produtoLink: { marginTop: 5, color: '#0066cc', fontSize: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  divider: { marginVertical: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
});
