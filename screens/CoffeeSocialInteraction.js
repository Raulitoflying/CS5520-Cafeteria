import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

export default function CoffeeSocialInteraction() {
  const [dailyTip, setDailyTip] = useState(null);
  const [funFact, setFunFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [chatResponse, setChatResponse] = useState(null);

  const OPENAI_API_KEY = process.env.EXPO_PUBLIC_openAIApiKey;

  const fetchChatResponse = async (prompt, setState) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://free.v36.cm/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a coffee expert." },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setState(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error("Error fetching from ChatGPT API:", error);
      Alert.alert("Error", "Failed to fetch content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch daily tip and fun fact
  const fetchDailyTip = () => fetchChatResponse("Provide a daily coffee tip.", setDailyTip);
  const fetchFunFact = () => fetchChatResponse("Share a fun fact about coffee.", setFunFact);

  const handleChatSubmit = () => {
    if (userQuery.trim() === "") {
      Alert.alert("Error", "Please enter a question about coffee!");
      return;
    }
    fetchChatResponse(userQuery, setChatResponse);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Coffee Social Interaction</Text>

      {/* Daily Tip Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Coffee Tip</Text>
        {loading && !dailyTip ? (
          <ActivityIndicator size="large" color="#8B4513" />
        ) : (
          <Text style={styles.sectionContent}>{dailyTip || "Loading..."}</Text>
        )}
        <TouchableOpacity style={styles.refreshButton} onPress={fetchDailyTip}>
          <FontAwesome name="refresh" size={18} color="white" />
          <Text style={styles.refreshButtonText}>Refresh Tip</Text>
        </TouchableOpacity>
      </View>

      {/* Fun Fact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fun Fact about Coffee</Text>
        {loading && !funFact ? (
          <ActivityIndicator size="large" color="#8B4513" />
        ) : (
          <Text style={styles.sectionContent}>{funFact || "Loading..."}</Text>
        )}
        <TouchableOpacity style={styles.refreshButton} onPress={fetchFunFact}>
          <FontAwesome name="refresh" size={18} color="white" />
          <Text style={styles.refreshButtonText}>Refresh Fact</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ask the Coffee Expert</Text>
        <TextInput
          style={styles.input}
          placeholder="Ask a question about coffee..."
          placeholderTextColor="#999"
          value={userQuery}
          onChangeText={setUserQuery}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleChatSubmit}>
          <FontAwesome name="paper-plane" size={18} color="white" />
          <Text style={styles.submitButtonText}>Ask Our Virtual Expert</Text>
        </TouchableOpacity>
        {loading && !chatResponse ? (
          <ActivityIndicator size="large" color="#8B4513" />
        ) : (
          chatResponse && <Text style={styles.sectionContent}>{chatResponse}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A2B29",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A2B29",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B4513",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  refreshButtonText: {
    color: "white",
    fontSize: 14,
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B4513",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
    marginLeft: 8,
  },
});