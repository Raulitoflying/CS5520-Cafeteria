import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { auth } from '../firebase/FirebaseSetup';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function EditProfile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
      setPhone('');
      setAddress('');
    }
  }, []);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const handleSave = async () => {
    try {
      await auth.currentUser.updateProfile({
        displayName: displayName,
      });
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const InputField = ({ label, value, onChangeText, icon, editable = true }) => (
    <View style={styles.inputContainer}>
      <Feather name={icon} size={20} color="#4A2B29" style={styles.inputIcon} />
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            !editable && styles.inputDisabled
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#666"
          editable={editable}
        />
      </View>
    </View>
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Feather name="coffee" size={40} color="#4A2B29" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../assets/app_images/avatar.png')}
              style={styles.avatar}
              defaultSource={require('../assets/app_images/avatar.png')}
            />
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleImagePick}
            >
              <Feather name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <InputField
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            icon="user"
          />
          <InputField
            label="Email"
            value={user.email}
            onChangeText={() => {}}
            icon="mail"
            editable={false}
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

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  headerText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: 20,
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
  formContainer: {
    backgroundColor: "#FFF",
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 15,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingVertical: 5,
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  saveButton: {
    backgroundColor: "#4A2B29",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});