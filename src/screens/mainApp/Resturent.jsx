import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Dummy Data
const dummyData = [
    {
        id: '1',
        category: 'DIET MEAL',
        items: [
            { id: '1-1', name: 'Idli', description: 'A south Indian dish', price: 120, image: 'https://via.placeholder.com/100', veg: false },
            { id: '1-2', name: 'Mix Salad', description: 'Salad with added Mayonese', price: 50, image: 'https://via.placeholder.com/100', veg: false },
        ],
    },
    {
        id: '2',
        category: 'BIRYANI',
        items: [
            { id: '2-1', name: 'Chicken Biryani', description: 'Delicious and spicy', price: 180, image: 'https://via.placeholder.com/100', veg: false },
            { id: '2-2', name: 'Veg Biryani', description: 'Made with fresh vegetables', price: 150, image: 'https://via.placeholder.com/100', veg: false },
        ],
    },
    {
        id: '3',
        category: 'CHINESE',
        items: [
            { id: '3-1', name: 'Chicken Chowmein', description: 'Available in good quantity', price: 70, image: 'https://via.placeholder.com/100', veg: false },
        ],
    },
];

const RestaurantScreen = ({ navigation, route }) => {
    const [cart, setCart] = useState({});
    const [veg, setVeg] = useState(false);
    const [nonVeg, setNonVeg] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [dishes, setDishes] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const addToCart = async (item) => {
        const newCart = { ...cart };
        newCart[item._id] = (newCart[item._id] || 0) + 1;
        setCart(newCart);
        await updateCartSummary(newCart);
    };

    const removeFromCart = async (item) => {
        const newCart = { ...cart };
        if (newCart[item._id] > 1) {
            newCart[item._id] -= 1;
        } else {
            delete newCart[item._id];
        }
        setCart(newCart);
        await updateCartSummary(newCart);
    };

    const updateCartSummary = async (newCart) => {
        let items = 0;
        let price = 0;
        for (const _id in newCart) {
            const item = await findItemById(_id);
            items += newCart[_id];
            price += item.price * newCart[_id];
        }
        setTotalItems(items);
        setTotalPrice(price);
    };

    const findItemById = async (id) => {
        for (const category of filteredData) {
            for (const item of category.items) {
                if (item._id === id) {return item;}
            }
        }
    };

    useEffect(() => {
        const filterData = dishes.map(category => ({
            ...category,
            items: category.items.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesVegFilter = (veg && item.veg) || (nonVeg && !item.veg) || (!veg && !nonVeg);
                return matchesSearch && matchesVegFilter;
            }),
        })).filter(category => category.items.length > 0);
        setFilteredData(filterData);
    }, [dishes, nonVeg, searchQuery, veg]);

    useEffect(() => {
        axios.post('http://192.168.176.252:3000/api/user/getRestaurantDishs', {
            id: route.params.restaurant._id,
        }).then((response) => {
            if (response.status === 200) {
                setDishes(response.data.data);
            }
        }).catch(err => {
            console.log(err);
        });
    }, [route.params.restaurant._id, searchQuery]);

    const renderItem = ({ item }) => {
        const quantity = cart[item._id] || 0;

        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                    <View style={{
                        borderRadius: 5, borderWidth: 1, borderColor: item.veg ? 'green' : 'red',
                        height: 20, width: 20, alignItems: 'center', justifyContent: 'center',
                    }}>
                        <View style={{ borderRadius: 100, backgroundColor: item.veg ? 'green' : 'red', height: 12, width: 12 }} />
                    </View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
                <View style={styles.imageQuantityContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.buttonContainer}>
                        {quantity > 0 ? (
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={() => removeFromCart(item)}>
                                    <Text style={styles.quantityButton}>-</Text>
                                </TouchableOpacity>
                                <Text style={{ color: 'black' }}>{quantity}</Text>
                                <TouchableOpacity onPress={() => addToCart(item)}>
                                    <Text style={styles.quantityButton}>+</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                                <Text style={{ color: '#4CAF50' }}>Add</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.restaurantContainer}>
                <Text style={styles.restaurantTitle}>{route.params.restaurant.name}</Text>
                <Text style={styles.restaurantCuisine}>{route.params.restaurant.cuisine}</Text>
                <Text style={styles.restaurantLocation}>{route.params.restaurant.address}</Text>
                <View style={styles.restaurantDetailsContainer}>
                    <View style={styles.restaurantDetails}>
                        <Text style={styles.restaurantDetailItem}>⭐ {route.params.restaurant.rating}</Text>
                        <Text style={styles.restaurantDetailItem}>Rating</Text>
                    </View>
                    <View style={styles.restaurantDetails}>
                        <Text style={styles.restaurantDetailItem}>{((route.params.restaurant.distance * 1.3) / 1000).toFixed(1)}</Text>
                        <Text style={styles.restaurantDetailItem}>KM</Text>
                    </View>
                    {/* <View style={styles.restaurantDetails}>
                        <Text style={styles.restaurantDetailItem}>Rs. 250</Text>
                        <Text style={styles.restaurantDetailItem}>Average Cost</Text>
                    </View> */}
                </View>
            </View>

            <View style={styles.searchFilterContainer}>
                <View style={styles.searchBarContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for items..."
                        placeholderTextColor="gray"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Icon name="search" size={24} color="red" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={[styles.filterButton, { borderColor: 'green' }]} onPress={() => setVeg(!veg)}>
                        {veg && <View style={{ backgroundColor: 'green', width: 12, height: 12, borderRadius: 100 }} />}
                    </TouchableOpacity>
                    <Text style={styles.filterText}>Veg</Text>
                    <TouchableOpacity style={[styles.filterButton, { borderColor: 'red' }]} onPress={() => setNonVeg(!nonVeg)}>
                        {nonVeg && <View style={{ backgroundColor: 'red', width: 12, height: 12, borderRadius: 100 }} />}
                    </TouchableOpacity>
                    <Text style={styles.filterText}>Non-Veg</Text>
                </View>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.categoryTitle}>{item.category}</Text>
                        <FlatList
                            data={item.items}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                        />
                    </View>
                )}
            />
            {totalItems > 0 && (
                <View style={styles.cartSummary}>
                    <Text style={styles.cartText}>
                        {totalItems} Items | ₹{totalPrice}.00
                    </Text>
                    <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart', { cart: cart })}>
                        <Text style={styles.cartText}>VIEW CART</Text>
                        <Icon name="cart" size={20} color={'white'} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    restaurantContainer: {
        padding: 16,
        paddingBottom: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        marginBottom: 16,
    },
    restaurantTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: 'black',
    },
    restaurantCuisine: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    restaurantLocation: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    restaurantDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderStyle: 'dashed',
        padding: 5,
    },
    restaurantDetails: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 8,
        alignItems: 'center',
    },
    restaurantDetailItem: {
        fontSize: 14,
        color: '#888',
    },
    searchFilterContainer: {
        padding: 16,
        backgroundColor: '#fff',
    },
    searchBarContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: 'black',
    },
    filterButton: {
        width: 20,
        height: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginRight: 10,
    },
    filterText: {
        fontSize: 16,
        color: 'black',
        marginRight: 15,
    },
    categoryTitle: { fontSize: 18, fontWeight: 'bold', padding: 10, color: 'black', backgroundColor: 'white' },
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
    },
    image: { width: 100, height: 80, borderRadius: 10 },
    itemDetails: { flex: 1, marginLeft: 10 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: 'black' },
    itemDescription: { color: 'black' },
    itemPrice: { fontSize: 16, fontWeight: 'bold', marginVertical: 5, color: 'black' },
    imageQuantityContainer: {
        flex: 1,
        width: 80,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        top: -10,
    },
    addButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.8,
        borderColor: 'gray',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 50,
        borderWidth: 0.8,
        borderColor: 'gray',
    },
    quantityButton: { fontSize: 20, paddingHorizontal: 10, color: 'black' },
    cartSummary: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#4CAF50',
        margin: 15,
        marginTop: 0,
        borderRadius: 20,
    },
    cartButton: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    cartText: { color: '#fff', fontWeight: 'bold' },
});

export default RestaurantScreen;
