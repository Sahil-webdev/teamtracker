import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

const MasterUsersScreen = ({ route, navigation }: any) => {
  const { token, user } = route.params;
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MASTER_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Only show approved users
        const approvedUsers = data.users.filter((u: any) => u.approved);
        setUsers(approvedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Auto-refresh every 10 seconds for live location updates
    const interval = setInterval(() => {
      fetchUsers();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const renderUser = ({ item }: any) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => navigation.navigate('MasterUserDetail', { token, user, userId: item.id })}
    >
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={[
          styles.statusIndicator,
          item.is_tracking && styles.activeIndicator
        ]}>
          <Text style={styles.statusText}>
            {item.is_tracking ? '🟢 Tracking' : '🔴 Offline'}
          </Text>
        </View>
      </View>
      
      {item.last_location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            📍 Last: {new Date(item.last_location.timestamp).toLocaleString()}
          </Text>
          <Text style={styles.coordsText}>
            {item.last_location.latitude.toFixed(6)}, {item.last_location.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      <Text style={styles.tapHint}>Tap for details →</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Users</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          Total: {users.length} | Active: {users.filter((u: any) => u.is_tracking).length}
        </Text>
        <Text style={styles.liveIndicator}>🔴 LIVE</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyText}>No Users Yet</Text>
          <Text style={styles.emptySubtext}>Approve pending requests first</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
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
  placeholder: {
    width: 50,
  },
  statsBar: {
    backgroundColor: '#2d3548',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    color: '#fff',
    fontSize: 14,
  },
  liveIndicator: {
    color: '#ff4757',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    fontSize: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  listContainer: {
    padding: 20,
  },
  userCard: {
    backgroundColor: '#2d3548',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
  },
  statusIndicator: {
    backgroundColor: '#ff4757',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeIndicator: {
    backgroundColor: '#4ecdc4',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#404654',
  },
  locationText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 5,
  },
  coordsText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  tapHint: {
    fontSize: 11,
    color: '#00d9ff',
    textAlign: 'right',
    marginTop: 10,
  },
});

export default MasterUsersScreen;
