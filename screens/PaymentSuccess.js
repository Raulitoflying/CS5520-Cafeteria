// screens/PaymentSuccess.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function PaymentSuccess({ route, navigation }) {
  const { orderDetails } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Animatable.View 
        animation="bounceIn" 
        duration={1500} 
        style={styles.successIcon}
      >
        <Feather name="check-circle" size={80} color="#4CAF50" />
      </Animatable.View>

      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subtitle}>Thank you for your order</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order Summary</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order ID</Text>
          <Text style={styles.detailValue}>#{orderDetails.timestamp.substr(0, 25)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {new Date(orderDetails.timestamp).toLocaleString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValue}>{orderDetails.paymentMethod}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, styles.totalLabel]}>Total Amount</Text>
          <Text style={[styles.detailValue, styles.totalValue]}>
            ${orderDetails.amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.cardTitle}>Items</Text>
        {orderDetails.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemPrice}>Price: ${(parseFloat(item.price) || 0).toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  successIcon: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A2B29',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A2B29',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2B29',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2B29',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemDetails: {
    flex: 1,
    textAlign: 'left', // Ensure text is left-aligned
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'left', // Ensure text is left-aligned
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'left', // Ensure text is left-aligned
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'left', // Ensure text is left-aligned
  },
  button: {
    backgroundColor: '#4A2B29',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});