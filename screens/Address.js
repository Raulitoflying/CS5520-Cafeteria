import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { auth } from "../firebase/FirebaseSetup";
import LocationManager from "../components/LocationManager";


export default function Address() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Email: {user.email}</Text>
      <Text>UID: {user.uid}</Text>
      <LocationManager />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});