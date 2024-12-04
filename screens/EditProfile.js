import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  VirtualizedList,
} from 'react-native';
import { auth } from '../firebase/FirebaseSetup';
import { writeToDB } from '../firebase/FirebaseHelper';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/FirebaseSetup';

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
      setPhone('');
      setAddress('');
      setSelectedImage(currentUser.profileImageUrl || null); 
    }
  }, []);

  // Fetch address suggestions from Google Places API
  const fetchAddressSuggestions = async (text) => {
    try {
      setIsLoadingSuggestions(true);
      const apiKey = process.env.EXPO_PUBLIC_mapsApiKey;
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text
      )}&types=address&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
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
    setAddress(text);
    if (text.length > 1) {
      debouncedFetchSuggestions(text);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setAddress(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Please allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setModalVisible(false); // Close modal after selection
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Please allow access to the camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  
  const handleSave = async () => {
    if (!displayName || !phone || !address || !selectedImage) {
      Alert.alert('Missing Fields', 'Please fill in all fields to save.');
      return;
    }
  
    try {
      const imageUrl = await uploadImageAndGetUrl(selectedImage); // 上传图片并获取公共 URL
  
      const profileData = {
        displayName,
        phone,
        address,
        imageUri: imageUrl, // 使用下载链接而非本地路径
        userId: user.uid,
      };
  
      await writeToDB(profileData, 'profiles');
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const uploadImageAndGetUrl = async (uri) => {
    try {
      const response = await fetch(uri); // 获取本地图片文件
      const blob = await response.blob();
      const fileName = `${user.uid}.jpg`; // 使用用户 UID 作为文件名
      const storageRef = ref(storage, `profile_images/${fileName}`); // Firebase Storage 路径
  
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error), // 上传错误处理
          () => resolve() // 上传成功
        );
      });
  
      // 获取图片下载链接
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  // Render method for VirtualizedList
  const getItemCount = () => 1;
  const getItem = () => ({});
  const renderItem = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.avatar} />
          ) : (
            <Feather name="camera" size={40} color="#fff" />
          )}
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={openImagePicker} style={styles.modalButton}>
              <Text style={styles.buttonText}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openCamera} style={styles.modalButton}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.formContainer}>
        <InputField label="Display Name" value={displayName} onChangeText={setDisplayName} />
        <InputField
          label="Email"
          value={user?.email}
          onChangeText={() => {}}
          editable={false}
        />
        <InputField label="Phone" value={phone} onChangeText={setPhone} />
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={handleAddressChange}
            placeholder="Enter your address"
          />
          {isLoadingSuggestions && (
            <ActivityIndicator size="small" color="#4A2B29" style={styles.loadingSuggestions} />
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
                    <Text style={styles.suggestionText}>{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <VirtualizedList
        data={[{}]}
        renderItem={renderItem}
        keyExtractor={() => 'edit-profile'}
        getItemCount={getItemCount}
        getItem={getItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      />
    </View>
  );
}

const InputField = ({ label, value, onChangeText, editable = true }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: { 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#4A2B29' 
  },
  headerText: { 
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: '600', 
    marginTop: 10 
  },
  avatarContainer: { 
    marginTop: 20 
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50 
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  inputContainer: { 
    marginBottom: 20 
  },
  inputLabel: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 5 
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: '#4A2B29',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16 
  },
});