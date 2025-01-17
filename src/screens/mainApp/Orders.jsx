/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersScreen = () => {
    // Fetching orders from API
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        // Fetch orders from API
        axios.get('http://192.168.176.252:3000/api/user/fetchAllOrders', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await AsyncStorage.getItem('JWT')}`,
            },
        })
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data.orders);
                    setOrders(response.data.orders);
                }
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Orders Screen</Text>
            <FlatList
                data={orders}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.row}>
                            <Text style={[styles.text, {color: 'gray'}]}>{item._id}</Text>
                            <Text style={styles.text}>{item.status}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>{new Date(item.created_at).toISOString()}</Text>
                            <Text style={styles.text}>₹{item.amount / 100}</Text>
                        </View>
                        <Text style={styles.text}>Items:</Text>
                        <FlatList
                            data={item.items}
                            keyExtractor={dish => dish._id}
                            renderItem={({ item }) => (
                                <View style={{marginVertical: 2}}>
                                    <View style={styles.row}>
                                        <Text style={styles.text}>{item.name}</Text>
                                        <Text style={styles.text}>{item.quantity}</Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.text}>₹{item.price * item. quantity}</Text>
                                            <View style={[styles.vegBorder, { borderColor: item.veg ? 'green' : 'red'}]}>
                                                <View style={[styles.vegCercle, { backgroundColor: item.veg ? 'green' : 'red'}]}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    item: {
        marginVertical: 10,
        padding: 20,
        backgroundColor: '#E8EBEA',
        borderRadius: 5,
        width: '100%',
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom: 2,
    },
    text: {
        color: 'black',
    },
    vegBorder: {
        borderWidth: 1,
        marginLeft: 5,
        borderRadius: 5,
    },
    vegCercle: {
        height: 13,
        width: 13,
        borderRadius: 10,
        margin: 3,
    },
});

export default OrdersScreen;
