import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

const SignUpScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    // Handle sign up logic here
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please enter name, email and password');
      return;
    }
    
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error connecting to server');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />
      
      {/* Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>📍</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d2e',
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#2d4a5a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2d3548',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#fff',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  signUpButton: {
    backgroundColor: '#00d9ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  signInText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  signInLink: {
    color: '#00d9ff',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
