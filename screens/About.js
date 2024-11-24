import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function About() {
  return (
    <ImageBackground
      source={require('../assets/coffee_assets/robusta_coffee_beans/robusta_coffee_beans_portrait.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>About Cafeteria</Text>
          <Text style={styles.subtitle}>EVERY CUP TELLS YOUR STORY</Text>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.paragraph}>
            Embark on a journey through the rich and vibrant world of artisanal coffee with Cafeteria,
            the ultimate app for coffee lovers. Whether you're a casual sipper or a seasoned connoisseur,
            Cafeteria is your all-in-one guide for discovering, documenting, and immersing yourself in
            exceptional coffee experiences from around the globe.
          </Text>
          <Text style={styles.paragraph}>
            With Cafeteria, you can explore an expansive selection of cafes and roasteries, each offering
            unique blends and brewing techniques. Easily browse and find nearby coffee spots, read detailed
            reviews, and dive deep into the world of specialty coffee. But the experience doesn’t stop
            there—Cafeteria allows you to create a personal coffee journal where you can document every
            cup, capturing tasting notes, favorite brews, and cherished memories along the way.
          </Text>
          <Text style={styles.paragraph}>
            Whether you’re ordering your next pour-over, looking for the perfect espresso, or simply savoring
            your morning latte, Cafeteria transforms how you experience coffee. From discovery to
            documentation, let Cafeteria elevate every cup you enjoy.
          </Text>
        </View>

        <View style={styles.orgSection}>
          <Text style={styles.orgTitle}>ORGANIZATION AND MANAGEMENT</Text>
          <View style={styles.orgItem}>
            <Feather name="user" size={20} color="#4A2B29" />
            <Text style={styles.orgText}>Xi Xi - Organizer</Text>
          </View>
          <View style={styles.orgItem}>
            <Feather name="user" size={20} color="#4A2B29" />
            <Text style={styles.orgText}>Yixiang Zhou - Organizer</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
  orgSection: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  orgTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A2B29',
    marginBottom: 15,
    textAlign: 'center',
  },
  orgItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  orgText: {
    fontSize: 16,
    color: '#4A2B29',
    marginLeft: 10,
  },
});