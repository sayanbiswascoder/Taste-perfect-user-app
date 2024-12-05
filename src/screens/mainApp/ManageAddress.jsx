import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AddAddressModal from './AddAddress';

// Dummy data for addresses
const initialAddresses = [
    { id: '1', label: 'Home', address: '123, ABC Apartments, Karol Bagh, New Delhi' },
    { id: '2', label: 'Office', address: '45, XYZ Tower, Connaught Place, New Delhi' },
];

const ManageAddressesScreen = () => {
    const [addresses, setAddresses] = useState(initialAddresses);
    const [newAddress, setNewAddress] = useState(false);
    const [newLabel, setNewLabel] = useState('');

    // Function to add a new address
    const addAddress = () => {
        if (!newLabel || !newAddress) {
            Alert.alert('Error', 'Please enter both label and address.');
            return;
        }

        const newId = (addresses.length + 1).toString();
        setAddresses([...addresses, { id: newId, label: newLabel, address: newAddress }]);
        setNewLabel('');
        setNewAddress('');
    };

    // Function to delete an address
    const deleteAddress = (id) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => setAddresses(addresses.filter((item) => item.id !== id)),
                    style: 'destructive',
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Manage Addresses</Text>
            </View>

            {/* Address List */}
            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.addressItem}>
                        <View style={styles.addressTextContainer}>
                            <Text style={styles.addressLabel}>{item.label}</Text>
                            <Text style={styles.address}>{item.address}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteAddress(item.id)}>
                            <Icon name="trash-outline" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No addresses added yet.</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* Add New Address Section */}
            <View style={styles.addAddressContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Label (e.g., Home, Office)"
                    value={newLabel}
                    onChangeText={setNewLabel}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter address"
                    multiline
                />
                <TouchableOpacity style={styles.addButton} onPress={()=>setNewAddress(true)}>
                    <Text style={styles.addButtonText}>Add Address</Text>
                </TouchableOpacity>
            </View>
            <AddAddressModal visible={newAddress} onClose={() => setNewAddress(false)} onAddressSelect={()=> {}} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 15 },
    header: { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 15 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'red', textAlign: 'center' },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        marginVertical: 5,
    },
    addressTextContainer: { flex: 1 },
    addressLabel: { fontSize: 16, fontWeight: 'bold', color: 'black' },
    address: { fontSize: 14, color: 'gray', marginTop: 2 },
    emptyText: { textAlign: 'center', color: 'gray', marginVertical: 20 },
    addAddressContainer: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ManageAddressesScreen;
