import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from "react-native";
import { auth, database } from "../firebase/FirebaseSetup";
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, onSnapshot, query, where, getDocs  } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/FirebaseSetup";
import { scheduleDailyNotification } from "../components/NotificationManager";
import DateTimePickerModal from "react-native-modal-datetime-picker";


export default function Profile() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [isTimerPickerVisible, setTimerPickerVisible] = useState(false);

  const showTimerPicker = () => {
    setTimerPickerVisible(true);
  }

  const hideTimerPicker = () => {
    setTimerPickerVisible(false);
  }

  const handleTimerConfirm = (time) => {
    hideTimerPicker();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    scheduleDailyNotification(hours, minutes);

  }

  const fetchProfileImage = async (userId) => {
    try {
      const storageRef = ref(storage, `profile_images/${userId}.jpg`);
      const imageUrl = await getDownloadURL(storageRef);
      setProfileImage(imageUrl);
    } catch (error) {
      console.log("Error fetching profile image from storage:", error);
    }
    setProfileImage(null);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user?.uid) {
        fetchProfileImage(user.uid); // 从 Storage 加载图片
      }
    }, [user])
  );
  
  // useEffect(() => {
  //   const currentUser = auth.currentUser;
  //   if (currentUser) {
  //     setUser(currentUser);
  //   }
  // }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, 'journals'),
      (snapshot) => {
        const entries = snapshot.docs.map((doc) => ({
          journalId: doc.id,
          ...doc.data(),
        })).filter((entry) => entry.userId === user.uid);
        setDiaryEntries(entries);
      },
      (error) => {
        console.error(error);
      }
    )

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.uid) {
        console.log('Fetching profile image for user:', user.uid);
        fetchProfileImage(user.uid);
      }
    }, [user])
  );

  const userStats = {
    ordersCount: 12,
    favoritesCount: 8,
    journals: diaryEntries.length,
  };

  const menuItems = [
    {
      icon: "settings",
      title: "Account Settings",
      onPress: () => navigation.navigate("EditProfile")
    },
    {
      icon: "credit-card",
      title: "Payment Methods",
      onPress: () => navigation.navigate("PaymentMethods")
    },
    {
      icon: "map-pin",
      title: "Delivery Addresses",
      onPress: () => navigation.navigate('Address')
    },
    {
      icon: "bell",
      title: "Set Notifications Time",
      onPress: showTimerPicker,
    },
    {
      icon: "help-circle",
      title: "Help & Support",
      onPress: () => navigation.navigate("HelpSupport")
    },
    {
      icon: "info",
      title: "About Us",
      onPress: () => navigation.navigate('About')
    }
  ];

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Feather name="coffee" size={40} color="#4A2B29" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/app_images/avatar.png')}
            style={styles.avatar}
            defaultSource={require('../assets/app_images/avatar.png')}
            onError={(error) => console.error('Image loading error:', error.nativeEvent)}
          />
          <TouchableOpacity style={styles.editButton } onPress={() => navigation.navigate("EditProfile")}>
            <Feather name="edit-2" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>Member since {new Date().getFullYear()}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <View style={styles.statsButton}>
              <Text style={styles.statNumber}>{userStats.ordersCount}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <TouchableOpacity onPress={() => navigation.navigate('Favorite')}>
            <View style={styles.statsButton}>
              <Text style={styles.statNumber}>{userStats.favoritesCount}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.statItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
            <View style={styles.statsButton}>
              <Text style={styles.statNumber}>{userStats.journals}</Text>
              <Text style={styles.statLabel}>Journal</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Feather name={item.icon} size={20} color="#4A2B29" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    <DateTimePickerModal
      isVisible={isTimerPickerVisible}
      mode = "time"
      onConfirm={handleTimerConfirm}
      onCancel={hideTimerPicker}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4A2B29",
  },
  header: {
    backgroundColor: "#4A2B29",
    padding: 20,
    alignItems: "center",
    paddingBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#666',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  email: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  memberSince: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#EEEEEE",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A2B29",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  menuContainer: {
    backgroundColor: "#FFF",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  statsButton: {
    alignItems: 'center',
  },
});