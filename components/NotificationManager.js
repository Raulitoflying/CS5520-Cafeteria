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
    console.error("Error in verifyPermission:", err);
    return false;
  }
}

export async function scheduleDailyNotification(hour, minute) {
  try {
    const permissions = await Notifications.getPermissionsAsync();
    if (!permissions.granted) {
      const requestPermission = await Notifications.requestPermissionsAsync();
      if (!requestPermission.granted) {
        Alert.alert("Insufficient Permissions", "Please allow notification permissions to schedule daily reminders.");
        return;
      }
    }

    // await Notifications.cancelAllScheduledNotificationsAsync();
    // console.log("All scheduled notifications cleared.");

    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log("Scheduled Notifications:", scheduledNotifications);

    const now = new Date();
    const triggerTime = new Date();
    triggerTime.setHours(hour, minute, 0, 0);

    // If the scheduled time has already passed today, set it to the next day
    if (triggerTime <= now) {
      triggerTime.setDate(triggerTime.getDate() + 1);
    }

    console.log("Current time:", now.toLocaleString());
    console.log("Scheduled notification time:", triggerTime.toLocaleString());

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Reminder",
        body: "Don't forget to buy a cup of coffee today!",
      },
      trigger: {
        type: "daily",
        hour: hour,
        minute: minute,
        repeats: true,
      },
    });

    console.log("Notification scheduled successfully, ID:", id);
    Alert.alert("Notification Set", `Your daily notification is set for ${hour}:${minute}`);
  } catch (err) {
    console.error("Failed to schedule notification:", err);
  }
}
