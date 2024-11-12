import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

export default function DiaryEntryCard({title, date, image}) {
  return (
    <View style={styles.entryCard}>
      <Image source={image} style={styles.entryImage} />
      <Text style={styles.entryTitle}>{title}</Text>
      <View style={styles.entryInfo}>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  entryCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  entryImage: {
    width: '100%',
    height: 140,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    padding: 8,
  },
  entryInfo: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
})