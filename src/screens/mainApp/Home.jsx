/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dummy data for banners and restaurants
// const bannerData = [
//   { id: '1', title: 'Buy 1, Get 1 Free', url: 'https://via.placeholder.com/300x150', description: 'Order 2 items & pay for 1' },
//   { id: '2', title: 'Fast Delivery', url: 'https://via.placeholder.com/300x150', description: 'We deliver fast!' },
// ];

// const restaurantData = [
//   {
//     id: '1',
//     name: 'Stayfit Restaurant',
//     cuisine: 'Indian, Chinese',
//     rating: '4.0',
//     time: '30 mins',
//     price: '₹250 for two',
//     distance: '0.99 kms away',
//     image: 'https://via.placeholder.com/100',
//   },
//   {
//     id: '2',
//     name: 'Healthy Bites',
//     cuisine: 'American, Continental',
//     rating: '4.5',
//     time: '25 mins',
//     price: '₹300 for two',
//     distance: '1.2 kms away',
//     image: 'https://via.placeholder.com/100',
//   },
//   {
//     id: '3',
//     name: 'Healthy Bites',
//     cuisine: 'American, Continental',
//     rating: '4.5',
//     time: '25 mins',
//     price: '₹300 for two',
//     distance: '1.2 kms away',
//     image: 'https://via.placeholder.com/100',
//   },
// ];

const HomeScreen = ({ navigation }) => {
  const [bannerData, setBannerData] = useState([]);
  const [favoritesRestaurant, setFavoritesRestaurant] = useState(undefined);
  const [restaurantData, setRestaurantData] = useState(undefined);

  const fetchData = async () => {
    axios.get('http://192.168.166.252:3000/api/admin/banner').then(({ data }) => {
      setBannerData(data.banners);
    }).catch((error) => {
      console.log(error);
    });

    // Fetch favorite restaurants from the server
    axios.get('http://192.168.166.252:3000/api/user/getFavRestaurant', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('JWT')}`,
      },
    }).then(({ data }) => {
      setFavoritesRestaurant(data.favorite);
    }).catch((error) => {
      console.log(error);
    });

    // Fetch nearby restaurants from the server
    axios.post('http://192.168.166.252:3000/api/user/getNearbyRestaurants', {
      latitude: 88.649581,
      longitude: 23.139974,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('JWT')}`,
      },
    }).then(res => {
      if(res.status === 200){
        console.log(res.data);
        setRestaurantData(res.data);
      }
    }).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  // Render each restaurant item
  const RenderRestaurant = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Restaurant')} style={styles.restaurantItem}>
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
        <Text style={styles.restaurantInfo}>
          <Icon name="star" size={15} color={'red'} />
          {item.rating}  {item.time}  {item.distance}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return <>
    {/* <SafeAreaView> */}
    {/* Location and Search Bar */}
    <View style={styles.locationContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="location-sharp" size={30} color={'red'} />
        <View>
          <Text style={styles.locationText}>Sarai Restaurant</Text>
          <Text style={styles.locationSubText}>167 45 Street 16/14, WEA, Karol Bagh, New Delhi</Text>
        </View>
      </View>
    </View>
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput placeholder="Search for restaurants, dishes..." placeholderTextColor={'gray'} style={styles.searchInput} onFocus={() => navigation.navigate('Search', { search: true })} />
        <TouchableOpacity>
          <Text style={styles.searchIcon}>
            <Icon name="search" size={30} color={'red'} />
          </Text>
        </TouchableOpacity>
      </View>
      {/* Banner Carousel */}
      <Carousel
        data={bannerData}
        renderItem={({ item }) => <Image style={styles.banner} source={{ uri: `http://192.168.166.252:3000${item}` }} />}
        width={400}
        height={210}
        loop
      />
      <View style={{ paddingHorizontal: 15 }}>
        {
          favoritesRestaurant && <><Text style={styles.sectionTitle}>Your Favorites</Text>
            <RenderRestaurant item={restaurantData[0]} /></>
        }

        <Text style={styles.sectionTitle}>Restaurants Nearby</Text>
        {
          !restaurantData && <Text style={{ marginTop: 10, color: 'gray', textAlign: 'center' }}>No nearby restaurants found.</Text>
        }
        {restaurantData && restaurantData.length > 0 && <FlatList
          data={restaurantData}
          renderItem={RenderRestaurant}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
        }
      </View>
    </ScrollView>
  </>;
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 15,
  },
  locationContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  locationSubText: {
    color: 'gray',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 5,
    margin: 10,
    marginTop: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: 'black',
  },
  searchIcon: {
    fontSize: 18,
  },
  banner: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    width: 'auto',
    height: 200,
    elevation: 5,
    marginHorizontal: 15,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  bannerTextContainer: {
    position: 'absolute',
    top: 20,
    left: 15,
  },
  bannerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bannerDescription: {
    color: '#fff',
    fontSize: 14,
  },
  orderButton: {
    backgroundColor: '#ff4040',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  orderButtonText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: 'black',
  },
  restaurantItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  restaurantDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  restaurantCuisine: {
    color: 'gray',
  },
  restaurantInfo: {
    color: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
