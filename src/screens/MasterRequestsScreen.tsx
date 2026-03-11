import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

const MasterRequestsScreen = ({ route, navigation }: any) => {
  const { token, user } = route.params;
  const [pendingUsers, setPendingUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MASTER_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const pending = data.users.filter((u: any) => !u.approved);
        setPendingUsers(pending);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPendingUsers();
    setRefreshing(false);
  };

  const handleApprove = async (userId: number, userName: string) => {
    Alert.alert(
      'Approve User',
      `Approve ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              const response = await fetch(API_ENDPOINTS.MASTER_APPROVE(userId), {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                Alert.alert('Success', `${userName} has been approved!`);
                fetchPendingUsers();
              } else {
                const data = await response.json();
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to approve user');
            }
          },
        },
      ]
    );
  };

  const handleReject = async (userId: number, userName: string) => {
    Alert.alert(
      'Reject User',
      `Reject ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(API_ENDPOINTS.MASTER_REJECT(userId), {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                Alert.alert('Success', `${userName} has been rejected!`);
                fetchPendingUsers();
              } else {
                const data = await response.json();
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to reject user');
            }
          },
        },
      ]
    );
  };

  const renderUser = ({ item }: any) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name || 'No Name'}</Text>
        <Text style={styles.userDetails}>{item.email}</Text>
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>OTP: </Text>
          <Text style={styles.otpValue}>{item.otp || 'N/A'}</Text>
        </View>
        <Text style={styles.userDate}>
          Signed up: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApprove(item.id, item.name || item.email)}
        >
          <Text style={styles.approveButtonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleReject(item.id, item.name || item.email)}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Requests</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : pendingUsers.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>✓</Text>
          <Text style={styles.emptyText}>No Pending Requests</Text>
          <Text style={styles.emptySubtext}>All users are approved</Text>
        </View>
      ) : (
        <FlatList
          data={pendingUsers}
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
  userInfo: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1d2e',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  otpLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
  },
  otpValue: {
    fontSize: 18,
    color: '#4ecdc4',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  userDate: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#4ecdc4',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#f44336',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MasterRequestsScreen;
