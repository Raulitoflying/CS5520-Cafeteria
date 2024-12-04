import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { auth, database } from "../firebase/FirebaseSetup";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { deleteFromDB } from '../firebase/FirebaseHelper';
import { writeToDB } from '../firebase/FirebaseHelper';

export default function PaymentMethods() {
  const [cards, setCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cardHolder: '',
    cvv: '',
  });

  // cardNmber format - add space every 4 digits
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19); // 16 digits + 3 spaces
  };

  // expiryDate format - add slash after 2 digits
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

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
    const errors = [];
  
    // cardNumber validation
    const cardNumberClean = newCard.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      errors.push('Card number is required');
    } else if (!/^\d{16}$/.test(cardNumberClean)) {
      errors.push('Card number must be 16 digits');
    }
  
    // expiryDate validation
    if (!newCard.expiryDate) {
      errors.push('Expiry date is required');
    } else {
      const [month, year] = newCard.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
  
      if (!/^\d{2}\/\d{2}$/.test(newCard.expiryDate)) {
        errors.push('Expiry date must be in MM/YY format');
      } else if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.push('Invalid month in expiry date');
      } else if (
        parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        errors.push('Card has expired');
      }
    }
  
    // cardHolder validation
    if (!newCard.cardHolder) {
      errors.push('Cardholder name is required');
    } else if (!/^[A-Z\s]{2,50}$/.test(newCard.cardHolder)) {
      errors.push('Cardholder name must be 2-50 characters long and in capital letters');
    }
  
    // cvv validation
    if (!newCard.cvv) {
      errors.push('CVV is required');
    } else if (!/^\d{3}$/.test(newCard.cvv)) {
      errors.push('CVV must be 3 digits');
    }
  
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors[0]);
      return;
    }
  
    try {
      const cardData = {
        ...newCard,
        userId: auth.currentUser.uid,
        cardNumberMasked: '****' + cardNumberClean.slice(-4),
        createdAt: new Date().toISOString(),
      };
  
      // use writeToDB method
      await writeToDB(cardData, 'payment_methods');
  
      setShowAddCard(false);
      setNewCard({ cardNumber: '', expiryDate: '', cardHolder: '', cvv: '' });
      fetchCards(); // reload cards
      Alert.alert('Success', 'Card added successfully');
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
              await deleteFromDB(cardId, 'payment_methods'); // use deleteFromDB method
              setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
              Alert.alert('Success', 'Card deleted successfully');
            } catch (error) {
              console.error('Error deleting card:', error);
              Alert.alert('Error', 'Failed to delete card');
            }
          },
        },
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
              onChangeText={(text) => {
                const formatted = formatCardNumber(text);
                setNewCard({...newCard, cardNumber: formatted});
              }}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={newCard.expiryDate}
                onChangeText={(text) => {
                  const formatted = formatExpiryDate(text);
                  setNewCard({...newCard, expiryDate: formatted});
                }}
                maxLength={5}
                keyboardType="numeric"
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
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Holder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="JOHN DOE"
              value={newCard.cardHolder}
              onChangeText={(text) => setNewCard({...newCard, cardHolder: text.toUpperCase()})}
              autoCapitalize="characters"
              maxLength={50}
            />
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowAddCard(false);
                setNewCard({ cardNumber: '', expiryDate: '', cardHolder: '', cvv: '' });
              }}
            >
              <Text style={                 styles.cancelButtonText}>Cancel</Text>
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