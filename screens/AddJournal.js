import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebase/FirebaseSetup';
import { writeToDB } from '../firebase/FirebaseHelper';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/FirebaseSetup';

export default function AddJournal() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigator = useNavigation();

  // Open the image picker for the gallery
  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Please allow access to photos to select an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const imageUri = await handleImageData(result.assets[0].uri);
      setSelectedImage(imageUri);
      setModalVisible(false);
    }
  };

  // Open the camera to take a photo
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Please allow access to the camera to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = await handleImageData(result.assets[0].uri);
      setSelectedImage(imageUri);
      setModalVisible(false);
    }
  };

  async function handleImageData(uri) {
    try {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`fetch error happen with status ${response.status}`);
        }
        const blob = await response.blob();
        const imageName = uri.substring(uri.lastIndexOf('/') + 1);
        const imageRef = await ref(storage, `images/${imageName}`);
        const uploadResult = await uploadBytesResumable(imageRef, blob);
        console.log('Upload image successfully', uploadResult.metadata.fullPath);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading image: ', error);
    }
  }

  const handleSubmit = async() => {
    if (!title || !content || !selectedImage) {
      Alert.alert('Missing Fields', 'Please fill in all fields to submit your journal entry.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Not Logged In', 'Please log in to submit a journal entry.');
      return;
    }

    const journalData = {
      title,
      content,
      date: new Date().toISOString(),
      imageUri: selectedImage,
      userId: user.uid,
    };

    try { await writeToDB(journalData, 'journals');
    navigator.goBack();
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Failed to submit journal entry. Please try again.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      {/* Image selection area with conditional rendering */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imageButton}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.imageButtonImage} />
        ) : (
          <Text style={styles.addImageText}>+</Text>
        )}
      </TouchableOpacity>
      </View>

      {/* Modal for choosing between gallery and camera */}
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

      {/* Title and Content inputs */}
      <TextInput
        placeholder="Add a title"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
      />
      <TextInput
        placeholder="Write Content Here"
        value={content}
        onChangeText={setContent}
        style={styles.contentInput}
        multiline
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButton: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  imageButtonImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  addImageText: {
    fontSize: 36,
    color: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  titleInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 8,
    marginBottom: 15,
    color: '#333',
  },
  contentInput: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 5,
    height: 200,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
