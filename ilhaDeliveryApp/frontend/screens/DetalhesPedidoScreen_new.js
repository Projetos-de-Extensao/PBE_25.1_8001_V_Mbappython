import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.15.3:8000/api';

export default function DetalhesPedido({ route }) {
  const navigation = useNavigation();
  const { pedidoId } = route.params;
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  const buscarPedido = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      const response = await fetch(`${API_URL}/pedidos/${pedidoId}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPedido(data);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do pedido.');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      Alert.alert('Erro', 'Erro na conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedido();

    // 🔄 Adicionando o intervalo para atualizar automaticamente
    const interval = setInterval(() => {
      buscarPedido();
    }, 5000); // Atualiza a cada 5 segundos

    const unsubscribe = navigation.addListener('focus', buscarPedido);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [navigation, pedidoId]);

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

  const totalProdutos = pedido.produtos
    ? pedido.produtos.reduce(
        (total, p) => total + p.preco_unitario * p.quantidade,
        0
      )
    : 0;
  const frete = pedido.frete || 0;
  const totalGeral = totalProdutos + frete;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedido #{pedido.id}</Text>
        <Text
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                pedido.status === 'ENT'
                  ? '#4CAF50'
                  : pedido.status === 'CAN'
                  ? '#f44336'
                  : '#fff',
              color:
                pedido.status === 'ENT' || pedido.status === 'CAN'
                  ? '#fff'
                  : '#333',
            },
          ]}
        >
          {formatarStatus(pedido.status)}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Informações do Pedido</Text>
        <Text>Origem: {pedido.origem}</Text>
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

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Custos</Text>
        <Text>Total dos Produtos: R$ {totalProdutos.toFixed(2)}</Text>
        <Text>Frete: R$ {frete.toFixed(2)}</Text>
        <Text style={{ fontWeight: 'bold', marginTop: 5 }}>
          Total Geral: R$ {totalGeral.toFixed(2)}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Produtos</Text>
        {pedido.produtos && pedido.produtos.length > 0 ? (
          pedido.produtos.map((produto, index) => (
            <View key={index} style={styles.produto}>
              <Text style={styles.produtoTitle}>{produto.nome_produto}</Text>
              <Text>Quantidade: {produto.quantidade}</Text>
              <Text>
                Preço Unitário: R${' '}
                {produto.preco_unitario
                  ? produto.preco_unitario.toFixed(2)
                  : 'N/A'}
              </Text>
              <Text style={styles.produtoDesc}>{produto.descricao}</Text>
              <Text style={styles.produtoLink}>{produto.link}</Text>
            </View>
          ))
        ) : (
          <Text>Nenhum produto neste pedido</Text>
        )}
      </View>

      <View style={styles.actions}>
        <Button
          title="Voltar para Pedidos"
          onPress={() => navigation.navigate('AppTabs', { screen: 'Pedidos' })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  header: {
    backgroundColor: '#0066cc',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 'bold',
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  produto: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  produtoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  produtoDesc: {
    marginTop: 5,
    color: '#666',
  },
  produtoLink: {
    marginTop: 5,
    color: '#0066cc',
    fontSize: 12,
  },
  actions: {
    margin: 20,
  },
});
