import { NativeModules } from 'react-native';

export type AppPanel = 'user' | 'master';

const nativePanel = NativeModules.PanelType?.panel;

export const APP_PANEL: AppPanel = nativePanel === 'user' ? 'user' : 'master';
