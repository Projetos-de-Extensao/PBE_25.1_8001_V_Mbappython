import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.4:8000/api';

export default function OperadorDetalhesPedidoScreen({ route, navigation }) {
  const { pedidoId } = route.params;
  const [dataEntrega, setDataEntrega] = useState('');

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido #{pedidoId}</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  divider: { marginVertical: 10 },
});
