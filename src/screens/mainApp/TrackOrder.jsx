import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import MapView, { Marker, Polyline } from 'react-native-maps';
import { WebView } from 'react-native-webview';

// Dummy data
const orderData = {
    orderId: 'cODsQ29j77aRwAyUGdm',
    estimatedTime: '7 mins',
    restaurant: {
        name: 'Stayfit Restaurant',
        location: 'Karol Bagh, New Delhi, Delhi, India',
        contact: '9999999999',
    },
    delivery: {
        name: 'Piyush Agarwal',
        id: 'AS-01-Z-2951',
        contact: '8888888888',
    },
    billDetails: [
        { id: '1', name: 'Veg Burger', quantity: 1, price: 70, veg: true },
        { id: '2', name: 'Paneer Roll', quantity: 1, price: 150, veg: true },
    ],
    itemTotal: 220,
    deliveryFee: 20,
    totalAmount: 251,
    deliveryTime: '4:31 PM, Jan 20, 2024',
    route: {
        start: { latitude: 28.6507, longitude: 77.2166 },
        end: { latitude: 28.6512, longitude: 77.2295 },
        waypoints: [
            { latitude: 28.6507, longitude: 77.2213 },
            { latitude: 28.6508, longitude: 77.225 },
        ],
    },
};

const DeliveryTrackingScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={()=> navigation.goBack() }>
                    <Icon name="arrow-back" size={24} color="red" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>HELP</Text>
            </View>

            {/* Map View */}
            {/* <View style={{height: 300, width: '100%'}}>
                <WebView
                    source={{ uri: `https://www.google.com/maps/dir/?api=1&origin=${orderData.route.start.latitude},${orderData.route.start.longitude}&destination=${orderData.route.end.latitude},${orderData.route.end.longitude}&mode=bike&wayPoints=28.6507,77.2213+28.6508,77.225` }}
                    style={styles.map}
                />
            </View> */}
            {/* <MapView
                style={styles.map}
                initialRegion={{
                    latitude: orderData.route.start.latitude,
                    longitude: orderData.route.start.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker coordinate={orderData.route.start} title="Start Location" />
                <Marker coordinate={orderData.route.end} title="Restaurant" />
                <Polyline
                    coordinates={[orderData.route.start, ...orderData.route.waypoints, orderData.route.end]}
                    strokeColor="black"
                    strokeWidth={3}
                />
            </MapView> */}

            {/* Delivery Status */}
            <View style={styles.deliveryStatus}>
                <Text style={styles.statusText}>On the Way to {orderData.restaurant.name}</Text>
                <Text style={styles.estimatedTime}>{orderData.estimatedTime}</Text>
            </View>

            {/* Order and Delivery Details */}
            <View style={styles.detailsContainer}>
                {/* Restaurant Details */}
                <View style={styles.detailSection}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/50' }}
                        style={styles.restaurantImage}
                    />
                    <View style={styles.textDetails}>
                        <Text style={styles.restaurantName}>{orderData.restaurant.name}</Text>
                        <Text style={styles.restaurantLocation}>{orderData.restaurant.location}</Text>
                    </View>
                    <TouchableOpacity onPress={()=> Linking.openURL(`tel:${orderData.restaurant.contact}`)}>
                        <Icon name="call" size={24} color="green" />
                    </TouchableOpacity>
                </View>

                {/* Delivery Person Details */}
                <View style={styles.detailSection}>
                    <Icon name="person-circle" size={50} color="pink" />
                    <View style={styles.textDetails}>
                        <Text style={styles.deliveryName}>{orderData.delivery.name}</Text>
                        <Text style={styles.deliveryId}>{orderData.delivery.id}</Text>
                    </View>
                    <TouchableOpacity onPress={()=> Linking.openURL(`tel:${orderData.delivery.contact}`)}>
                        <Icon name="call" size={24} color="green" />
                    </TouchableOpacity>
                </View>

                {/* Bill Details */}
                <View style={styles.billContainer}>
                    <Text style={styles.billTitle}>Bill Details</Text>
                    <FlatList
                        data={orderData.billDetails}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.billItem}>
                                <View style={styles.billIcon}>
                                    <View style={{ borderColor: item.veg ? 'green' : 'red', ...styles.vegIndicator }}>
                                        <View style={{ backgroundColor: item.veg ? 'green' : 'red', ...styles.vegDot }} />
                                    </View>
                                    <Text style={styles.billItemName}>{item.name} ({item.quantity})</Text>
                                </View>
                                <Text style={styles.billItemPrice}>₹{item.price}</Text>
                            </View>
                        )}
                    />
                    <View style={styles.billSummary}>
                        <Text style={styles.summaryText}>Item Total</Text>
                        <Text style={styles.summaryPrice}>₹{orderData.itemTotal}</Text>
                    </View>
                    <View style={styles.billSummary}>
                        <Text style={styles.summaryText}>Delivery fee</Text>
                        <Text style={styles.summaryPrice}>₹{orderData.deliveryFee}</Text>
                    </View>
                    <View style={styles.billSummary}>
                        <Text style={[styles.summaryText, { color: 'green' }]}>Total</Text>
                        <Text style={[styles.summaryPrice, { color: 'green' }]}>₹{orderData.totalAmount}</Text>
                    </View>
                    <Text style={styles.deliveryTime}>{orderData.deliveryTime}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
    headerTitle: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold',
    },
    map: {
        height: 200,
        width: '100%',
    },
    deliveryStatus: { padding: 15 },
    statusText: { fontSize: 16, color: 'gray' },
    estimatedTime: { fontSize: 18, fontWeight: 'bold', color: 'black' },
    detailsContainer: { paddingHorizontal: 15 },
    detailSection: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    restaurantImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    textDetails: { flex: 1 },
    restaurantName: { fontSize: 16, fontWeight: 'bold', color: 'black' },
    restaurantLocation: { fontSize: 14, color: 'gray' },
    deliveryName: { fontSize: 16, fontWeight: 'bold', color: 'black' },
    deliveryId: { fontSize: 14, color: 'gray' },
    billContainer: { backgroundColor: '#f5f5f5', padding: 10, borderRadius: 5, marginVertical: 15 },
    billTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: 'black' },
    billItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    billIcon: { flexDirection: 'row', alignItems: 'center' },
    vegIndicator: { borderWidth: 1, borderRadius: 3, height: 18, width: 18, alignItems: 'center', justifyContent: 'center' },
    vegDot: { height: 10, width: 10, borderRadius: 5 },
    billItemName: { marginLeft: 5, fontSize: 15, color: 'black' },
    billItemPrice: { fontSize: 15, color: 'black' },
    billSummary: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    summaryText: { fontSize: 15, color: 'gray' },
    summaryPrice: { fontSize: 15, color: 'black' },
    deliveryTime: { fontSize: 14, color: 'gray', textAlign: 'center', marginTop: 10 },
});

export default DeliveryTrackingScreen;
