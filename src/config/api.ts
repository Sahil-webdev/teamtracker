import { NativeModules } from 'react-native';

// Build-time value from Android BuildConfig (set through -PAPI_BASE_URL).
const nativeApiBaseUrl = NativeModules.PanelType?.apiBaseUrl as string | undefined;

export const API_BASE_URL = nativeApiBaseUrl || 'http://10.0.2.2:5000/api';

export const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/login`,
  MASTER_LOGIN: `${API_BASE_URL}/master/login`,
  LOCATION_START: `${API_BASE_URL}/location/start`,
  LOCATION_UPDATE: `${API_BASE_URL}/location/update`,
  LOCATION_STOP: `${API_BASE_URL}/location/stop`,
  MASTER_USERS: `${API_BASE_URL}/master/users`,
  MASTER_APPROVE: (userId: number) => `${API_BASE_URL}/master/approve/${userId}`,
  MASTER_REJECT: (userId: number) => `${API_BASE_URL}/master/reject/${userId}`,
  MASTER_USER_LOCATIONS: (userId: number) => `${API_BASE_URL}/master/user/${userId}/locations`,
  MASTER_USER_DETAIL: (userId: number) => `${API_BASE_URL}/master/user/${userId}`,
  MASTER_USER_DELETE: (userId: number) => `${API_BASE_URL}/master/user/${userId}/delete`,
  MASTER_USER_BLOCK: (userId: number) => `${API_BASE_URL}/master/user/${userId}/block`,
  MASTER_USER_UNBLOCK: (userId: number) => `${API_BASE_URL}/master/user/${userId}/unblock`,
};
