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
    width: 170,
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  entryImage: {
    width: '100%',
    height: 260,
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