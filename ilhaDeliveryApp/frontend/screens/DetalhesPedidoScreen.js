import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.0.4:8000/api';

export default function DetalhesPedido({ route }) {
  const navigation = useNavigation();
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
    <View style={{ marginBottom: 10 }}>
      <Button title="Voltar" onPress={() => navigation.navigate('AppTabs', { screen: 'Pedidos' })} />
    </View>

    <Text style={styles.title}>Pedido #{pedido.id}</Text>
    {/* Como cliente é só um id, exibir como está */}
    <Text style={styles.subTitle}>Cliente ID: {pedido.cliente}</Text>
    {/* Status e created_at não existem, então pode remover ou mostrar um texto padrão */}
    <Text>Status: {pedido.status ?? 'Não informado'}</Text>
    <Text>Data do pedido: {pedido.created_at ? new Date(pedido.created_at).toLocaleString() : 'Não informado'}</Text>

    <Text style={styles.sectionTitle}>Produtos Solicitados:</Text>
    {pedido.produtos && pedido.produtos.length > 0 ? (
      pedido.produtos.map((produto, index) => (
        <View key={index} style={styles.produto}>
          <Text>Produto: {produto.nome_produto}</Text>
          <Text>Quantidade: {produto.quantidade}</Text>
          {/* Preço não existe na API, então não exibe ou exibe um placeholder */}
          <Text>Preço Unitário: {produto.preco_unitario ? `R$ ${produto.preco_unitario}` : 'Não informado'}</Text>
          {/* Pode mostrar mais dados se quiser */}
          <Text>Descrição: {produto.descricao}</Text>
          <Text>Link: {produto.link}</Text>
        </View>
      ))
    ) : (
      <Text>Nenhum produto solicitado.</Text>
    )}
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

