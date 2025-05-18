import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.4:8000/api';

export default function DetalhesPedido({ route }) {
  const { pedidoId } = route.params;
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarPedido = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/pedidos/${pedidoId}`); // Você deve criar essa rota no backend para retornar 1 pedido pelo id
      setPedido(response.data);
    } catch (error) {
      Alert.alert('Erro ao buscar detalhes do pedido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedido();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;

  if (!pedido) return <Text style={styles.container}>Nenhum pedido encontrado.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pedido #{pedido.id}</Text>
      <Text style={styles.subTitle}>Cliente: {pedido.cliente.nome}</Text>
      <Text>Status: {pedido.status}</Text>
      <Text>Data do pedido: {new Date(pedido.created_at).toLocaleString()}</Text>

      <Text style={styles.sectionTitle}>Produtos Solicitados:</Text>
{pedido.produtos_solicitados && pedido.produtos_solicitados.length > 0 ? (
  pedido.produtos_solicitados.map((produto, index) => (
    <View key={index} style={styles.produto}>
      <Text>Produto: {produto.nome}</Text>
      <Text>Quantidade: {produto.quantidade}</Text>
      <Text>Preço Unitário: R$ {produto.preco_unitario}</Text>
    </View>
  ))
) : (
  <Text>Nenhum produto solicitado.</Text>
)}


      {/* Aqui você pode colocar outros dados do pedido conforme o seu serializer */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { fontSize: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  produto: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 10 },
});


