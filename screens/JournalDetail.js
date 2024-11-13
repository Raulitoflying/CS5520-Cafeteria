import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { database, auth } from '../firebase/FirebaseSetup';
import CartCard from '../components/CartCard';
import { deleteFromDB } from '../firebase/FirebaseHelper';

export default function JournalDetail() {
  const [journal, setJournal] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, 'journals'),
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => ({
            firebaseId: doc.id,
            ...doc.data(),
          }))
          .filter((entry) => entry.userId === currentUser.uid);
        setJournal(items);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Text>JournalDetail</Text>
    </View>
  )
}

const styles = StyleSheet.create({})