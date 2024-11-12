import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function CoffeeCard({ imageUri, title, subtitle, price, onAddPress }) {
  return (
    <View style={styles.card}>
      <Image source={imageUri} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      <Text style={styles.cardPrice}>${price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <FontAwesome name="plus" size={12} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  card: {
    width: 150,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    marginRight: 16,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: 'white',
    opacity: 0.7,
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardPrice: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 8,
  },
};
