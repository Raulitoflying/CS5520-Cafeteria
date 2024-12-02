import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function FavoriteCard({ coffee, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={ coffee.imageUri } style={styles.image} />
          {/* Overlay with Coffee details */}
          <View style={styles.overlay}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{coffee.name}</Text>
              <Text style={styles.subtitle}>{coffee.special_ingredient}</Text>
            </View>
            <View style={styles.tagsContainer}>
              <Text style={[styles.tag]}>{coffee.type}</Text>
              <Text style={[styles.tag]}>{coffee.ingredients}</Text>
              <Text style={[styles.tag]}>{coffee.roasted}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 500,
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
  content: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tag: {
    backgroundColor: '#333',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    color: '#fff',
    fontSize: 12,
    marginRight: 4,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#fff',
  },
  description: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 18,
  },
});
