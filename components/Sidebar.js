import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, database } from '../firebase/FirebaseSetup';
import { collection, query, where, getDocs } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export default function Sidebar({ isVisible, onClose }) {
  const navigation = useNavigation();
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [profileImage, setProfileImage] = useState(null);
  const currentUser = auth.currentUser;

  // Animation effect for the sidebar
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  // Fetch the profile image from Firestore
  const fetchProfileImage = async (userId) => {
    try {
      const q = query(collection(database, 'profiles'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const profileData = querySnapshot.docs[0].data();
        setProfileImage(profileData.imageUri);
      } else {
        setProfileImage(null); // Default to null if no image is found
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  // Fetch profile image when the sidebar is visible
  useEffect(() => {
    if (currentUser?.uid) {
      fetchProfileImage(currentUser.uid);
    }
  }, [currentUser]);

  // Navigation handler
  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
    onClose();
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      )}

      {/* Sidebar Container */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
            shadowOpacity: isVisible ? 0.3 : 0,
          },
        ]}
      >
        {/* Header with User Profile */}
        <View style={styles.header}>
          <View style={styles.userProfile}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/app_images/avatar.png')
              }
              style={styles.userProfileImage}
            />
            <View>
              <Text style={styles.userEmail}>
                {currentUser?.email || 'Guest User'}
              </Text>
              <Text style={styles.userSubtext}>Coffee Enthusiast</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome name="times" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('CoffeeSocialInteraction')}
          >
            <FontAwesome name="comment" size={20} color="white" />
            <Text style={styles.menuText}>Coffee Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('Profile')}
          >
            <FontAwesome name="user" size={20} color="white" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('Cart')}
          >
            <FontAwesome name="shopping-cart" size={20} color="white" />
            <Text style={styles.menuText}>Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('History')}
          >
            <FontAwesome name="list-alt" size={20} color="white" />
            <Text style={styles.menuText}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <FontAwesome name="sign-out" size={20} color="white" />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#1b1b1b',
    zIndex: 11,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userEmail: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSubtext: {
    color: '#888',
    fontSize: 12,
  },
  menuContainer: {
    paddingTop: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuText: {
    color: 'white',
    marginLeft: 15,
    fontSize: 16,
  },
  logoutItem: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
});