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
      console.log(`Buscando detalhes do pedido ${pedidoId}`);
      
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.log("Erro na resposta:", response.status, response.statusText);
        
        // Tenta novamente sem a barra final se a primeira tentativa falhar
        if (response.status === 404) {
          console.log("Tentando novamente sem a barra final...");
          const retryResponse = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!retryResponse.ok) {
            console.log("Segunda tentativa também falhou:", retryResponse.status);
            throw new Error(`Erro na requisição: ${retryResponse.status}`);
          }
          
          const retryData = await retryResponse.json();
          console.log("Detalhes do pedido na segunda tentativa:", retryData);
          setPedido(retryData);
          return;
        }
        
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Detalhes do pedido:", data);
      setPedido(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do pedido.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedido();
    
    // Adiciona um listener para recarregar os dados quando a tela receber foco
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Tela de detalhes recebeu foco, recarregando dados...');
      buscarPedido();
    });
    
    // Limpa o listener quando o componente é desmontado
    return unsubscribe;
  }, [navigation, pedidoId]);

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
        <Button 
          title="Voltar para Pedidos" 
          onPress={() => navigation.navigate('AppTabs', { screen: 'Pedidos' })} 
        />
      </View>
    );
  }

  // Função auxiliar para formatar o status do pedido
  const formatarStatus = (status) => {
    const statusMap = {
      'SOL': 'Solicitado',
      'AC': 'Aguardando Confirmação',
      'CE': 'Cotação Enviada',
      'PA': 'Pagamento Aprovado',
      'AND': 'Em Andamento',
      'ENT': 'Entregue',
      'CAN': 'Cancelado'
    };
    
    return statusMap[status] || status || 'Sem status';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedido #{pedido.id}</Text>
        <Text style={[
          styles.statusBadge, 
          { backgroundColor: 
            pedido.status === 'ENT' ? '#4CAF50' : 
            pedido.status === 'CAN' ? '#f44336' : 
            '#fff' 
          },
          { color: 
            (pedido.status === 'ENT' || pedido.status === 'CAN') ? '#fff' : '#333' 
          }
        ]}>
          {formatarStatus(pedido.status)}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Informações do Pedido</Text>
        <Text>Origem: {pedido.origem}</Text>
        <Text>Data de Criação: {pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleString() : 'N/A'}</Text>
        <Text>Data Estimada de Entrega: {pedido.data_entrega_estimada ? new Date(pedido.data_entrega_estimada).toLocaleString() : 'Não definida'}</Text>
        
        <View style={styles.refreshButtonContainer}>
          <Button 
            title="Atualizar Dados" 
            onPress={buscarPedido} 
            color="#4CAF50"
          />
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Produtos</Text>
        {pedido.produtos && pedido.produtos.length > 0 ? (
          pedido.produtos.map((produto, index) => (
            <View key={index} style={styles.produto}>
              <Text style={styles.produtoTitle}>{produto.nome_produto}</Text>
              <Text>Quantidade: {produto.quantidade}</Text>
              <Text>Preço: {(() => {
                if (!produto.preco_unitario) return 'N/A';
                
                let preco = produto.preco_unitario;
                try {
                  // Se não for um número, tenta converter
                  if (typeof preco !== 'number') {
                    preco = parseFloat(preco);
                  }
                  
                  // Verifica se é um número válido após a conversão
                  if (!isNaN(preco)) {
                    return `R$ ${preco.toFixed(2)}`;
                  } else {
                    return `R$ ${produto.preco_unitario}`;
                  }
                } catch (e) {
                  console.log('Erro ao formatar preço:', e);
                  return `R$ ${produto.preco_unitario}`;
                }
              })()}</Text>
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
    backgroundColor: '#f5f5f5',
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
  refreshButtonContainer: {
    marginTop: 15,
    alignSelf: 'center',
    width: '100%',
  },
});
