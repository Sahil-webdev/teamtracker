/**
 * Location Tracker App
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { APP_PANEL } from './src/config/panel';
import UserAppNavigator from './src/navigation/UserAppNavigator';
import MasterAppNavigator from './src/navigation/MasterAppNavigator';

function App() {
  return (
    <NavigationContainer>
      {APP_PANEL === 'user' ? <UserAppNavigator /> : <MasterAppNavigator />}
    </NavigationContainer>
  );
}

export default App;
