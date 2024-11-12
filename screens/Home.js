import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import React, { useState } from 'react'
import CoffeeCard from '../components/CoffeeCard'
import CoffeeData from '../data/CoffeeData'

export default function Home() {
  const categories = ['All', 'Espresso', 'Cappuccino', 'Latte', 'Mocha', 'Macchiato', 'Americano']
  const [activeCategory, setActiveCategory] = useState('All')
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <FontAwesome name="bars" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <Image source={require('../assets/app_images/avatar.png')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Find the Best Coffee for You</Text>

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
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

      {/* Coffee List */}
      {/* <ScrollView>
        {CoffeeData.map((coffee) => (
          <CoffeeCard
            key={coffee.id}
            imageUri={coffee.imagelink_square}
            title={coffee.title}
            subtitle={coffee.special_ingredient}
            price={coffee.prices[1].price}
            onAddPress={() => console.log('Add to cart')}
          />
        ))}
      </ScrollView> */}
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
    marginBottom: 20 },
  
  searchInput: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },

  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },

  activeTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'orange',
    marginRight: 16
  },

  tab: { 
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 16 
  },

  tabText: {
    color: 'white',
    fontWeight: 'bold'
  },

  activeTab: { borderBottomWidth: 2, borderBottomColor: 'orange' },
  tabText: { color: 'white', fontWeight: 'bold' },
  activeTabText: { color: 'orange' },
})