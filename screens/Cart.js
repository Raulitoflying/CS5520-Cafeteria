import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { database, auth } from '../firebase/FirebaseSetup';
import CartCard from '../components/CartCard';
import { updateDB, deleteFromDB } from '../firebase/FirebaseHelper';

export default function Cart({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const currentUser = auth.currentUser;

  function handleIncrease(item) {
    if (!item.id || item.quantity === undefined || item.price === undefined) {
      return;
    }
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    updateDB(updatedItem, item.firebaseId, 'cart');
  }

  function handleDecrease(item) {
    if (item.quantity === 1) {
      deleteFromDB(item.firebaseId, 'cart');
      return;
    }
    const updatedItem = { ...item, quantity: item.quantity - 1 };
    updateDB(updatedItem, item.firebaseId, 'cart');
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, 'cart'),
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => ({
            firebaseId: doc.id,
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

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayPress = () => {
    if (totalPrice === 0) {
      Alert.alert('No Items', 'Your cart is empty. Please add items to your cart before proceeding to payment.');
      return;
    }
    navigation.navigate('Payment', { totalAmount: totalPrice });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => `${item.firebaseId}-${item.quantity}`}
        renderItem={({ item }) => (
          <CartCard item={item} onDecrease={() => handleDecrease(item)} onIncrease={() => handleIncrease(item)} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomContainer}>
        <Text style={styles.totalText}>Total Price: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.payButton} 
          onPress={handlePayPress}
        >
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    color: '#FFA500',
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#D2691E',
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 15,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});