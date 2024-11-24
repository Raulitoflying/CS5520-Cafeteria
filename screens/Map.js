import { StyleSheet, Text, Button } from "react-native";
import React, { useState } from "react";

import MapView, { Marker } from "react-native-maps";

export default function Map({ navigation }) {
    const [selectedLocation, setSelectedLocation] = useState(null);
    function confirmHandler() {
      //navigate to Profile and pass selectedLocation as params
      navigation.navigate("Address", { selectedLocation });
    }
  return (
    <>
      <MapView
        onPress={(e) => {
          setSelectedLocation({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
        }}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      <Button
        disabled={!selectedLocation}
        title="Confirm Selected Location"
        onPress={confirmHandler}
      />
    </>
  );
}

const styles = StyleSheet.create({ map: { flex: 1 } });