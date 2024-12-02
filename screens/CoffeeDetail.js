import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { writeToDB, deleteFromDB } from '../firebase/FirebaseHelper';
import { auth, database } from '../firebase/FirebaseSetup';
import { getDocs, query, where, collection, onSnapshot } from 'firebase/firestore';

export default function CoffeeDetail({ route, navigation }) {
  const { coffee } = route.params; // Get the coffee data passed from the previous screen
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  useEffect(() => {
    const userId = auth.currentUser?.uid;
  
    if (!userId) return;
  
    const q = query(
      collection(database, 'favorites'),
      where('userId', '==', userId),
      where('coffeeId', '==', coffee.id)
    );
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      });
    
      return () => unsubscribe();
    }, [coffee.id]);
  
  const handleFavoritePress = async () => {
    try {
      const userId = auth.currentUser.uid;

      if (isFavorite) {
        const querySnapshot = await getDocs(
          query(
            collection(database, 'favorites'),
            where('userId', '==', userId),
            where('coffeeId', '==', coffee.id)
          )
        );

        if (!querySnapshot.empty) {
          for (const docSnap of querySnapshot.docs) {
            await deleteFromDB(docSnap.id, 'favorites');
          }
        }
      } else {
        await writeToDB(
          {
            userId: userId,
            coffeeId: coffee.id,
            name: coffee.name,
            imageUri: coffee.imagelink_portrait,
            special_ingredient: coffee.special_ingredient,
            description: coffee.description,
            type: coffee.type,
            ingredients: coffee.ingredients,
            roasted: coffee.roasted
          },
          'favorites'
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log('Error updating favorite:', error);
    }
  };

  function handleAddPress() {
    const cartItem = {
      userId: auth.currentUser.uid,
      id: coffee.id,
      name: coffee.name,
      imageUri: coffee.imagelink_square,
      price: getPriceBySize(),
      sizes: selectedSize,
      quantity: 1,
    };

    try {
      writeToDB(cartItem, 'cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  }

  const getPriceBySize = () => {
    const selectedPrice = coffee.prices.find((price) => price.size === selectedSize);
    return selectedPrice ? selectedPrice.price : 'N/A';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Coffee image */}
      <View style={styles.imageContainer}>
        <Image source={ coffee.imagelink_portrait } style={styles.image} />
        {/* Overlay with Coffee details */}
        <View style={styles.overlay}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{coffee.name}</Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleFavoritePress}>
              <AntDesign name="heart" style={[styles.icon, isFavorite && styles.redIcon]} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>{coffee.special_ingredient}</Text>
          <View style={styles.tagsContainer}>
            <Text style={[styles.tag]}>{coffee.type}</Text>
            <Text style={[styles.tag]}>{coffee.ingredients}</Text>
            <Text style={[styles.tag]}>{coffee.roasted}</Text>
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
              style={[styles.sizeButton, size === selectedSize ? styles.sizeActive : null]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[styles.sizeText, size === selectedSize ? styles.sizeTextActive : null]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price and Add to Cart */}
        <View style={styles.footer}>
          <Text style={styles.price}>${getPriceBySize()}</Text>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddPress}>
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
    height: 500,
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
  titleContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 8,
  },
  icon: {
    fontSize: 20, 
    color: 'white', 
  },
  redIcon: {
    fontSize: 20,
    color: 'red',
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
    justifyContent: 'flex-start',
  },

  tag: {
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    marginRight: 4,
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
    paddingHorizontal: 50,
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
