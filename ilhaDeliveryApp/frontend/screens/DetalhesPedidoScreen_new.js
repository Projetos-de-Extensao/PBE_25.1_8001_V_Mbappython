import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const API_URL = 'http://172.16.6.231:8000/api';


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

    const unsubscribe = navigation.addListener('focus', buscarPedido);

    const interval = setInterval(() => {
      buscarPedido();
    }, 30000); // Atualiza a cada 30 segundos

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigation, pedidoId]);


  // Função para aceitar cotação
  const aceitarCotacao = async () => {
    try {
      const token = await AsyncStorage.getItem('access');
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}/confirmar-pagamento/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        Alert.alert('Sucesso', 'Cotação aceita e pagamento confirmado!');
        buscarPedido();
      } else {
        const data = await response.json();
        Alert.alert('Erro', data.erro || 'Erro ao aceitar cotação.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
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
      {/* Topo azul com logo grande */}
      <View style={styles.topoAzul}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logodelivery.png')} style={styles.logoGrande} resizeMode="contain" />
        </View>
        <Text style={styles.nomeApp}>Ilha Delivery</Text>
      </View>
      {/* Header do pedido com fundo branco e status destacado */}
      <View style={styles.headerPedidoBox}>
        <Text style={styles.title}>Pedido #{pedido.id}</Text>
        <Text style={[
          styles.statusBadge,
          pedido.status === 'SOL' && styles.statusSolicitado,
          pedido.status === 'ENT' ? styles.statusEntregue :
          pedido.status === 'CAN' ? styles.statusCancelado : null
        ]}>
          {formatarStatus(pedido.status)}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Informações do Pedido</Text>
        <Text>Origem: {pedido.origem}</Text>        <Text>Data de Criação: {pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleString() : 'N/A'}</Text>
        <Text>Data Estimada de Entrega: {pedido.data_entrega_estimada ? new Date(pedido.data_entrega_estimada).toLocaleString() : 'Não definida'}</Text>
        <Text>Data de Entrega Efetiva: {pedido.data_entrega_efetiva ? new Date(pedido.data_entrega_efetiva).toLocaleString() : 'Não entregue'}</Text>
        {/* Produtos dentro do card de informações */}
        <Text style={styles.sectionTitle}>Produtos</Text>
        {pedido.produtos && pedido.produtos.length > 0 ? (
          pedido.produtos.map((produto, index) => (
            <View key={index} style={styles.produto}>
              <View style={styles.produtoInfo}>
                <Text style={styles.produtoTitle}>{produto.nome_produto}</Text>
                <Text>Quantidade: {produto.quantidade}</Text>
                <Text>Preço: {(() => {
                  if (!produto.preco_unitario) return 'N/A';
                  let preco = produto.preco_unitario;
                  try {
                    if (typeof preco !== 'number') {
                      preco = parseFloat(preco);
                    }
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
            </View>
          ))
        ) : (
          <Text>Nenhum produto neste pedido</Text>
        )}        {/* Bloco de resumo financeiro */}
        <View style={styles.resumoContainer}>
          {/* Calculando o subtotal dos produtos */}
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoLabel}>Subtotal</Text>
            <Text style={styles.resumoValor}>
              {pedido.produtos && pedido.produtos.length > 0 
                ? `R$ ${pedido.produtos.reduce((total, produto) => {
                    const preco = typeof produto.preco_unitario === 'number' 
                      ? produto.preco_unitario 
                      : parseFloat(produto.preco_unitario || 0);
                    return total + (preco * produto.quantidade);
                  }, 0).toFixed(2)}`
                : 'R$ 0.00'
              }
            </Text>
          </View>
          
          {/* Taxa de entrega (frete) */}
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoLabel}>Taxa De Entrega</Text>
            {pedido.frete !== null && pedido.frete !== undefined ? (
              <Text style={styles.resumoValor}>R$ {parseFloat(pedido.frete).toFixed(2)}</Text>
            ) : (
              <Text style={styles.resumoGratis}>Grátis</Text>
            )}
          </View>
          
          {/* Taxa de serviço - assumindo ser a diferença entre o preço final e o subtotal+frete */}
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoLabel}>Taxa De Serviço</Text>
            <Text style={styles.resumoValor}>
              {(() => {
                if (pedido.preco_final !== null && pedido.preco_final !== undefined) {
                  const subtotal = pedido.produtos ? pedido.produtos.reduce((total, produto) => {
                    const preco = typeof produto.preco_unitario === 'number' 
                      ? produto.preco_unitario 
                      : parseFloat(produto.preco_unitario || 0);
                    return total + (preco * produto.quantidade);
                  }, 0) : 0;
                  
                  const frete = pedido.frete !== null && pedido.frete !== undefined 
                    ? parseFloat(pedido.frete) 
                    : 0;
                  
                  const precoFinal = parseFloat(pedido.preco_final);
                  const taxaServico = precoFinal - subtotal - frete;
                  
                  return `R$ ${Math.max(0, taxaServico).toFixed(2)}`;
                }
                return 'R$ 0.00';
              })()}
            </Text>
          </View>
          
          {/* Total (valor da cotação) */}
          <View style={styles.resumoLinha}>
            <Text style={styles.resumoTotalLabel}>Total</Text>
            <Text style={styles.resumoTotalValor}>
              {pedido.preco_final !== null && pedido.preco_final !== undefined
                ? `R$ ${parseFloat(pedido.preco_final).toFixed(2)}`
                : 'Aguardando cotação'
              }
            </Text>
          </View>
        </View>
        {/* Botão para aceitar cotação, só aparece se status for 'CE' (Cotação Enviada) */}
        {pedido.status === 'CE' && (
          <Button
            title="Aceitar Cotação"
            color="#4CAF50"
            onPress={aceitarCotacao}
          />
        )}
        <View style={styles.refreshButtonContainer}>
          <Button 
            title="Atualizar Dados" 
            onPress={buscarPedido} 
            color="#4CAF50"
          />
        </View>
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  topoAzul: {
    backgroundColor: '#77cbff',
    paddingTop: 40,
    paddingBottom: 18,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 4,
  },
  logoGrande: {
    width: 90,
    height: 90,
    marginBottom: 2,
  },
  nomeApp: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerPedidoBox: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 18,
    marginTop: -18, // sobrepõe topo azul
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    color: '#333',
    borderWidth: 1,
    borderColor: '#b3e0ff',
    overflow: 'hidden',
  },
  statusSolicitado: {
    backgroundColor: '#ffe066', // amarelo
    color: '#222',
    borderColor: '#ffe066',
  },
  statusEntregue: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderColor: '#4CAF50',
  },
  statusCancelado: {
    backgroundColor: '#f44336',
    color: '#fff',
    borderColor: '#f44336',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#888',
    margin: 18,
    marginTop: 0,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    letterSpacing: 0.2,
  },
  produto: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#bbb',
    marginBottom: 12,
    marginTop: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#222',
  },
  produtoDesc: {
    marginTop: 2,
    color: '#666',
    fontSize: 13,
  },
  produtoLink: {
    marginTop: 2,
    color: '#1976D2',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  actions: {
    margin: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  refreshButtonContainer: {
    marginTop: 15,
    alignSelf: 'center',
    width: '100%',
  },
  resumoContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resumoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumoLabel: {
    color: '#444',
    fontSize: 15,
  },
  resumoValor: {
    color: '#444',
    fontSize: 15,
  },
  resumoGratis: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 15,
  },
  resumoTotalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resumoTotalValor: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
