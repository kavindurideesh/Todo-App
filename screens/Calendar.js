import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          const tasks = JSON.parse(storedTasks);

          const newMarkedDates = tasks.reduce((acc, task) => {
            const date = task.dueDate.split('T')[0]; // Get date part only (yyyy-mm-dd)
            acc[date] = {
              marked: true,
              dotColor: task.color || '#000000', // Default to black if no color is provided
            };
            return acc;
          }, {});

          setMarkedDates(newMarkedDates);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        Alert.alert('Error', 'Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, []);

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    setSelectedDate(selectedDate);

    const fetchTasksForDate = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          const tasks = JSON.parse(storedTasks);
          const tasksForDate = tasks.filter(task => task.dueDate.split('T')[0] === selectedDate);
          setTasksForSelectedDate(tasksForDate);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        Alert.alert('Error', 'Failed to fetch tasks');
      }
    };

    fetchTasksForDate();
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={[styles.taskcategory, { color: item.color } ]}>{item.category}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        current={new Date().toISOString().split('T')[0]} // Set the calendar to the current date
        minDate={'2020-01-01'}
        maxDate={'2030-12-31'}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        monthFormat={'yyyy MM'}
        hideArrows={false}
        renderArrow={(direction) => <Text>{direction === 'left' ? '<' : '>'}</Text>}
      />
      {selectedDate && (
        <View style={styles.taskListContainer}>
          <Text style={styles.selectedDate}>Tasks for {selectedDate}:</Text>
          <FlatList
            data={tasksForSelectedDate}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTaskItem}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  taskListContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  taskcategory: {
    fontSize: 16,
  },
});
