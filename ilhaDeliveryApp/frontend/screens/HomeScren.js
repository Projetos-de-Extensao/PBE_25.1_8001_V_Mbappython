import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Topo com saudação e endereço */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá <Text style={{ fontWeight: 'bold' }}>John</Text></Text>
        <Text style={styles.address}>Rua 1, número 2 - ilha primeira</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Pedido atual */}
        <Text style={styles.sectionTitle}>Pedido atual</Text>
        <View style={styles.mapCard}>
          <Image
            source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=-23.000,-43.365&zoom=13&size=300x200&key=SUA_API_KEY' }}
            style={styles.mapImage}
          />
          <View style={styles.etaContainer}>
            <Text>Chegada estimada</Text>
            <Text style={styles.etaText}>12min - 15min</Text>
          </View>
        </View>

        {/* Últimos pedidos */}
        <Text style={styles.sectionTitle}>Últimos pedidos</Text>
        <Text style={styles.noOrders}>Nenhum pedido feito ainda</Text>
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
  mapImage: {
    width: '100%',
    height: 150,
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

  noOrders: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});


// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// export default function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Bem-vindo!</Text>
//     </View>
//   );
// }

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
