import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

const MasterMapScreen = ({ route, navigation }: any) => {
  const { token, user } = route.params;
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsersWithLocations = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MASTER_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const trackingUsers = data.users.filter((u: any) => 
          u.approved && u.last_location && u.is_tracking
        );
        setUsers(trackingUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithLocations();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchUsersWithLocations, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in meters
  };

  const renderUserLocation = (userItem: any) => {
    const location = userItem.last_location;
    const timeSince = Date.now() - new Date(location.timestamp).getTime();
    const minutesAgo = Math.floor(timeSince / 60000);
    
    return (
      <TouchableOpacity
        key={userItem.id}
        style={styles.userCard}
        onPress={() => setSelectedUser(userItem)}
      >
        <View style={styles.userCardHeader}>
          <Text style={styles.userCardName}>{userItem.email}</Text>
          <Text style={styles.userCardStatus}>🟢 Live</Text>
        </View>
        <View style={styles.locationDetails}>
          <Text style={styles.coordText}>
            📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
          <Text style={styles.timeText}>
            Updated: {minutesAgo < 1 ? 'Just now' : `${minutesAgo}m ago`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Map</Text>
        <TouchableOpacity onPress={fetchUsersWithLocations}>
          <Text style={styles.refreshText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Map Placeholder - akan diisi dengan real map */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>🗺️</Text>
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapSubtext}>
          {users.length} user{users.length !== 1 ? 's' : ''} tracking
        </Text>
        <Text style={styles.mapNote}>
          (Accurate to 100-500 meters)
        </Text>
      </View>

      {/* Users List */}
      <View style={styles.usersSection}>
        <Text style={styles.sectionTitle}>Active Users</Text>
        <ScrollView style={styles.usersList}>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : users.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No users are tracking</Text>
            </View>
          ) : (
            users.map(renderUserLocation)
          )}
        </ScrollView>
      </View>

      {/* Selected User Detail Modal */}
      {selectedUser && (
        <View style={styles.detailModal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedUser.email}</Text>
              <TouchableOpacity onPress={() => setSelectedUser(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.detailLabel}>Current Location:</Text>
              <Text style={styles.detailValue}>
                Lat: {selectedUser.last_location.latitude.toFixed(7)}°
              </Text>
              <Text style={styles.detailValue}>
                Lng: {selectedUser.last_location.longitude.toFixed(7)}°
              </Text>
              <Text style={styles.detailLabel}>Last Updated:</Text>
              <Text style={styles.detailValue}>
                {new Date(selectedUser.last_location.timestamp).toLocaleString()}
              </Text>
              <Text style={styles.detailLabel}>Accuracy:</Text>
              <Text style={styles.detailValue}>Within 100-500 meters</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 5,
  },
  backText: {
    color: '#00d9ff',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  refreshText: {
    fontSize: 24,
  },
  mapPlaceholder: {
    height: 250,
    margin: 20,
    backgroundColor: '#2d3548',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 64,
    marginBottom: 10,
  },
  mapText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  mapNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  usersSection: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  usersList: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#2d3548',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userCardStatus: {
    fontSize: 12,
    color: '#4ecdc4',
    fontWeight: 'bold',
  },
  locationDetails: {
    borderTopWidth: 1,
    borderTopColor: '#404654',
    paddingTop: 10,
  },
  coordText: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  detailModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d3548',
    borderRadius: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404654',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  modalBody: {
    padding: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 15,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default MasterMapScreen;
