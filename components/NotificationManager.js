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

export async function scheduleDailyNotification(hour, minute) {
  try {
    const hasPermission = await Notifications.getPermissionsAsync();
    if (!hasPermission.granted) {
      const requestPermission = await Notifications.requestPermissionsAsync();
      if (!requestPermission.granted) {
        Alert.alert("权限不足", "请允许通知权限以调度每日提醒");
        return;
      }
    }

    const now = new Date(); // 当前时间
    const triggerTime = new Date(); // 创建调度时间
    triggerTime.setHours(hour, minute, 0, 0); // 设置小时和分钟，秒和毫秒置0

    console.log("当前时间:", now.toLocaleString());
    console.log("调度时间（初始）:", triggerTime.toLocaleString());

    // 如果目标时间已经过了，则将通知时间调整为第二天
    if (triggerTime <= now) {
      console.log("目标时间已过，调整到第二天");
      triggerTime.setDate(triggerTime.getDate() + 1);
    }

    console.log("调整后的调度时间:", triggerTime.toLocaleString());

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "每日提醒",
        body: "别忘了添加您的每日目标！",
      },
      trigger: {
        type: 'calendar',
        date: triggerTime, // 使用本地时间直接调度
        repeats: true, // 每天重复
      },
    });

    console.log("通知已调度，ID:", id);
    Alert.alert("设置成功", `每日通知已设置为 ${hour}:${minute}`);
  } catch (err) {
    console.error("通知调度失败:", err);
  }
}




