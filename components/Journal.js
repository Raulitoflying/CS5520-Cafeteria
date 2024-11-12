import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import DiaryEntryCard from './DiaryEntryCard'
import { collection, onSnapshot } from 'firebase/firestore';
import { database, auth } from '../firebase/FirebaseSetup';

export default function Journal() {
  const [searchText, setSearchText] = useState('');
  const [filteredEntries, setFilteredEntries] = useState(diaryEntries);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, 'journals'),
      (snapshot) => {
        const entries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).filter((entry) => entry.userId === currentUser.uid);
        setDiaryEntries(entries);
        setFilteredEntries(entries);
      },
      (error) => {
        console.error(error);
      }
    )

    return () => unsubscribe();
  }, []);

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
            <Text style={styles.statNumber}>{diaryEntries.length}</Text>
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
            <DiaryEntryCard title={item.title} image={{uri: item.imageUri}} date={item.date} />
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