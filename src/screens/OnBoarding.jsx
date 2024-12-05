import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
    { id: '1', title: 'Fast Delivery', description: 'We deliver your order as quickly and efficiently as possible' },
    { id: '2', title: 'Get your order', description: 'Receive the order at your door-step' },
    { id: '3', title: 'Bon appetite!', description: 'Enjoy tasty and hot food; we strve to be better for you.' },
];

const OnboardingScreen = ({ navigation }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const flatListRef = useRef(null);

    const handleScroll = (event) => {
        const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentPage(pageIndex);
    };

    const renderSlide = ({ item }) => (
        <View style={styles.slide}>
            <View style={styles.imageContainer}>
                {/* Replace with your image source */}
                <Image
                    source={require('../assets/pizza-delivery.png')} // Update the image path
                    style={styles.image}
                />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>
                    {item.description}
                </Text>
            </View>


        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
            />

            {
                currentPage === 2 && <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('LoginSignup')}>
                    <Text style={{ color: '#f75454', fontSize: 18 }}>Lets Start</Text>
                </TouchableOpacity>
            }

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentPage === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('LoginSignup')}>
                <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f75454',
        justifyContent: 'center'
    },
    slide: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    imageContainer: {
        width: '80%',
        height: 'auto',
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        width: '100%',  // Adjust dimensions based on your image size
        height: 500,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 16,
        color: '#dc9aa2',
        textAlign: 'center',
        marginTop: 10,
    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    startButton: {
        alignSelf: 'center',
        borderRadius: 100,
        backgroundColor: '#fff',
        color: '#f75454',
        padding: 10,
        paddingHorizontal: 30,
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 5,
    },
    activeDot: {
        width: 50, // Larger width for active indicator
        backgroundColor: '#fff', // White color for active dot
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
    },
    skipText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default OnboardingScreen;
