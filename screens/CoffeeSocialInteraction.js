import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { database } from "../firebase/FirebaseSetup"; 
import { useNavigation } from '@react-navigation/native';

export default function CoffeeSocialInteraction() {
  const [dailyTip, setDailyTip] = useState(null);
  const [funFact, setFunFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // GPT Chat Integration
  const [userQuery, setUserQuery] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch data from Firebase
  const fetchCoffeeContent = async (type, setState) => {
    setLoading(true);
    try {
        const q = query(
            collection(database, "coffeeFacts"),
            where("type", "==", type), // Filter by "type"
            orderBy("createdAt", "desc"), // Order by "createdAt"
            limit(1) // Limit the results
          );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setState(data.fact);
      } else {
        throw new Error("No content found");
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      Alert.alert("Error", `Failed to fetch ${type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch daily tip and fun fact on component mount
  useEffect(() => {
    fetchCoffeeContent("dailyTip", setDailyTip);
    fetchCoffeeContent("funFact", setFunFact);
  }, []);

  // ChatGPT API Call
  const handleChatSubmit = async () => {
    if (userQuery.trim() === "") {
      Alert.alert("Error", "Please enter a question about coffee!");
      return;
    }
    setChatLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer process.env.EXPO_PUBLIC_openAIApiKey`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: `You are a coffee expert. Answer this user's question: ${userQuery}`,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a response from ChatGPT.");
      }

      const data = await response.json();
      setChatResponse(data.choices[0].text.trim());
    } catch (error) {
      console.error("Error with ChatGPT API:", error);
      Alert.alert("Error", "Failed to get a response from ChatGPT.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Coffee Social Interaction</Text>

      {/* Coffee Knowledge Section */}
      <View style={styles.knowledgeSection}>
        <Text style={styles.sectionTitle}>Daily Coffee Knowledge</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#8B4513" />
        ) : (
          <Text style={styles.knowledgeText}>{dailyTip || "Loading..."}</Text>
        )}

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => fetchCoffeeContent("dailyTip", setDailyTip)}
        >
          <FontAwesome name="refresh" size={18} color="white" />
          <Text style={styles.refreshButtonText}>Refresh Tip</Text>
        </TouchableOpacity>
      </View>

      {/* Fun Fact Section */}
      <View style={styles.funFactSection}>
        <Text style={styles.sectionTitle}>Fun Fact about Coffee</Text>
        <ScrollView>
          <Text style={styles.funFactText}>{funFact || "Loading..."}</Text>
        </ScrollView>
      </View>

      {/* GPT Chat Section */}
      <View style={styles.chatSection}>
        <Text style={styles.sectionTitle}>Ask the Coffee Expert</Text>
        <TextInput
          style={styles.chatInput}
          placeholder="Ask a question about coffee..."
          placeholderTextColor="#999"
          value={userQuery}
          onChangeText={setUserQuery}
        />
        <TouchableOpacity style={styles.chatButton} onPress={handleChatSubmit}>
          <FontAwesome name="paper-plane" size={18} color="white" />
          <Text style={styles.chatButtonText}>Ask ChatGPT</Text>
        </TouchableOpacity>
        {chatLoading ? (
          <ActivityIndicator size="large" color="#8B4513" style={styles.chatLoader} />
        ) : (
          chatResponse && (
            <View style={styles.chatResponse}>
              <Text style={styles.chatResponseText}>{chatResponse}</Text>
            </View>
          )
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
  knowledgeSection: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A2B29",
    marginBottom: 8,
  },
  knowledgeText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    marginBottom: 16,
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
  funFactSection: {
    backgroundColor: "#FFF5E6",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  funFactText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  chatSection: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  chatInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B4513",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  chatButtonText: {
    color: "white",
    fontSize: 14,
    marginLeft: 8,
  },
  chatLoader: {
    marginTop: 16,
  },
  chatResponse: {
    marginTop: 16,
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
  },
  chatResponseText: {
    fontSize: 16,
    color: "#333",
  },
});