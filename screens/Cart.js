import { StyleSheet, View, FlatList, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { database, auth } from '../firebase/FirebaseSetup';
import CartCard from '../components/CartCard';

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

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartCard item={item} />
        )}
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
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
