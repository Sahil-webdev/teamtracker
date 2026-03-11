import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

const LocationTrackingScreen = ({ route, navigation }: any) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const { token, user } = route.params;

  const startTracking = async () => {
    try {
      // Request location permission first
      // For now, using dummy location - will add real location permission later
      const dummyLocation = {
        latitude: 28.6139,
        longitude: 77.2090,
      };

      const response = await fetch(API_ENDPOINTS.LOCATION_START, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dummyLocation),
      });

      const data = await response.json();

      if (response.ok) {
        setIsTracking(true);
        setCurrentLocation(dummyLocation);
        Alert.alert('Success', 'Location tracking started!');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start tracking');
      console.error(error);
    }
  };

  const stopTracking = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.LOCATION_STOP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsTracking(false);
        Alert.alert('Success', 'Location tracking stopped!');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to stop tracking');
      console.error(error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.navigate('Login') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.headerTitle}>{user.name || user.email}</Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusIconContainer}>
          <Text style={styles.statusIcon}>
            {isTracking ? '🟢' : '🔴'}
          </Text>
        </View>
        <Text style={styles.statusTitle}>
          {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {isTracking 
            ? 'Your location is being tracked' 
            : 'Press Start to begin tracking'}
        </Text>
      </View>

      {/* Location Info */}
      {currentLocation && isTracking && (
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>Current Location</Text>
          <Text style={styles.locationText}>
            📍 Latitude: {currentLocation.latitude}
          </Text>
          <Text style={styles.locationText}>
            📍 Longitude: {currentLocation.longitude}
          </Text>
        </View>
      )}

      {/* Main Action Button */}
      <View style={styles.actionContainer}>
        {!isTracking ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={startTracking}
          >
            <Text style={styles.actionButtonText}>▶ Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.stopButton]}
            onPress={stopTracking}
          >
            <Text style={styles.actionButtonText}>⏹ Stop Tracking</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d2e',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusCard: {
    backgroundColor: '#2d3548',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconContainer: {
    marginBottom: 15,
  },
  statusIcon: {
    fontSize: 60,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  locationCard: {
    backgroundColor: '#2d3548',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d9ff',
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  actionButton: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButton: {
    backgroundColor: '#00d9ff',
  },
  stopButton: {
    backgroundColor: '#ff4757',
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#999',
  },
});

export default LocationTrackingScreen;
