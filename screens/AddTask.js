import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function AddTask({ route, navigation }) {
  const { refreshTasks } = route.params || {};

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState('low');
  const [category, setCategory] = useState('personal');
  const [categoryColor, setCategoryColor] = useState('#0000FF'); // Default color

  const priorities = [
    { label: 'Very Low', value: 'very low' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Very High', value: 'very high' },
  ];

  const categories = [
    { label: 'Personal', value: 'personal', color: '#0000FF' }, // Blue
    { label: 'Work', value: 'work', color: '#008000' }, // Green
    { label: 'Household', value: 'household', color: '#FFFF00' }, // Yellow
    { label: 'Health', value: 'health', color: '#FF0000' }, // Red
    { label: 'Finance', value: 'finance', color: '#800080' }, // Purple
    { label: 'Social', value: 'social', color: '#FFA500' }, // Orange
    { label: 'Learning/Development', value: 'learning', color: '#008080' }, // Teal
    { label: 'Travel', value: 'travel', color: '#00FFFF' }, // Aqua
    { label: 'Projects', value: 'projects', color: '#8B4513' }, // Brown
  ];

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate: dueDate.toISOString(),
      priority,
      category,
      color: categoryColor, // Save the selected category color
    };

    await saveTask(newTask);
    if (refreshTasks) {
      refreshTasks();
    }
    navigation.goBack();
  };

  const saveTask = async (task) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      tasks.push(task);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save task:', error);
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find(cat => cat.value === value);
    setCategory(value);
    setCategoryColor(selectedCategory ? selectedCategory.color : '#0000FF');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title:</Text>
      <TextInput
        style={styles.textInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.textInput, styles.descriptionInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        multiline
      />

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
      <Icon name="calendar" size={30} color="#fff" />
        <Text style={styles.dateButtonText}>Due Date: {dueDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Priority:</Text>
        <RNPickerSelect
          placeholder={{ label: 'Select Priority', value: null }}
          items={priorities}
          onValueChange={setPriority}
          value={priority}
          style={pickerStyles}
          useNativeAndroidPickerStyle={false}
          Icon={() => <MaterialCommunityIcons name="chevron-down" size={20} color="gray" />}
        />
      </View>

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Category:</Text>
        <RNPickerSelect
          placeholder={{ label: 'Select Category', value: null }}
          items={categories}
          onValueChange={handleCategoryChange}
          value={category}
          style={pickerStyles}
          useNativeAndroidPickerStyle={false}
          Icon={() => <MaterialCommunityIcons name="chevron-down" size={20} color="gray" />}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownContainer: {
    marginTop: 20,
  },
  addButton: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
