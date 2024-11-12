import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { database, auth } from '../firebase/FirebaseSetup';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, 'cart'),
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((entry) => entry.userId === currentUser.uid);
        setCartItems(items);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
