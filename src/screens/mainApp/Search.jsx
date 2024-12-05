import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const SearchPage = ({navigation, route}) => {
  // Dummy data for the list
  const data = [
    { id: '1', name: 'Pizza' },
    { id: '2', name: 'Burger' },
    { id: '3', name: 'Sushi' },
    { id: '4', name: 'Pasta' },
    { id: '5', name: 'Salad' },
    { id: '6', name: 'Tacos' },
    { id: '7', name: 'Steak' },
    { id: '8', name: 'Ramen' },
    { id: '9', name: 'Sandwich' },
    { id: '10', name: 'Fries' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Function to filter data based on search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const newData = data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };

  // Render function for each item in the list
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for restaurants, dishes..."
        value={searchQuery}
        onChangeText={(text) => handleSearch(text)}
        placeholderTextColor={'gray'}
        autoFocus={true}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noResults}>No results found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default SearchPage;
