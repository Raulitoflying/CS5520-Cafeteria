import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { writeToDB } from "../firebase/FirebaseHelper";
import { auth } from "../firebase/FirebaseSetup"; 

export default function HelpSupport() {
  const [userQuestion, setUserQuestion] = useState(""); // userQuestion state
  const currentUser = auth.currentUser; // Get current user

  const faqs = [
    {
      question: "How can I reset my password?",
      answer: "Go to Account Settings and tap on 'Change Password'. Follow the instructions to reset your password.",
    },
    {
      question: "How do I add a payment method?",
      answer: "Navigate to Payment Methods in your profile and click on 'Add New Card'. Fill out the required details.",
    },
    {
      question: "How can I contact customer support?",
      answer: "You can contact us via email at support@cafeteria.com or by tapping the button below.",
    },
  ];

  const handleContactSupport = () => {
    const email = "support@cafeteria.com";
    const subject = "Help Request";
    const body = "Hi Cafeteria Support Team, I need help with...";
    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto).catch(() =>
      Alert.alert("Error", "Unable to open email app.")
    );
  };

  const handleSubmitQuestion = async () => {
    if (!userQuestion.trim()) {
      Alert.alert("Error", "Please enter a valid question.");
      return;
    }

    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to submit a question.");
      return;
    }

    try {
      const questionData = {
        userId: currentUser.uid, // record user ID
        userEmail: currentUser.email, // record user email
        question: userQuestion.trim(),
        createdAt: new Date().toISOString(),
      };
      await writeToDB(questionData, "user_questions");
      Alert.alert("Success", "Your question has been submitted!");
      setUserQuestion("");
    } catch (error) {
      console.error("Error submitting question:", error);
      Alert.alert("Error", "Failed to submit your question. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>We’re here to assist you</Text>
      </View>

      {/* FAQ Section */}
      <View style={styles.faqContainer}>
        <Text style={styles.sectionTitle}>FAQs</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              <Feather name="help-circle" size={16} color="#4A2B29" /> {faq.question}
            </Text>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        ))}
      </View>

      {/* Submit Question Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.sectionTitle}>Submit Your Question</Text>
        <TextInput
          style={styles.input}
          value={userQuestion}
          onChangeText={setUserQuestion}
          placeholder="Type your question here..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitQuestion}
        >
          <Text style={styles.submitButtonText}>Submit Question</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Support Button */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={handleContactSupport}
      >
        <Feather name="mail" size={20} color="#FFF" />
        <Text style={styles.contactButtonText}>Contact Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    backgroundColor: "#4A2B29",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 5,
  },
  faqContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A2B29",
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F9F9F9",
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4A2B29",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  contactButton: {
    flexDirection: "row",
    backgroundColor: "#4A2B29",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contactButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});