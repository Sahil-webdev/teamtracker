import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

const MasterLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleMasterLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.MASTER_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Master login successful!');
        navigation.navigate('MasterDashboard', { token: data.token, user: data.user });
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error connecting to server');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />
      
      {/* Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>👤</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Master Login</Text>
      <Text style={styles.subtitle}>Admin access only</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Master Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter master email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Master Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter master password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Master Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleMasterLogin}>
        <Text style={styles.loginButtonText}>Master Login</Text>
      </TouchableOpacity>

      {/* Back to User Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backText}>
          ← Back to User Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d2e',
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#4a2d5a',
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
    color: '#ff9500',
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
  loginButton: {
    backgroundColor: '#ff9500',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  backText: {
    textAlign: 'center',
    color: '#00d9ff',
    fontSize: 14,
  },
});

export default MasterLoginScreen;
