import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchTask({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          const allTasks = JSON.parse(storedTasks);
          setTasks(allTasks);
          setFilteredTasks(allTasks);
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    const results = tasks.filter(task =>
      task.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredTasks(results);
  }, [searchText, tasks]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search Tasks"
        placeholderTextColor="#999"
      />
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity style={styles.clearButton} onPress={() => setSearchText('')}>
        <Text style={styles.clearButtonText}>Clear Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  taskItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  clearButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
