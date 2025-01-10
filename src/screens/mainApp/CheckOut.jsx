import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import Icon from 'react-native-vector-icons/Ionicons';
import AddressSelectionModal from './ChooseAddress';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CheckoutScreen = ({ navigation, route }) => {
    const [restaurant,, setRestaurant,] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [itemTotal, setItemTotal] = useState(0);
    const [totalToPay, setTotalToPay] = useState(0);
    const [address, setAddress] = useState(false)

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
        axios.post('https://192.168.231.252:8080/api/user/chargesRestaurantsDetails',{
            dishes: route.params.cartItems,
            restaurantId: route.params.cartItems[0].restaurantId,
            address: await AsyncStorage.getItem('address'),
        });
    };

    const selectAddress = async() => {
        if(await AsyncStorage.getItem('address') === null) {
            Alert.alert('Warning', 'Please add an address to your account.');
            navigation.push('ManageAddress');
        } else {
            setAddress(await AsyncStorage.getItem('address'));
            verifyOrderDetails();
        }
    };

    useEffect(() => {
      selectAddress();
    }, []);

    const handleCheckout = async() => {
        let options = {
            key: 'rzp_test_205kX9WiHKQoOu', // Enter the Key ID generated from the Dashboard
            amount: (100 * 100).toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: 'INR',
            name: 'Taste Perfect', //your business name
            description: 'Test Transaction',
            image: 'https://via.placeholder.com/100',
            // order_id: 'order_DslnoIgkIDL8Zt', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            prefill: { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                name: 'Sayan Biswas', //your customer's name
                email: 'sayanbiswascode@gmail.com', //Provide the customer's phone number for better conversion rates
                contact: '9101085890',
            },
            theme: {
                color: '#ff0000',
            },
        };
        await RazorpayCheckout.open(options, (data)=> {
            console.log(data);
            Alert.alert(`Success: ${data.razorpay_payment_id}`);
        }, (error)=> {
            // handle failure
            console.log(error);
            Alert.alert(`Failure: ${error.code} | ${error.description}`);
        });
        // .then((data) => {
        //     // handle success
        //     Alert.alert(`Success: ${data.razorpay_payment_id}`);
        // }).catch((error) => {
        //     // handle failure
        //     console.log(`Error: ${error.code} | ${error.description}`);
        // });
    };

    const delhevery = {
        address: '16/14, WEA, Karol Bagh, New Delhi, Delhi 110005, India',
    }

    // const itemTotal = route.params.cartItems.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // const totalToPay = itemTotal + restaurant.deliveryFee + restaurant.taxes;

    return (
        <>
            <ScrollView style={styles.container}>

                <View style={styles.section}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantLocation}>{restaurant.location}</Text>

                    {cartItems.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <View style={styles.quantityControl}>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                            </View>
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
                        {restaurant.deliveryFee && <Text style={styles.billText}>₹{restaurant.deliveryFee.toFixed(2)}</Text>}
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billText}>Taxes</Text>
                        {restaurant.taxes && <Text style={styles.billText}>₹{restaurant.taxes.toFixed(2)}</Text>}
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
                <TouchableOpacity style={styles.paymentButton} onPress={handleCheckout}>
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
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    quantityButton: {
        fontSize: 20,
        padding: 5,
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
