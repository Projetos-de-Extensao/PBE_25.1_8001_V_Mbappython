import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, Platform } from 'react-native';

export default function PedidoScreen({ navigation, route }) {
  const clienteId = route.params?.clienteId || ''; // você deve passar isso ao navegar para essa tela

  const [origem, setOrigem] = useState('IFOOD');
  const [produtos, setProdutos] = useState([
    { nome_produto: '', descricao: '', link: '', quantidade: '1' }
  ]);

  const handleAddProduto = () => {
    setProdutos([...produtos, { nome_produto: '', descricao: '', link: '', quantidade: '1' }]);
  };

  const handleChangeProduto = (index, field, value) => {
    const newProdutos = [...produtos];
    newProdutos[index][field] = value;
    setProdutos(newProdutos);
  };

  const handleSubmit = async () => {
    const payload = {
      cliente: clienteId,
      origem,
      produtos: produtos.map(p => ({
        ...p,
        quantidade: parseInt(p.quantidade)
      }))
    };

    try {
      const response = await fetch('http://172.16.6.231:8000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Platform.OS === 'web'
          ? window.alert('Pedido realizado com sucesso!')
          : Alert.alert('Sucesso', 'Pedido realizado com sucesso!');
        navigation.goBack(); // ou ir para a tela de pedidos
      } else {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível realizar o pedido.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Novo Pedido</Text>

      <Text style={{ marginTop: 20 }}>Origem:</Text>
      <Picker selectedValue={origem} onValueChange={setOrigem}>
        <Picker.Item label="iFood" value="IFOOD" />
        <Picker.Item label="Amazon" value="AMAZON" />
        <Picker.Item label="Mercado Livre" value="ML" />
        <Picker.Item label="Outro" value="OUTRO" />
      </Picker>

      {produtos.map((produto, index) => (
        <View key={index} style={{ marginTop: 20, borderBottomWidth: 1, paddingBottom: 10 }}>
          <Text>Produto {index + 1}</Text>
          <TextInput
            placeholder="Nome do Produto"
            value={produto.nome_produto}
            onChangeText={text => handleChangeProduto(index, 'nome_produto', text)}
          />
          <TextInput
            placeholder="Descrição"
            value={produto.descricao}
            onChangeText={text => handleChangeProduto(index, 'descricao', text)}
          />
          <TextInput
            placeholder="Link"
            value={produto.link}
            onChangeText={text => handleChangeProduto(index, 'link', text)}
          />
          <TextInput
            placeholder="Quantidade"
            keyboardType="numeric"
            value={produto.quantidade}
            onChangeText={text => handleChangeProduto(index, 'quantidade', text)}
          />
        </View>
      ))}

      <Button title="Adicionar outro produto" onPress={handleAddProduto} />
      <View style={{ marginTop: 20 }}>
        <Button title="Enviar Pedido" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}
