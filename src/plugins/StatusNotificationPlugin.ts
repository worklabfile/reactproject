import { registerPlugin } from '@capacitor/core';

export interface StatusNotificationPlugin {
  startService(): Promise<void>;
  updateStatus(options: {
    doorStatus: string;
    lightStatus: string;
    temperature: string;
  }): Promise<void>;
  stopService(): Promise<void>;
}

const StatusNotification = registerPlugin<StatusNotificationPlugin>('StatusNotification');

export default StatusNotification; 