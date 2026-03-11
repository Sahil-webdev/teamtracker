import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';

const MasterDashboardScreen = ({ route, navigation }: any) => {
  const { token, user } = route.params;
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRequests: 0,
    activeUsers: 0,
    trackingUsers: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MASTER_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const users = data.users;
        
        setStats({
          totalUsers: users.length,
          pendingRequests: users.filter((u: any) => !u.approved).length,
          activeUsers: users.filter((u: any) => u.approved).length,
          trackingUsers: users.filter((u: any) => u.is_tracking).length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const handleLogout = () => {
    navigation.navigate('MasterLogin');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Master Panel</Text>
            <Text style={styles.headerTitle}>{user.name || 'Admin'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={[styles.statCard, styles.pendingCard]}>
            <Text style={styles.statNumber}>{stats.pendingRequests}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.activeCard]}>
            <Text style={styles.statNumber}>{stats.activeUsers}</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
          <View style={[styles.statCard, styles.trackingCard]}>
            <Text style={styles.statNumber}>{stats.trackingUsers}</Text>
            <Text style={styles.statLabel}>Tracking Now</Text>
          </View>
        </View>

        {/* Navigation Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MasterRequests', { token, user })}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Approval Requests</Text>
              <Text style={styles.menuSubtitle}>
                Approve pending user signups
              </Text>
            </View>
            {stats.pendingRequests > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{stats.pendingRequests}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MasterUsers', { token, user })}
          >
            <Text style={styles.menuIcon}>👥</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>All Users</Text>
              <Text style={styles.menuSubtitle}>
                View all users and their status
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MasterMap', { token, user })}
          >
            <Text style={styles.menuIcon}>🗺️</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Live Map</Text>
              <Text style={styles.menuSubtitle}>
                Track user locations in real-time
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutBtn: {
    padding: 10,
  },
  logoutText: {
    color: '#ff4757',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2d3548',
    borderRadius: 15,
    padding: 20,
    margin: 5,
    alignItems: 'center',
  },
  pendingCard: {
    backgroundColor: '#ff6b6b',
  },
  activeCard: {
    backgroundColor: '#4ecdc4',
  },
  trackingCard: {
    backgroundColor: '#95e1d3',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  menuContainer: {
    padding: 20,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3548',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  menuIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  badge: {
    backgroundColor: '#ff4757',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MasterDashboardScreen;
