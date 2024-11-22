import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../firebase/FirebaseSetup';
import { writeToDB } from '../firebase/FirebaseHelper';
import LocationManager from '../components/LocationManager';
import { Feather } from '@expo/vector-icons';

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function Address() {
  const [user, setUser] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    }
  }, []);

  // Fetch address suggestions from Google Places API
  const fetchAddressSuggestions = async (text) => {
    try {
      setIsLoadingSuggestions(true);
      console.log('Fetching suggestions for:', text); // Debug log
      
      const apiKey = process.env.EXPO_PUBLIC_mapsApiKey;
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&types=address&key=${apiKey}`;
      
      console.log('API URL:', url); // Debug log
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      if (data.predictions) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Debounced version of fetchAddressSuggestions
  const debouncedFetchSuggestions = debounce(fetchAddressSuggestions, 300);

  const handleAddressChange = (text) => {
    setCurrentAddress(text);
    console.log('Address changed:', text); // Debug log
    
    if (text.length > 1) {
      console.log('Triggering suggestions fetch'); // Debug log
      debouncedFetchSuggestions(text);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setCurrentAddress(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddressSelect = (address) => {
    setCurrentAddress(address);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    if (!currentAddress) {
      Alert.alert('Missing Address', 'Please select or enter an address');
      return;
    }

    const addressData = {
      address: currentAddress,
      userId: user.uid,
      updatedAt: new Date().toISOString(),
    };

    try {
      await writeToDB(addressData, 'addresses');
      Alert.alert('Success', 'Address updated successfully');
    } catch (error) {
      console.error('Error updating address: ', error);
      Alert.alert('Error', 'Failed to update address. Please try again');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A2B29" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather name="map-pin" size={32} color="#FFF" />
        </View>
        <Text style={styles.headerText}>Address</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Delivery Address</Text>
          <TextInput
            style={styles.input}
            value={currentAddress}
            onChangeText={handleAddressChange}
            placeholder="Enter your address"
            autoCompleteType="street-address"
          />
          
          {isLoadingSuggestions && (
            <View style={styles.loadingSuggestionsContainer}>
              <ActivityIndicator size="small" color="#4A2B29" />
            </View>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(item)}
                  >
                    <Feather name="map-pin" size={16} color="#666" style={styles.suggestionIcon} />
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionText}>{item.description}</Text>
                      <Text style={styles.suggestionSecondary}>
                        {item.structured_formatting?.secondary_text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
              />
            </View>
          )}
        </View>

        <View style={styles.mapContainer}>
          <LocationManager onAddressSelect={handleAddressSelect} />
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4A2B29',
  },
  headerText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  iconContainer: {
    marginTop: 20,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    flex: 1,
    zIndex: 1,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 2,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    minHeight: 45,
    backgroundColor: '#FFFFFF',
  },
  loadingSuggestionsContainer: {
    position: 'absolute',
    right: 15,
    top: 45,
    zIndex: 1001,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
    maxHeight: 200,
    marginTop: 5,
  },

  suggestionsList: {
    borderRadius: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  suggestionSecondary: {
    fontSize: 12,
    color: '#666',
  },
  mapContainer: {
    flex: 1,
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  saveButton: {
    backgroundColor: '#4A2B29',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});