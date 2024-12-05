/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({navigation}) => {
  // Dummy data for cart items
  const [cartItems, setCartItems] = useState([]);

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const fetchCart = async () => {
    axios.get('http://192.168.166.252:3000/api/user/getCart', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('JWT')}`,
      },
    }).then(response => {
      if (response.status === 200) {
        setCartItems(response.data);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Render each cart item
  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={[styles.itemImage, {tintColor: 'gray'}]} />
      <Image source={{ uri: item.image }} style={[styles.itemImage, { position: 'absolute', height: 80, width: 80, left: 10, opacity: item.available ? 1 : 0.3 }]} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: item.available ? 'black' : 'gray' }]}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price} x {item.quantity}</Text>
        <Text style={[styles.itemTotal, { color: item.available ? 'red' : 'gray' }]}>₹{item.price * item.quantity}</Text>
      </View>
      {/* <View style={{ position: 'absolute', left: 0, top: 0, backgroundColor: 'black', opacity: 0.5, height: '125%', width: '105.5%', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}></View> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={()=> navigation.navigate('Checkout')}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'flex-start',
  },
  listContainer: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red', // Accent color for totals
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red', // Accent color for totals
  },
  checkoutButton: {
    backgroundColor: 'red', // Accent color for button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CartScreen;
