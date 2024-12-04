// History.js
import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { database, auth } from '../firebase/FirebaseSetup';
import { Feather } from '@expo/vector-icons';

export default function History() {
  const [orders, setOrders] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(database, 'orders'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
      <View style={styles.orderDetailRow}>
        <Feather name="calendar" size={16} color="#4A2B29" />
        <Text style={styles.orderDate}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      <View style={styles.orderDetailRow}>
        <Feather name="dollar-sign" size={16} color="#4A2B29" />
        <Text style={styles.orderAmount}>Total Amount: ${item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.orderDetailRow}>
        <Feather name="check-circle" size={16} color="#4A2B29" />
        <Text style={styles.orderStatus}>Status: {item.status}</Text>
      </View>
      <Text style={styles.orderItemsTitle}>Items:</Text>
      {item.items.map((orderItem, index) => (
        <View key={index} style={styles.orderItem}>
          <Text style={styles.itemName}>{orderItem.name}</Text>
          <Text style={styles.itemID}>ID: {orderItem.id}</Text>
          <Text style={styles.itemQuantity}>Quantity: {orderItem.quantity}</Text>
          <Text style={styles.itemPrice}>Price: ${(parseFloat(orderItem.price) || 0).toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>
      {orders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4A2B29',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noOrdersText: {
    fontSize: 18,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A2B29',
    marginBottom: 10,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2B29',
    marginLeft: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  orderItemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2B29',
    marginTop: 10,
    marginBottom: 5,
  },
  orderItem: {
    marginBottom: 5,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemID: {
    fontSize: 12,
    color: '#888',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
});