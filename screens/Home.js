import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView, Platform} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import React, { useState } from 'react'
import { writeToDB } from '../firebase/FirebaseHelper'
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CoffeeCard from '../components/CoffeeCard'
import CoffeeData from '../data/CoffeeData'
import { auth,  database } from '../firebase/FirebaseSetup'
import NotificationManager from '../components/NotificationManager'

export default function Home() {
  const categories = ['Espresso', 'Americano', 'Black Coffee', 'Cappucchino', 'Latte', 'Macchiato']
  const [activeCategory, setActiveCategory] = useState('Espresso')
  const filteredCoffeeData = CoffeeData.filter(coffee => coffee.name === activeCategory)
  const [profileImage, setProfileImage] = useState(null);
  const currentUser = auth.currentUser;

  const fetchProfileImage = async (userId) => {
    try {
      const q = query(
        collection(database, 'profiles'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const profileData = querySnapshot.docs[0].data();
        setProfileImage(profileData.imageUri);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (currentUser?.uid) {
        fetchProfileImage(currentUser.uid);
      }
    }, [currentUser])
  );
  
  function handleAddPress(coffee) {
    const cartItem = {
      userId: auth.currentUser.uid,
      id: coffee.id,
      name: coffee.name,
      imageUri: coffee.imagelink_square,
      price: coffee.prices[1].price,
      sizes: 'M',
      quantity: 1,
    };

    try {
      writeToDB(cartItem, 'cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <FontAwesome name="bars" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <Image source={profileImage ? { uri: profileImage } : require('../assets/app_images/avatar.png')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Find the Best Coffee for You</Text>
      <NotificationManager />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="white" />
        <TextInput 
          placeholder="Find your coffee"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, activeCategory === category && styles.activeTab]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[styles.tabText, activeCategory === category && styles.activeTabText]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Coffee List */}
      <View>
        <ScrollView horizontal>
          {filteredCoffeeData.map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              imageUri={coffee.imagelink_square}
              title={coffee.name}
              subtitle={coffee.special_ingredient}
              price={coffee.prices[1].price}
              onAddPress={() => handleAddPress(coffee)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerButton: {
    padding: 10,
  },

  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  title: {
    fontSize: 45,
    color: 'white',
    fontWeight: 'bold',
    margin: 10,
    width: '80%',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20 
  },
  
  searchInput: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },

  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: Platform.OS === 'android' ? -8 : 0,
    height: 30,
  },

  tab: { 
    paddingHorizontal: 12,
    marginRight: Platform.OS === 'android' ? 8 : 16,
    height: '100%',
    justifyContent: 'center',
  },

  tabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'orange',
    paddingBottom: 4,
  },

  activeTabText: {
    color: 'orange'
  },
})