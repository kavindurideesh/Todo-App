import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoItem from './TodoItem';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  filterButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  filterButtonUnselected: {
    backgroundColor: '#2196F3',
  },
  taskList: {
    flex: 1,
  },
  searchButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    backgroundColor: '#FFC107',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    color:'#fff',
  },
  icon: {
    color: '#fff',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  calendarButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#FFC107',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  calendarButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  greeting: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    marginTop:5,
  },
});

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('todo');
  const [userName, setUserName] = useState(null);
  const navigation = useNavigation();
  const route = useRoute(); // Get route params

  const fetchUserName = useCallback(async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      } else {
        navigation.navigate('GetSetup');
      }
    } catch (error) {
      console.error('Failed to load user name:', error);
    }
  }, [navigation]);

  useEffect(() => {
    fetchUserName();
  }, [fetchUserName]);

  const refreshTasks = useCallback(async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const allTasks = JSON.parse(storedTasks);
        setTasks(sortTasksByPriority(allTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshTasks();
      if (route.params?.refresh) { // Check if refresh is needed
        fetchUserName();
      }
    }, [fetchUserName, refreshTasks, route.params?.refresh])
  );

  async function deleteTask(id) {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(sortTasksByPriority(updatedTasks));
    await saveTasks(updatedTasks);
  }

  async function toggleCompleted(id) {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(sortTasksByPriority(updatedTasks));
    await saveTasks(updatedTasks);
  }

  async function saveTasks(updatedTasks) {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
      Alert.alert('Error', 'Failed to save tasks');
    }
  }

  function sortTasksByPriority(tasks) {
    const priorityOrder = {
      'very low': 1,
      'low': 2,
      'medium': 3,
      'high': 4,
      'very high': 5
    };
    return tasks.slice().sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }

  const filteredTasks = sortTasksByPriority(tasks.filter(task => {
    if (filter === 'todo') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // for 'all'
  }));

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {userName && (
        <Text style={styles.greeting}>{`${getGreeting()}, ${userName}!`}</Text>
      )}
      <View style={styles.filterContainer}>
      
        <TouchableOpacity
          style={[styles.filterButton, filter === 'todo' ? styles.filterButtonSelected : styles.filterButtonUnselected]}
          onPress={() => setFilter('todo')}
        >
          <Text style={styles.filterButtonText}>To Do</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' ? styles.filterButtonSelected : styles.filterButtonUnselected]}
          onPress={() => setFilter('completed')}
        >
          <Text style={styles.filterButtonText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' ? styles.filterButtonSelected : styles.filterButtonUnselected]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        style={styles.taskList}
        data={filteredTasks}
        renderItem={({ item }) => (
          <TodoItem
            task={item}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('SearchTask')}
      >
        <Icon name="search" size={20} color="#000" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask', { refreshTasks })}
      >
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Icon name="calendar" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
