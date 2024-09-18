import React, { useState } from 'react';
import { View,Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  msg: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default function GetSetup() {
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter your name');
      return;
    }
    try {
      await AsyncStorage.setItem('userName', name.trim());
      navigation.navigate('TodoList', { refresh: true }); // Pass a refresh flag
    } catch (error) {
      console.error('Failed to save user name:', error);
      Alert.alert('Error', 'Failed to save user name');
    }
  };

  return (
    <View style={styles.container}>
        <Image source={require('./../assets/icon.png')} style={{ width: 100, height: 100 }} />
        <Text style={styles.msg}>Welcome Todo App!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
