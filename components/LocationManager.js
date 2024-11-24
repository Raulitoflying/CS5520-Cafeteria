import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { getOneDocument, updateDB } from "../firebase/FirebaseHelper";
import { auth, database } from "../firebase/FirebaseSetup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function LocationManager({ onAddressSelect }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [response, requestPermission] = Location.useForegroundPermissions();

  useEffect(() => {
    async function getUserData() {
      const userData = await getOneDocument(auth.currentUser.uid, "users");
      if (userData && userData.location) {
        setLocation(userData.location);
        getAddressFromCoords(userData.location);
      }
    }
    getUserData();
  }, []);

  useEffect(() => {
    if (route.params?.selectedLocation) {
      setLocation(route.params.selectedLocation);
      getAddressFromCoords(route.params.selectedLocation);
    }
  }, [route.params]);

  const getAddressFromCoords = async (coords) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude
      });
      
      if (result[0]) {
        const addressObj = result[0];
        const formattedAddress = `${addressObj.street || ''} ${addressObj.name || ''}, ${addressObj.city || ''}, ${addressObj.region || ''} ${addressObj.postalCode || ''}, ${addressObj.country || ''}`.trim();
        setAddress(formattedAddress);
        if (onAddressSelect) {
          onAddressSelect(formattedAddress);
        }
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  async function verifyPermission() {
    try {
      if (response.granted) {
        return true;
      }
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } catch (err) {
      console.log("verify permission ", err);
      return false;
    }
  }

  async function locateUserHandler() {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert("Permission Required", "You need to give location permission to use this feature.");
        return;
      }
      const response = await Location.getCurrentPositionAsync();
      const newLocation = {
        latitude: response.coords.latitude,
        longitude: response.coords.longitude,
      };
      setLocation(newLocation);
      getAddressFromCoords(newLocation);
    } catch (err) {
      console.log("locate user ", err);
      Alert.alert("Error", "Could not fetch your location. Please try again.");
    }
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <View style={styles.container}>


        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.locationButton} 
            onPress={locateUserHandler}
          >
            <Feather name="navigation" size={20} color="#fff" />
            <Text style={styles.buttonText}>Get Current Location</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.locationButton} 
            onPress={() => navigation.navigate("Map")}
          >
            <Feather name="map" size={20} color="#fff" />
            <Text style={styles.buttonText}>Choose on Map</Text>
          </TouchableOpacity>
        </View>

        {location && (
          <View style={styles.mapContainer}>
            <Image
              source={{
                uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.latitude},${location.longitude}&key=${process.env.EXPO_PUBLIC_mapsApiKey}`,
              }}
              style={styles.mapImage}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  addressContainer: {
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A2B29',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A2B29',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    backgroundColor: '#4A2B29',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});