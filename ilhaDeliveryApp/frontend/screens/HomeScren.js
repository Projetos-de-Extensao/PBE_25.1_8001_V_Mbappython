import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const API_URL = 'http://172.16.6.231:8000/api';


export default function HomeScreen() {
  const navigation = useNavigation();  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [enderecoUsuario, setEnderecoUsuario] = useState('Rua 1, número 2 - ilha primeira');

  const buscarPedidos = async () => {
    setCarregandoPedidos(true);
    try {
      const token = await AsyncStorage.getItem('access');
      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log("Erro ao buscar pedidos:", response.status);
        return;
      }

      const data = await response.json();
      console.log("Pedidos recebidos na Home:", data.length);
      
      // Ordena por ID decrescente (assumindo que IDs maiores são mais recentes)
      // e pega apenas os 3 mais recentes
      const recentes = [...data]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);
      
      setUltimosPedidos(recentes);
    } catch (error) {
      console.error('Erro ao buscar pedidos na Home:', error);
    } finally {
      setCarregandoPedidos(false);
    }
  };  const buscarUsuario = async () => {
    try {
      // Obtém o token do AsyncStorage
      const token = await AsyncStorage.getItem('access');
      
      if (!token) {
        console.log('Token não encontrado');
        setNomeUsuario('Cliente');
        return;
      }
      
      // Usa o novo endpoint para buscar dados do cliente logado
      const response = await fetch(`${API_URL}/cliente`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Dados do cliente recebidos:', userData);
        
        // Define o nome do usuário
        if (userData && userData.nome) {
          setNomeUsuario(userData.nome);
          console.log('Nome do usuário definido:', userData.nome);
        } else {
          setNomeUsuario('Cliente');
        }
        
        // Define o endereço do usuário
        if (userData && userData.endereco && userData.endereco.endereco_completo) {
          setEnderecoUsuario(userData.endereco.endereco_completo);
          console.log('Endereço do usuário definido:', userData.endereco.endereco_completo);
        }
      } else {
        console.log('Erro ao buscar dados do usuário:', response.status);
        setNomeUsuario('Cliente');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setNomeUsuario('Cliente');
    }
  };
  useEffect(() => {
    buscarPedidos();
    buscarUsuario();
    
    // Recarregar quando a tela receber foco
    const unsubscribe = navigation.addListener('focus', () => {
      buscarPedidos();
      buscarUsuario(); // Busca o nome do usuário também quando a tela recebe foco
    });
    
    return unsubscribe;
  }, [navigation]);

  // Função para formatar o status do pedido
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

  const getStatusColor = (status) => {
    const colorMap = {
      'SOL': '#f0ad4e', // amarelo
      'AC': '#5bc0de',  // azul claro
      'CE': '#5bc0de',  // azul claro
      'PA': '#5cb85c',  // verde
      'AND': '#428bca', // azul
      'ENT': '#5cb85c', // verde
      'CAN': '#d9534f'  // vermelho
    };
    
    return colorMap[status] || '#777';
  };

  return (
    <View style={styles.container}>      {/* Topo com saudação e endereço */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá <Text style={{ fontWeight: 'bold' }}>{nomeUsuario}</Text></Text>
        <Text style={styles.address}>{enderecoUsuario}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>        {/* Pedido atual */}
        <Text style={styles.sectionTitle}>Pedido atual</Text>
        <View style={styles.mapCard}>
          <View style={styles.placeholderMap}>
            <Text style={styles.placeholderMapText}>Mapa de Entrega</Text>
            <Ionicons name="map-outline" size={50} color="#aaa" />
          </View>
          <View style={styles.etaContainer}>
            <Text>Chegada estimada</Text>
            <Text style={styles.etaText}>12min - 15min</Text>
          </View>
        </View>

        {/* Últimos pedidos */}
        <View style={styles.lastOrdersSection}>
          <Text style={styles.sectionTitle}>Últimos pedidos</Text>
          
          {carregandoPedidos ? (
            <ActivityIndicator size="small" color="#0066cc" style={styles.loading} />
          ) : ultimosPedidos.length > 0 ? (
            ultimosPedidos.map((pedido) => (
              <TouchableOpacity
                key={pedido.id}
                style={styles.orderCard}
                onPress={() => navigation.navigate('DetalhesPedido', { pedidoId: pedido.id })}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderTitle}>Pedido #{pedido.id}</Text>
                  <Text style={[
                    styles.orderStatus, 
                    { backgroundColor: getStatusColor(pedido.status) }
                  ]}>
                    {formatarStatus(pedido.status)}
                  </Text>
                </View>
                
                <View style={styles.orderDetails}>
                  <Text>Origem: {pedido.origem}</Text>
                  <Text>
                    Data: {pedido.data_criacao 
                      ? new Date(pedido.data_criacao).toLocaleDateString() 
                      : 'N/A'}
                  </Text>
                  <Text>Produtos: {pedido.produtos?.length || 0}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noOrders}>Nenhum pedido feito ainda</Text>
          )}
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Pedidos')}
          >
            <Text style={styles.viewAllText}>Ver todos os pedidos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#8ed1fc',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
  },
  greeting: { fontSize: 24 },
  address: { fontSize: 14, marginTop: 5, color: '#333' },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80, // para não cobrir o conteúdo com o footer
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  mapCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    elevation: 2,
    marginBottom: 30,
  },
  placeholderMap: {
    width: '100%',
    height: 150,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderMapText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  etaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#d0ecfc',
  },
  etaText: {
    fontWeight: 'bold',
  },

  lastOrdersSection: {
    marginBottom: 20,
  },
  
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  
  orderDetails: {
    gap: 5,
  },
  
  loading: {
    marginVertical: 20,
  },
  
  noOrders: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#999',
  },
  
  viewAllButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  
  viewAllText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   title: { fontSize: 24, marginBottom: 20 }
// });

// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useAuth } from '../context/AuthContext';

// export default function HomeScreen() {
//   const { logout } = useAuth();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Bem-vindo à Home!</Text>
//       <Button title="Sair" onPress={logout} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 24, marginBottom: 20 }
// });
