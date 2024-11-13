import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import { auth } from "../firebase/FirebaseSetup";

const { width } = Dimensions.get('window');

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginHandler = () => {
    navigation.replace("Login");
  };

  const signupHandler = async () => {
    try {
      if (
        email.length === 0 ||
        password.length === 0 ||
        confirmPassword.length === 0
      ) {
        Alert.alert("Notice", "Please fill in all fields");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Notice", "Passwords don't match");
        return;
      }
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCred.user);
    } catch (error) {
      console.log("Sign up", error);
      if (error.code === "auth/weak-password") {
        Alert.alert("Error", "Password is too weak");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/coffee_assets/arabica_coffee_beans/arabica_coffee_beans_portrait.png')} 
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>The Daily Grind</Text>
            <Text style={styles.subtitle}>
              Join Our Coffee Community
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#666"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Confirm your password"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity 
              style={styles.signupButton} 
              onPress={signupHandler}
            >
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={loginHandler}
            >
              <Text style={styles.loginButtonText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  signupButton: {
    backgroundColor: '#4A2B29',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#4A2B29',
    fontSize: 14,
  },
});