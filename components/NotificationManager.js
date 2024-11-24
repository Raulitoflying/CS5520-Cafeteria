import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

export async function verifyPermission() {
  try {
    const permissionsResponse = await Notifications.getPermissionsAsync();
    if (permissionsResponse.granted) {
      return true;
    }
    const requestedPermissionsResponse =
      await Notifications.requestPermissionsAsync();
    return requestedPermissionsResponse.granted;
  } catch (err) {
    console.error("verifyPermission error:", err);
    return false;
  }
}

export async function scheduleNotification() {
  try {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      Alert.alert("Permission Required", "You need to grant notification permissions.");
      return;
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Profile Notification",
        body: "This is a manually triggered notification!",
      },
      trigger: null, // Immediate notification
    });
    console.log("Notification ID:", id);
  } catch (err) {
    console.error("scheduleNotification error:", err);
  }
}