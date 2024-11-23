import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { auth, database } from "../firebase/FirebaseSetup";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

export default function PaymentMethods() {
  const [cards, setCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cardHolder: '',
    cvv: ''
  });

  // 获取已保存的支付卡
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const q = query(
        collection(database, 'payment_methods'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const cardsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCards(cardsData);
    } catch (error) {
      console.error('Error fetching cards:', error);
      Alert.alert('Error', 'Failed to load payment methods');
    }
  };

  const handleAddCard = async () => {
    // 基本验证
    if (!newCard.cardNumber || !newCard.expiryDate || !newCard.cardHolder || !newCard.cvv) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const cardData = {
        ...newCard,
        userId: auth.currentUser.uid,
        // 只保存卡号后四位
        cardNumberMasked: '****' + newCard.cardNumber.slice(-4),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(database, 'payment_methods'), cardData);
      setShowAddCard(false);
      setNewCard({ cardNumber: '', expiryDate: '', cardHolder: '', cvv: '' });
      fetchCards();
    } catch (error) {
      console.error('Error adding card:', error);
      Alert.alert('Error', 'Failed to add card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(database, 'payment_methods', cardId));
              fetchCards();
            } catch (error) {
              console.error('Error deleting card:', error);
              Alert.alert('Error', 'Failed to delete card');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <Text style={styles.headerSubtitle}>Manage your payment cards</Text>
      </View>

      {/* Saved Cards Section */}
      <View style={styles.cardsContainer}>
        {cards.map((card) => (
          <View key={card.id} style={styles.cardItem}>
            <View style={styles.cardInfo}>
              <Feather name="credit-card" size={24} color="#4A2B29" />
              <View style={styles.cardDetails}>
                <Text style={styles.cardNumber}>{card.cardNumberMasked}</Text>
                <Text style={styles.cardExpiry}>Expires {card.expiryDate}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteCard(card.id)}
              style={styles.deleteButton}
            >
              <Feather name="trash-2" size={20} color="#FF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add New Card Button */}
      {!showAddCard && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddCard(true)}
        >
          <Feather name="plus" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Add New Card</Text>
        </TouchableOpacity>
      )}

      {/* Add New Card Form */}
      {showAddCard && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Card</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={newCard.cardNumber}
              onChangeText={(text) => setNewCard({...newCard, cardNumber: text})}
              keyboardType="numeric"
              maxLength={16}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={newCard.expiryDate}
                onChangeText={(text) => setNewCard({...newCard, expiryDate: text})}
                maxLength={5}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                value={newCard.cvv}
                onChangeText={(text) => setNewCard({...newCard, cvv: text})}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Holder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="JOHN DOE"
              value={newCard.cardHolder}
              onChangeText={(text) => setNewCard({...newCard, cardHolder: text})}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowAddCard(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleAddCard}
            >
              <Text style={styles.saveButtonText}>Save Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4A2B29',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  cardsContainer: {
    backgroundColor: '#FFF',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetails: {
    marginLeft: 15,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A2B29',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  formContainer: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A2B29',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4A2B29',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});