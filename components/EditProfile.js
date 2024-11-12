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
} from 'react-native';
import { auth } from '../firebase/FirebaseSetup';
import { writeToDB } from '../firebase/FirebaseHelper';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
      setPhone('');
      setAddress('');
    }
  }, []);

  // Open the image picker for gallery
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

  // Open the camera to take a photo
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

    const profileData = {
      displayName,
      phone,
      address,
      imageUri: selectedImage,
      userId: user.uid,
    };

    try { await writeToDB(profileData, 'profiles');
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigator.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
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
        <InputField 
        label="Display Name" 
        value={displayName} 
        onChangeText={setDisplayName} 
        icon="user"
        />
        <InputField 
        label="Email" 
        value={user?.email} 
        onChangeText={() => {}} 
        editable={false} 
        icon="email"
        />
        <InputField 
        label="Phone" 
        value={phone} 
        onChangeText={setPhone} 
        icon="phone"
        />
        <InputField 
        label="Address" 
        value={address} 
        onChangeText={setAddress} 
        icon="map-pin"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const InputField = ({ label, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { alignItems: 'center', padding: 20, backgroundColor: '#4A2B29' },
  headerText: { color: '#FFF', fontSize: 20, fontWeight: '600', marginTop: 10 },
  avatarContainer: { marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  formContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
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
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
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
  buttonText: { color: '#fff', fontSize: 16 },
});
