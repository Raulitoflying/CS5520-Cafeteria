import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../firebase/FirebaseSetup';
import FavoriteCard from '../components/FavoriteCard';
import CoffeeData from '../data/CoffeeData';

export default function Favorite({navigation}) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    const q = query(
      collection(database, 'favorites'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const favoritesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favoritesData);
    });

    return () => unsubscribe();
  }, []);

  const handleCardPress = (coffeeId) => {
    const coffeeDetail = CoffeeData.find((coffee) => coffee.id === coffeeId);

    if (coffeeDetail) {
      navigation.navigate('CoffeeDetail', { coffee: coffeeDetail });
    } else {
      console.error('Coffee data not found locally for ID:', coffeeId);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {favorites.length > 0 ? (
        favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.id}
            coffee={favorite}
            onPress={() => handleCardPress(favorite.coffeeId)}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>No favorites added yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    padding: 16,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
