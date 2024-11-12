import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'

export default function Home() {
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
})