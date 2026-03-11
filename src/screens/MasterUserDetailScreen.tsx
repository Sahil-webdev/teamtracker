import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  approved: boolean;
  rejected: boolean;
  blocked: boolean;
  created_at: string;
  last_login: string | null;
  tracking_started_at: string | null;
  tracking_stopped_at: string | null;
  is_tracking: boolean;
  location_count: number;
  last_location: {
    latitude: number;
    longitude: number;
    timestamp: string;
  } | null;
}

interface Location {
  id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  is_tracking: boolean;
}

const MasterUserDetailScreen = ({ route, navigation }: any) => {
  const { token, userId } = route.params;
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserDetail = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MASTER_USER_DETAIL(userId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetail(data);
      }
    } catch (error) {
      console.error('Error fetching user detail:', error);
    }
  };

  const fetchUserLocations = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MASTER_USER_LOCATIONS(userId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
    fetchUserLocations();

    // Auto-refresh every 10 seconds for live updates
    const interval = setInterval(() => {
      fetchUserDetail();
      fetchUserLocations();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserDetail(), fetchUserLocations()]);
    setRefreshing(false);
  };

  const handleDeleteUser = () => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userDetail?.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                API_ENDPOINTS.MASTER_USER_DELETE(userId),
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                Alert.alert('Success', 'User deleted successfully');
                navigation.goBack();
              } else {
                const data = await response.json();
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const handleBlockUser = async () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${userDetail?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                API_ENDPOINTS.MASTER_USER_BLOCK(userId),
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                Alert.alert('Success', 'User blocked successfully');
                fetchUserDetail();
              } else {
                const data = await response.json();
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to block user');
            }
          },
        },
      ]
    );
  };

  const openInGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeDifference = (dateString: string | null) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading || !userDetail) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{userDetail.name}</Text>
            <View
              style={[
                styles.statusBadge,
                userDetail.is_tracking && styles.activeBadge,
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {userDetail.is_tracking ? '🟢 Active' : '🔴 Offline'}
              </Text>
            </View>
          </View>
          <Text style={styles.emailText}>{userDetail.email}</Text>
        </View>

        {/* Timeline Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Activity Timeline</Text>
          
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>Account Created</Text>
            <Text style={styles.timelineValue}>
              {formatDate(userDetail.created_at)}
            </Text>
            <Text style={styles.timelineAgo}>
              {getTimeDifference(userDetail.created_at)}
            </Text>
          </View>

          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>Last Login</Text>
            <Text style={styles.timelineValue}>
              {formatDate(userDetail.last_login)}
            </Text>
            {userDetail.last_login && (
              <Text style={styles.timelineAgo}>
                {getTimeDifference(userDetail.last_login)}
              </Text>
            )}
          </View>

          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>Location Tracking Started</Text>
            <Text style={styles.timelineValue}>
              {formatDate(userDetail.tracking_started_at)}
            </Text>
            {userDetail.tracking_started_at && (
              <Text style={styles.timelineAgo}>
                {getTimeDifference(userDetail.tracking_started_at)}
              </Text>
            )}
          </View>

          {userDetail.tracking_stopped_at && (
            <View style={styles.timelineItem}>
              <Text style={styles.timelineLabel}>Location Tracking Stopped</Text>
              <Text style={styles.timelineValue}>
                {formatDate(userDetail.tracking_stopped_at)}
              </Text>
              <Text style={styles.timelineAgo}>
                {getTimeDifference(userDetail.tracking_stopped_at)}
              </Text>
            </View>
          )}
        </View>

        {/* Current Location Card */}
        {userDetail.last_location && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📍 Current Location</Text>
            <TouchableOpacity
              style={styles.locationItem}
              onPress={() =>
                openInGoogleMaps(
                  userDetail.last_location!.latitude,
                  userDetail.last_location!.longitude
                )
              }
            >
              <View style={styles.locationInfo}>
                <Text style={styles.locationCoords}>
                  {userDetail.last_location.latitude.toFixed(6)},{' '}
                  {userDetail.last_location.longitude.toFixed(6)}
                </Text>
                <Text style={styles.locationTime}>
                  {formatDate(userDetail.last_location.timestamp)}
                </Text>
                <Text style={styles.locationAgo}>
                  {getTimeDifference(userDetail.last_location.timestamp)}
                </Text>
              </View>
              <Text style={styles.mapIcon}>🗺️</Text>
            </TouchableOpacity>
            <Text style={styles.mapHint}>Tap to open in Google Maps</Text>
          </View>
        )}

        {/* Location History Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            📌 Location History ({userDetail.location_count} records)
          </Text>
          {locations.length === 0 ? (
            <Text style={styles.noDataText}>No location data yet</Text>
          ) : (
            locations.slice(0, 20).map((location, index) => (
              <TouchableOpacity
                key={location.id}
                style={styles.historyItem}
                onPress={() =>
                  openInGoogleMaps(location.latitude, location.longitude)
                }
              >
                <View style={styles.historyNumber}>
                  <Text style={styles.historyNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyCoords}>
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.historyTime}>
                    {formatDate(location.timestamp)}
                  </Text>
                  <Text style={styles.historyAgo}>
                    {getTimeDifference(location.timestamp)}
                  </Text>
                </View>
                <Text style={styles.historyIcon}>📍</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Management Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛠️ User Management</Text>
          
          {!userDetail.blocked ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.blockButton]}
              onPress={handleBlockUser}
            >
              <Text style={styles.actionButtonText}>🚫 Block User</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.blockedInfo}>
              <Text style={styles.blockedText}>⛔ User is blocked</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteUser}
          >
            <Text style={styles.actionButtonText}>🗑️ Delete User</Text>
          </TouchableOpacity>

          <Text style={styles.warningText}>
            ⚠️ Delete action is permanent and cannot be undone
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  scrollContent: {
    padding: 20,
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
  card: {
    backgroundColor: '#2d3548',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  emailText: {
    fontSize: 14,
    color: '#999',
  },
  statusBadge: {
    backgroundColor: '#ff4757',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeBadge: {
    backgroundColor: '#4ecdc4',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#404654',
  },
  timelineLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  timelineValue: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 3,
  },
  timelineAgo: {
    fontSize: 12,
    color: '#00d9ff',
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3d4558',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  locationInfo: {
    flex: 1,
  },
  locationCoords: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  locationTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  locationAgo: {
    fontSize: 11,
    color: '#00d9ff',
  },
  mapIcon: {
    fontSize: 24,
  },
  mapHint: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  noDataText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d4558',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  historyNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00d9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyNumberText: {
    color: '#1a1d2e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyInfo: {
    flex: 1,
  },
  historyCoords: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 3,
  },
  historyTime: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  historyAgo: {
    fontSize: 10,
    color: '#00d9ff',
  },
  historyIcon: {
    fontSize: 18,
  },
  actionButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  blockButton: {
    backgroundColor: '#ff9900',
  },
  deleteButton: {
    backgroundColor: '#ff4757',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blockedInfo: {
    backgroundColor: '#3d4558',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  blockedText: {
    color: '#ff9900',
    fontSize: 14,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 11,
    color: '#ff4757',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});

export default MasterUserDetailScreen;
