import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Notifications from "expo-notifications";

export default function NotificationManager() {
  async function verifyPermission() {
    try {
      const permissionsResponse = await Notifications.getPermissionsAsync();
      if (permissionsResponse.granted) {
        return true;
      }
      const requestedPermissionsResponse =
        await Notifications.requestPermissionsAsync();
      return requestedPermissionsResponse.granted;
    } catch (err) {
      console.log("verify permissions ", err);
    }
  }
  async function scheduleNotificationHandler() {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert("You need to give permission to schedule a notification");
      }
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "My first Notification",
          body: "This is my first Notificaftion",
        },
        trigger: { seconds: 3 },
      });
      console.log(id);
    } catch (err) {
      console.log("schedule notification ", err);
    }
  }
  
  return (
    <View>
      <Button
        title="Remind me to add my daily goals"
        onPress={scheduleNotificationHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({});