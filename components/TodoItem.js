import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { formatDistanceToNow, isPast } from 'date-fns';

const TodoItem = ({ task, deleteTask, toggleCompleted, refreshTasks }) => {
  const navigation = useNavigation();

  // Check if the task is overdue
  const isOverdue = isPast(new Date(task.dueDate));
  const dueDate = new Date(task.dueDate);
  const timeLeft = formatDistanceToNow(dueDate, { includeSeconds: true });

  return (
    <View style={[styles.container, { borderBottomColor: task.color }]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleCompleted(task.id)}
        accessibilityLabel={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name={task.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <View style={styles.detailsBox}>
        <Text style={[styles.title, task.completed && styles.completedText]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={[styles.description, task.completed && styles.completedText]}>
            {task.description}
          </Text>
        )}
        <View style={[styles.priorityBox]}>
          <Text style={styles.priorityText}>{task.priority}</Text>
        </View>
        <Text style={[styles.dueDate, isOverdue && styles.overdue]}>
          {isOverdue ? 'Overdue' : `${timeLeft} left`}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditTask', { task, refreshTasks })}
          accessibilityLabel="Edit task"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="pencil" size={24} color="black" style={styles.editButton}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteTask(task.id)}
          accessibilityLabel="Delete task"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="delete" size={24} color="red" style={styles.deleteButton}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

TodoItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string.isRequired,
    priority: PropTypes.string,
    priorityColor: PropTypes.string.isRequired, // Add priorityColor prop
    color: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  deleteTask: PropTypes.func.isRequired,
  toggleCompleted: PropTypes.func.isRequired,
  refreshTasks: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    elevation: Platform.OS === 'android' ? 3 : 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftColor: '#ccc',
    borderRightColor: '#ccc',
    borderTopColor: '#ccc',
    borderWidth: 1,
    borderBottomWidth: 4,
  },
  checkbox: {
    marginRight: 12,
    marginTop:45,
    marginLeft:10
  },
  detailsBox: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    marginVertical: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888', // Optional: lighter color for completed tasks
  },
  priorityText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
  overdue: {
    color: 'red',
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-evenly',
    width:'30%',
    marginTop:45
  },
 
});

export default TodoItem;
