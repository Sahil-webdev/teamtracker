import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LocationTrackingScreen from '../screens/LocationTrackingScreen';

const Stack = createNativeStackNavigator();

function UserAppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1a1d2e' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="LocationTracking" component={LocationTrackingScreen} />
    </Stack.Navigator>
  );
}

export default UserAppNavigator;
