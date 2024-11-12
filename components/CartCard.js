import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

export default function CartCard({ item, onIncrease, onDecrease }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const price = item.price * quantity;

  return (
    <View style={styles.cardContainer}>
      <Image source={item.imageUri} style={styles.image} />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>With Steamed Milk</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.sizeBox}>
            <Text style={styles.sizeText}>{item.sizes}</Text>
          </View>
          <Text style={styles.price}>${price}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={onDecrease}>
              <Text style={styles.quantityButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={onIncrease}>
              <Text style={styles.quantityButton}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#1b1b1b',
    borderRadius: 15,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  sizeBox: {
    backgroundColor: '#333333', // Dark background for size box
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 12,
  },
  sizeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    color: '#FFA500', // Orange color for price
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  quantityButton: {
    color: '#FFA500',
    fontSize: 18,
    paddingHorizontal: 8,
    fontWeight: 'bold',
  },
  quantity: {
    color: '#ffffff',
    fontSize: 16,
    marginHorizontal: 8,
  },
});
