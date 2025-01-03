/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { StatusBar } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './Home';
import AccountScreen from './Account';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchPage from './Search';
import CartScreen from './Cart';
import RestaurantScreen from './Resturent';
import CheckoutScreen from './CheckOut';
import DeliveryTrackingScreen from './TrackOrder';
import ManageAddressesScreen from './ManageAddress';
import ForgetPasswordScreen from '../auth/ForgetPassword';
import OrdersScreen from './Orders';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarLabelStyle: { color: 'red' },
            }}
            tabBarHideOnKeyboard={true}
        >
            <Tab.Screen name="Home" options={{ title: 'Home', tabBarIcon: ({ focused, size }) => <Icon name={focused ? 'pizza' : 'pizza-outline'} size={size} color="red" /> }} component={HomeScreen} />
            <Tab.Screen name="Search" options={{ title: 'Search', tabBarIcon: ({ focused, size }) => <Icon name={focused ? 'search' : 'search-outline'} size={size} color="red" /> }} component={SearchPage} />
            <Tab.Screen name="Orders" options={{ title: 'Orders', tabBarIcon: ({ focused, size }) => <Icon name={focused ? 'receipt' : 'receipt-outline'} size={size} color="red" /> }} component={OrdersScreen} />
            <Tab.Screen name="Account" options={{ title: 'Account', tabBarIcon: ({ focused, size }) => <Icon name={focused ? 'person' : 'person-outline'} size={size} color="red" /> }} component={AccountScreen} />
        </Tab.Navigator>
    );
};

const MainApp = () => {

    return (
        <>
            <SafeAreaView style={{ height: '100%' }}>
                <StatusBar backgroundColor="red" />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainAppStack" component={TabNavigator} />
                    <Stack.Screen name="Restaurant" component={RestaurantScreen} />
                    <Stack.Screen name="Cart" component={CartScreen} />
                    <Stack.Screen name="Checkout" component={CheckoutScreen} />
                    <Stack.Screen name="TrackOrder" component={DeliveryTrackingScreen} />
                    <Stack.Screen name="ManageAddress" component={ManageAddressesScreen} />
                </Stack.Navigator>
            </SafeAreaView >
        </>
    );
};

export default MainApp;
