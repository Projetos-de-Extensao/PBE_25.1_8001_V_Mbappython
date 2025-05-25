import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.4:8000/api';

export default function OperadorDetalhesPedidoScreen({ route, navigation }) {
  const { pedidoId } = route.params;
  const [dataEntrega, setDataEntrega] = useState('');
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
      <Text style={styles.title}>Pedido #{pedidoId}</Text>
      <Button
        title="← Voltar para pedidos"
        color="#007bff"
        onPress={() => navigation.goBack()}
      />
      {pedido && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações do Pedido</Text>
          <Text>Status: {pedido.status}</Text>
          <Text>Origem: {pedido.origem}</Text>
          <Text>Data de Criação: {pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleString() : 'N/A'}</Text>
          <Text>Data Estimada de Entrega: {pedido.data_entrega_estimada ? new Date(pedido.data_entrega_estimada).toLocaleString() : 'Não definida'}</Text>
          <Text>Cliente: {pedido.cliente_nome || pedido.cliente || 'N/A'}</Text>
        </View>
      )}
      {pedido && pedido.produtos && pedido.produtos.length > 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Produtos</Text>
          {pedido.produtos.map((produto, index) => (
            <View key={index} style={styles.produto}>
              <Text style={styles.produtoTitle}>{produto.nome_produto}</Text>
              <Text>Quantidade: {produto.quantidade}</Text>
              <Text>Preço: {produto.preco_unitario ? `R$ ${parseFloat(produto.preco_unitario).toFixed(2)}` : 'N/A'}</Text>
              <Text style={styles.produtoDesc}>{produto.descricao}</Text>
              <Text style={styles.produtoLink}>{produto.link}</Text>
            </View>
          ))}
        </View>
      )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  divider: { marginVertical: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  infoCard: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  produto: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#0066cc' },
  produtoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  produtoDesc: { marginTop: 5, color: '#666' },
  produtoLink: { marginTop: 5, color: '#0066cc', fontSize: 12 },
});
