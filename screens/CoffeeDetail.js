import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function CoffeeDetail({ route, navigation }) {
  const { coffee } = route.params; // Get the coffee data passed from the previous screen

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.icon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Coffee image */}
      <View style={styles.imageContainer}>
        <Image source={ coffee.imagelink_square } style={styles.image} />
        {/* Overlay with Coffee details */}
        <View style={styles.overlay}>
          <Text style={styles.title}>{coffee.name}</Text>
          <Text style={styles.subtitle}>{coffee.special_ingredient}</Text>
          <View style={styles.tagsContainer}>
            <Text style={[styles.tag]}>Coffee</Text>
            <Text style={[styles.tag]}>Milk</Text>
            <Text style={[styles.tag]}>Medium Roasted</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{coffee.description}</Text>

        {/* Size selection */}
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.sizeContainer}>
          {['S', 'M', 'L'].map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.sizeButton, size === 'S' ? styles.sizeActive : null]}
            >
              <Text style={[styles.sizeText, size === 'S' ? styles.sizeTextActive : null]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price and Add to Cart */}
        <View style={styles.footer}>
          <Text style={styles.price}>${coffee.prices[1].price}</Text>
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  icon: {
    color: '#fff',
    fontSize: 18,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tag: {
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    marginHorizontal: 4,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 16,
    lineHeight: 22,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  sizeActive: {
    borderColor: '#ff6b00',
    backgroundColor: '#1e1e1e',
  },
  sizeText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  sizeTextActive: {
    color: '#ff6b00',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addToCartButton: {
    backgroundColor: '#ff6b00',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 16,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
