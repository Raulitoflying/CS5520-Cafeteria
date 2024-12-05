// Payment.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { database, auth } from '../firebase/FirebaseSetup';
import { writeToDB } from '../firebase/FirebaseHelper';

export default function Payment({ route, navigation }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const { totalAmount } = route.params;

  useEffect(() => {
    fetchPaymentMethods();
    fetchCartItems();
  }, []);

  const fetchPaymentMethods = () => {
    const q = query(
      collection(database, 'payment_methods'),
      where('userId', '==', auth.currentUser.uid)
    );
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const methods = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPaymentMethods(methods);
    }, (error) => {
      console.error('Error fetching payment methods:', error);
      Alert.alert('Error', 'Failed to load payment methods');
    });
  
    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  };

  const fetchCartItems = async () => {
    try {
      const q = query(
        collection(database, 'cart'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        firebaseId: doc.id,
        ...doc.data()
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'Failed to load cart items');
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
  
    try {
      const orderDetails = {
        userId: auth.currentUser.uid,
        paymentMethodId: selectedMethod.id,
        paymentMethod: selectedMethod.cardNumberMasked,
        amount: totalAmount,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          ImageUri: item.imageUri,
        })),
        status: 'completed',
        timestamp: new Date().toISOString()
      };
  
      await writeToDB(orderDetails, 'orders');
  
      // Clear cart
      for (const item of cartItems) {
        await deleteDoc(doc(database, 'cart', item.firebaseId));
      }
  
      // Navigate to success screen with order details
      navigation.navigate('PaymentSuccess', {
        orderDetails
      });
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
        <Text style={styles.headerSubtitle}>Select a payment method</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amount}>${totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.methodsContainer}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
          key={method.id}
          style={[
            styles.methodItem,
            selectedMethod?.id === method.id && styles.selectedMethod
          ]}
          onPress={() => setSelectedMethod(method)}
        >
          <View style={styles.methodInfo}>
            <Feather name="credit-card" size={24} color="#4A2B29" />
            <View style={styles.methodDetails}>
              <Text style={styles.methodNumber}>{method.cardNumberMasked}</Text>
              <Text style={styles.methodExpiry}>Expires {method.expiryDate}</Text>
            </View>
          </View>
          {selectedMethod?.id === method.id && (
            <Feather name="check-circle" size={24} color="#4A2B29" />
          )}
        </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addMethodButton}
        onPress={() => navigation.navigate('PaymentMethods')}
      >
        <Feather name="plus" size={20} color="#4A2B29" />
        <Text style={styles.addMethodText}>Add Payment Method</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selectedMethod && styles.confirmButtonDisabled
        ]}
        onPress={handleConfirmPayment}
        disabled={!selectedMethod}
      >
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </ScrollView>
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
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5,
  },
  amountContainer: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A2B29',
    marginTop: 10,
  },
  methodsContainer: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A2B29',
    marginBottom: 15,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedMethod: {
    borderColor: '#4A2B29',
    backgroundColor: 'rgba(74, 43, 41, 0.05)',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodDetails: {
    marginLeft: 15,
  },
  methodNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  methodExpiry: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A2B29',
    borderStyle: 'dashed',
  },
  addMethodText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4A2B29',
  },
  confirmButton: {
    backgroundColor: '#4A2B29',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#999',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});