import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';

// Dummy data for addresses
const addresses = [
    { id: '1', label: 'Home', address: '123, ABC Apartments, Karol Bagh, New Delhi' },
    { id: '2', label: 'Office', address: '45, XYZ Tower, Connaught Place, New Delhi' },
    { id: '3', label: 'Friend\'s Place', address: '78, DEF Residency, South Delhi' },
];

const AddressSelectionModal = ({ isVisible, onClose, onSelectAddress }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Choose Delivery Address</Text>

                    <FlatList
                        data={addresses}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.addressItem}
                                onPress={() => {
                                    onSelectAddress(item);
                                    onClose();
                                }}
                            >
                                <Text style={styles.addressLabel}>{item.label}</Text>
                                <Text style={styles.address}>{item.address}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
    addressItem: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        marginVertical: 5,
    },
    addressLabel: { fontSize: 16, fontWeight: 'bold', color: 'black' },
    address: { fontSize: 14, color: 'gray', marginTop: 2 },
    closeButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddressSelectionModal;
