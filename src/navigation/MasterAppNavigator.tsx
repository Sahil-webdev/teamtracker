import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MasterLoginScreen from '../screens/MasterLoginScreen';
import MasterDashboardScreen from '../screens/MasterDashboardScreen';
import MasterRequestsScreen from '../screens/MasterRequestsScreen';
import MasterUsersScreen from '../screens/MasterUsersScreen';
import MasterUserDetailScreen from '../screens/MasterUserDetailScreen';
import MasterMapScreen from '../screens/MasterMapScreen';

const Stack = createNativeStackNavigator();

function MasterAppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MasterLogin"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1a1d2e' },
      }}
    >
      <Stack.Screen name="MasterLogin" component={MasterLoginScreen} />
      <Stack.Screen name="MasterDashboard" component={MasterDashboardScreen} />
      <Stack.Screen name="MasterRequests" component={MasterRequestsScreen} />
      <Stack.Screen name="MasterUsers" component={MasterUsersScreen} />
      <Stack.Screen name="MasterUserDetail" component={MasterUserDetailScreen} />
      <Stack.Screen name="MasterMap" component={MasterMapScreen} />
    </Stack.Navigator>
  );
}

export default MasterAppNavigator;
