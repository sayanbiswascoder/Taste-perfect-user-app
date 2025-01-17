/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CheckoutScreen = ({ navigation, route }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [restaurant, setRestaurant] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [charges, setCharges] = useState(0);
    const [itemTotal, setItemTotal] = useState(0);
    const [totalToPay, setTotalToPay] = useState(0);
    const [address, setAddress] = useState(false);

    const verifyOrderDetails = async () => {
        let dishes = route.params.cartItems;
        let isSameRestaurant = true;
        for (let i = 0; i < dishes.length - 1; i++) {
            if (dishes[i].restaurant !== dishes[i + 1].restaurant) {
                isSameRestaurant = false;
                break;
            }
        }
        if (!isSameRestaurant) {
            Alert.alert('Warning', 'Please select dishes from the same restaurant.');
            return;
        }
        axios.post('http://192.168.176.252:3000/api/user/chargesRestaurantsDetails',{
            dishes: route.params.cartItems,
            restaurantId: route.params.cartItems[0].restaurantId,
            address: await AsyncStorage.getItem('address'),
        }).then(response => {
            console.log(response.data);
            if(response.status === 200) {
                setCharges(response.data.charges);
                setCartItems(route.params.cartItems);
                setRestaurant(response.data.restaurant);
                setDeliveryFee(response.data.deliveryFee);
                setItemTotal(calculateItemTotal());
            }
        }).catch(err => {
            console.log(err);
        });
    };

    const calculateItemTotal = () => {
        return route.params.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    useEffect(() => {
        setTotalToPay(itemTotal + deliveryFee + charges);
    }, [charges, deliveryFee, itemTotal]);

    const selectAddress = async() => {
        await AsyncStorage.setItem('address', JSON.stringify({
            'address': 'Gangnapur, Nadia',
            coordinates: {
                longitude: 23.139938,
                latitude: 88.649606,
            },
        }));
        let adrs = await AsyncStorage.getItem('address');
        if(adrs === null) {
            Alert.alert('Warning', 'Please add an address to your account.');
            navigation.push('ManageAddress');
        } else {
            setAddress(JSON.parse(adrs).address);
            verifyOrderDetails();
        }
    };

    useEffect(()=> console.log(deliveryFee), [deliveryFee]);

    useEffect(() => {
      selectAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckout = async() => {
        setIsProcessing(true);
        axios.post('http://192.168.176.252:3000/api/user/initiatePayment', {
            items: cartItems,
            restaurantId: route.params.cartItems[0].restaurantId,
            amount: totalToPay,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await AsyncStorage.getItem('JWT')}`,
            },
        }).then(async(response) => {
            if (response.status === 200) {
                let razorpayOrderId = response.data.orderId;
                let options = {
                    key: 'rzp_test_bDPeFco4rKBEPk', // Enter the Key ID generated from the Dashboard
                    amount: (totalToPay * 100).toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    order_id: razorpayOrderId, // Order id generated from the server
                    currency: 'INR',
                    name: 'Taste Perfect', //your business name
                    description: 'Test Transaction',
                    image: 'https://via.placeholder.com/100',
                    // order_id: 'order_DslnoIgkIDL8Zt', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                    prefill: { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                        name: 'Sayan Biswas', //your customer's name
                        email: 'sayanbiswascode@gmail.com', //Provide the customer's phone number for better conversion rates
                    },
                    theme: {
                        color: '#ff0000',
                    },
                };

                await RazorpayCheckout.open(options).then(data=> {
                    // handle success
                    axios.post('http://192.168.176.252:3000/api/user/verifyAndPlaceOrder', {
                        razorpayPaymentDetails: data,
                    }).then(res => {
                        if(res.status === 200) {
                            Alert.alert('Payment Successful!');
                            navigation.popToTop();
                        }
                    }).catch(err => {
                        console.log(err);
                        Alert.alert('Payment Failed!');
                    });
                }).catch(error=> {
                    // handle failure
                    console.log(error);
                    Alert.alert(`Failure: ${error.code} | ${error.description}`);
                });
            }
        }).catch(err=> console.log(err)).finally(() => setIsProcessing(false));
    };

    return (
        <>
            <ScrollView style={styles.container}>

                <View style={styles.section}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    {/* <Text style={styles.restaurantLocation}>{restaurant.location}</Text> */}

                    {cartItems.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                            <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <TextInput
                    style={styles.instructionInput}
                    placeholder="Any instructions? We will try our best"
                    placeholderTextColor="gray"
                />

                <TouchableOpacity style={styles.couponButton}>
                    <Text style={styles.couponText}>Apply Coupon</Text>
                </TouchableOpacity>

                <View style={styles.billSection}>
                    <Text style={styles.billHeading}>Bill Details</Text>
                    <View style={styles.billRow}>
                        <Text style={styles.billText}>Item Total</Text>
                        <Text style={styles.billText}>₹{itemTotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billText}>Delivery Fee</Text>
                        <Text style={styles.billText}>₹{deliveryFee.toFixed(2)}</Text>
                    </View>
                    {/* <View style={styles.billRow}>
                        <Text style={styles.billText}>Taxes</Text>
                        {restaurant.taxes && <Text style={styles.billText}>₹{restaurant.taxes.toFixed(2)}</Text>}
                    </View> */}
                    <View style={styles.billRow}>
                        <Text style={styles.billText}>Platform Charges</Text>
                        <Text style={styles.billText}>₹{charges.toFixed(2)}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billTotalText}>To Pay</Text>
                        <Text style={styles.billTotalText}>₹{totalToPay.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.addressSection}>
                    <Icon name="home-outline" size={30} color={'red'} />
                    <View style={{ flexDirection: 'column', flexShrink: 1 }}>
                        <Text style={styles.addressText}>{address}</Text>
                        {/* <Text style={styles.address}>{delhevery.address}</Text> */}
                    </View>
                </View>

            </ScrollView>
            <View style={styles.paymentSection}>
                <Text style={styles.totalAmount}>₹{totalToPay.toFixed(2)}</Text>
                <TouchableOpacity style={styles.paymentButton} onPress={handleCheckout} disabled={isProcessing}>
                    <Text style={styles.paymentText}>MAKE PAYMENT</Text>
                </TouchableOpacity>
            </View>
            {/* <AddressSelectionModal isVisible={changeAddress} onSelectAddress={()=> {}} onClose={() => setChangeAddress(false)} /> */}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    section: {
        padding: 20,
        backgroundColor: '#fff',
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    restaurantLocation: {
        color: '#666',
        marginBottom: 20,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemName: {
        fontSize: 16,
        color: 'black',
    },
    quantity: {
        marginHorizontal: 10,
        fontSize: 16,
        color: 'black',
    },
    itemPrice: {
        fontSize: 16,
        color: 'black',
    },
    instructionInput: {
        marginHorizontal: 20,
        marginVertical: 15,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    couponButton: {
        marginHorizontal: 20,
        padding: 10,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    couponText: {
        color: 'green',
    },
    billSection: {
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    billHeading: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
        color: 'red',
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    billText: {
        fontSize: 16,
        color: 'black',
    },
    billTotalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    addressSection: {
        padding: 20,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    addressText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    address: {
        color: '#666',
    },
    changeText: {
        color: 'red',
        fontSize: 16,
    },
    paymentSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    paymentButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    paymentText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CheckoutScreen;
