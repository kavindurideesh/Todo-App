// StackNavigator.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoList from '../components/TodoList';
import AddTask from '../screens/AddTask';
import SearchTask from '../screens/SearchTask';
import Calendar from '../screens/Calendar';
import EditTask from '../screens/EditTask';
import GetSetup from '../screens/GetSetup'; // Import GetSetup screen

const Stack = createStackNavigator();

export default function StackNavigator() {
  const [initialRoute, setInitialRoute] = useState('TodoList');

  useEffect(() => {
    const checkUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) {
          setInitialRoute('TodoList');
        } else {
          setInitialRoute('GetSetup');
        }
      } catch (error) {
        console.error('Failed to check user name:', error);
        setInitialRoute('GetSetup'); // Fallback to setup screen in case of error
      }
    };

    checkUserName();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="TodoList" component={TodoList} options={{ title: 'Todo List' }} />
        <Stack.Screen name="AddTask" component={AddTask} options={{ title: 'Add Task' }} />
        <Stack.Screen name="SearchTask" component={SearchTask} options={{ title: 'Search Tasks' }} />
        <Stack.Screen name="Calendar" component={Calendar} options={{ title: 'Calendar' }} />
        <Stack.Screen name="EditTask" component={EditTask} options={{ title: 'Edit Task' }} />
        <Stack.Screen name="GetSetup" component={GetSetup} options={{ title: 'Setup' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
