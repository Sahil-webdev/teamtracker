import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSignIn = async () => {
    if (!email || !otp) {
      Alert.alert('Error', 'Please enter email and OTP');
      return;
    }
    
    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }
    
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token (you can use AsyncStorage for persistent storage)
        Alert.alert('Success', 'Login successful!');
        navigation.navigate('LocationTracking', { token: data.token, user: data.user });
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
          <Text style={styles.iconText}>📍</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Location Tracker</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

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

      {/* OTP Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>OTP (6-digit code from Master)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit OTP"
          placeholderTextColor="#666"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>
          Don't have an account?{' '}
          <Text style={styles.signUpLink}>Sign up</Text>
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
  signInButton: {
    backgroundColor: '#00d9ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  signUpText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  signUpLink: {
    color: '#00d9ff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
