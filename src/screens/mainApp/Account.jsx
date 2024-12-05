/* eslint-disable react-native/no-inline-styles */
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dummy data for user profile and past orders
// const pastOrders = [
//     {
//         id: '1',
//         restaurant: 'Stayfit Restaurant',
//         address: 'Karol Bagh, New Delhi, Delhi, India',
//         amount: '₹251',
//         items: [
//             { name: 'VEG BURGER', quantity: 1 },
//             { name: 'Paneer Roll', quantity: 1 },
//         ],
//         date: 'Jan 20, 2024, 4:31 PM',
//         status: 'Accepted',
//         trackable: true,
//     },
//     {
//         id: '2',
//         restaurant: 'Stayfit Restaurant',
//         address: 'Karol Bagh, New Delhi, Delhi, India',
//         amount: '₹324.50',
//         items: [
//             { name: 'VEG BURGER', quantity: 2 },
//             { name: 'Paneer Roll', quantity: 1 },
//         ],
//         date: 'Jan 15, 2024, 12:22 AM',
//         status: 'Cancelled',
//         trackable: false,
//     },
//     {
//         id: '3',
//         restaurant: 'Stayfit Restaurant',
//         address: 'Karol Bagh, New Delhi, Delhi, India',
//         amount: '₹324.50',
//         items: [
//             { name: 'VEG BURGER', quantity: 2 },
//             { name: 'Paneer Roll', quantity: 1 },
//         ],
//         date: 'Jan 15, 2024, 12:22 AM',
//         status: 'Cancelled',
//         trackable: false,
//     },
// ];

const AccountScreen = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState({});
    const [pastOrders, setPastOrders] = useState(undefined);

    const fetchData = async () => {
        axios.get('http://192.168.166.252:3000/api/user/getAccountDetails/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await AsyncStorage.getItem('JWT')}`,
            },
        }).then(res => {
            if (res.status === 200) {
                setUserProfile(res.data);
                console.log(res.data);
            }
        }).catch(err => console.log(err));

        axios.get('http://192.168.166.252:3000/api/user/getPastOrders/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await AsyncStorage.getItem('JWT')}`,
            },
        }).then(res => {
            if (res.status === 200) {
                setPastOrders(res.data);
                console.log(res.data);
            }
        }).catch(err => console.log(err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Render each past order
    const renderOrder = ({ item }) => (
        <View style={styles.orderContainer}>
            <View style={styles.orderHeader}>
                <Text style={styles.restaurantName}>{item.restaurant}</Text>
                <Text style={{ color: item.status === 'Accepted' ? 'green' : 'red' }}>{item.status}</Text>
            </View>
            <Text style={styles.orderAddress}>{item.address}</Text>
            <Text style={styles.orderAmount}>{item.amount}</Text>
            <View style={styles.orderItems}>
                {item.items.map((foodItem, index) => (
                    <Text key={index} style={styles.orderItem}>
                        {foodItem.name} ({foodItem.quantity})
                    </Text>
                ))}
            </View>
            <Text style={styles.orderDate}>{item.date}</Text>
            {item.trackable ? (
                <TouchableOpacity style={styles.trackButton} onPress={() => navigation.navigate('TrackOrder')}>
                    <Text style={styles.trackButtonText}>TRACK</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.reorderButton} onPress={() => navigation.navigate('Checkout')}>
                    <Text style={styles.reorderButtonText}>REORDER</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* User Profile Section */}
            <View style={styles.profileContainer}>
                <View >
                    {/* <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
                    <Icon style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'red', borderRadius: 100, padding: 2 }} name="pencil" size={15} color="white" /> */}
                    <Icon name="person-circle" size={50} color="red" />
                </View>
                <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>{userProfile.name}</Text>
                    <Text style={styles.profileContact}>{userProfile.phone} | {userProfile.email}</Text>
                </View>
                {/* <TouchableOpacity>
                    <Text style={styles.editText}>EDIT</Text>
                </TouchableOpacity> */}
            </View>
            {/* <View style={{ height: 80, borderWidth: 0 }}></View> */}

            {/* Manage Address */}
            <TouchableOpacity style={styles.manageAddressButton} onPress={() => navigation.navigate('ManageAddress')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="home-outline" size={20} color={'red'} />
                    <Text style={styles.manageAddressText}>Manage Addresses</Text>
                </View>
                <Icon name="chevron-forward-outline" size={20} color={'red'} />
            </TouchableOpacity>

            {/* Past Orders Section */}
            {
                pastOrders && <>
                    <Text style={styles.sectionTitle}>PAST ORDERS</Text>
                    <FlatList
                        data={pastOrders}
                        renderItem={renderOrder}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            }

        </ScrollView>
    );
};

export default AccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        // position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    profileDetails: {
        flex: 1,
        marginLeft: 10,
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    profileContact: {
        color: 'gray',
        fontSize: 14,
    },
    editText: {
        color: 'red',
        fontWeight: 'bold',
    },
    manageAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    manageAddressText: {
        fontSize: 16,
        color: 'black',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
        marginVertical: 15,
    },
    orderContainer: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    orderAddress: {
        color: 'gray',
        marginBottom: 5,
    },
    orderAmount: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    orderItems: {
        marginBottom: 5,
    },
    orderItem: {
        color: 'gray',
    },
    orderDate: {
        color: 'gray',
        fontSize: 12,
        marginBottom: 10,
    },
    trackButton: {
        backgroundColor: '#ff4040',
        borderRadius: 5,
        paddingVertical: 5,
        alignItems: 'center',
    },
    trackButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    reorderButton: {
        borderWidth: 1,
        borderColor: '#ff4040',
        borderRadius: 5,
        paddingVertical: 5,
        alignItems: 'center',
    },
    reorderButtonText: {
        color: '#ff4040',
        fontWeight: 'bold',
    },
});
