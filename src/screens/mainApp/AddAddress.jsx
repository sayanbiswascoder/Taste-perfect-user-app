import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import WebView from 'react-native-webview';

const AddAddressModal = ({ visible, onClose, onAddressSelect }) => {
    const handleMapMessage = (event) => {
        const { data } = event.nativeEvent;
        const coordinates = JSON.parse(data); // Expecting { lat: number, lng: number }
        onAddressSelect(coordinates);
        onClose();
    };

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <style>
                html, body, #map { height: 100%; margin: 0; padding: 0; }
                #map { width: 100%; height: 100%; }
            </style>
            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        </head>
        <body>
            <div id="map"></div>
            <script>
                var map = L.map('map').setView([28.6139, 77.2090], 14); // Centered on Delhi, India

                // Add OpenStreetMap tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Add a marker on map click and send coordinates to React Native
                map.on('click', function(event) {
                    var lat = event.latlng.lat;
                    var lng = event.latlng.lng;

                    // Remove existing markers
                    if (window.marker) map.removeLayer(window.marker);

                    // Add new marker
                    window.marker = L.marker([lat, lng]).addTo(map);

                    // Send coordinates back to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({ lat: lat, lng: lng }));
                });
            </script>
        </body>
        </html>
    `;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Choose Address</Text>
                    <View style={{height: 400, width: '100%'}}>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: htmlContent }}
                            onMessage={handleMapMessage}
                            style={styles.webView}
                        />
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
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
    modalContent: {
        width: Dimensions.get('window').width * 0.9,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        overflow: 'hidden',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    webView: {
        width: '100%',
        height: 300,
    },
    closeButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 10,
        marginTop: 15,
        alignItems: 'center',
        width: '80%',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddAddressModal;
