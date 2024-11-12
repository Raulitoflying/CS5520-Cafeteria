import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, TextInput } from 'react-native'
import React, { useState } from 'react'
import DiaryEntryCard from './DiaryEntryCard'

// TODO: for test, delete later
const diaryEntries = [
  {
    id: 1,
    title: 'Lucy Afternoon',
    date: '2021-10-01',
    image: require('../assets/journal_images/diary1.jpeg'),
  },

  {
    id: 2,
    title: 'Morning Coffee',
    date: '2021-10-01',
    image: require('../assets/journal_images/diary1.jpeg'),
  },

  {
    id: 3,
    title: 'Lattes with Friends',
    date: '2021-10-01',
    image: require('../assets/journal_images/diary1.jpeg'),
  },
]

export default function Journal() {
  const [searchText, setSearchText] = useState('');
  const [filteredEntries, setFilteredEntries] = useState(diaryEntries);

  function handleSearch(text) {
    setSearchText(text);
    const filtered = diaryEntries.filter((entry) => entry.title.toLowerCase().includes(text.toLowerCase()));
    setFilteredEntries(filtered);
  }

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../assets/app_images/avatar.png')}
            style={styles.avatar}
            defaultSource={require('../assets/app_images/avatar.png')}
          />
        <Text style={styles.name}>John Doe</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Follower</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Focused</Text>
          </View>
        </View>  
      </View>

      {/* Divider */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search diary..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Diary Section */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.columnWrapper}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <DiaryEntryCard title={item.title} image={item.image} date={item.date} />
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pronouns: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  searchBar: {
    height: 40,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  }
})