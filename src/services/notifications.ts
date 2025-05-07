import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics } from '@capacitor/haptics';

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async vibrate(type: 'light' | 'medium' | 'heavy' = 'medium') {
    try {
      switch (type) {
        case 'light':
          await Haptics.impact({ style: 'light' });
          break;
        case 'medium':
          await Haptics.impact({ style: 'medium' });
          break;
        case 'heavy':
          await Haptics.impact({ style: 'heavy' });
          break;
      }
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  }

  async initialize() {
    if (this.isInitialized) return;
    
    if (Capacitor.getPlatform() === 'android') {
      try {
        // Запрос разрешений для локальных уведомлений
        const permissionStatus = await LocalNotifications.requestPermissions();
        console.log('Permission status:', permissionStatus);

        // Настройка каналов уведомлений для Android
        await this.setupNotificationChannels();

        // Обработка нажатия на уведомление
        LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
          console.log('Notification action performed:', notification);
          this.vibrate('light');
          // Открываем приложение при нажатии на уведомление
          App.open({ url: 'myapp://' });
        });

        // Обработка получения уведомления в фоне
        LocalNotifications.addListener('localNotificationReceived', (notification) => {
          console.log('Notification received:', notification);
          this.vibrate('medium');
        });

        // Слушаем события приложения
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active:', isActive);
          if (isActive) {
            this.vibrate('light');
          }
        });

        this.isInitialized = true;
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    }
  }

  private async setupNotificationChannels() {
    try {
      // Основной канал для уведомлений о двери
      await LocalNotifications.createChannel({
        id: 'door-control',
        name: 'Управление дверью',
        description: 'Уведомления о состоянии двери',
        importance: 4,
        sound: 'notification',
        lights: true,
        lightColor: '#FF0000',
        vibration: true
      });

      // Канал для важных уведомлений
      await LocalNotifications.createChannel({
        id: 'important',
        name: 'Важные уведомления',
        description: 'Критически важные уведомления',
        importance: 5,
        sound: 'notification',
        lights: true,
        lightColor: '#FF0000',
        vibration: true
      });

      // Канал для обычных уведомлений
      await LocalNotifications.createChannel({
        id: 'regular',
        name: 'Обычные уведомления',
        description: 'Обычные уведомления',
        importance: 3,
        sound: 'notification',
        lights: true,
        lightColor: '#2196F3',
        vibration: true
      });
    } catch (error) {
      console.error('Error creating notification channels:', error);
    }
  }

  async showLocalNotification(title: string, body: string, type: 'door-control' | 'important' | 'regular' = 'regular') {
    if (Capacitor.getPlatform() === 'android') {
      try {
        const notificationId = Date.now();
        
        await LocalNotifications.schedule({
          notifications: [
            {
              title: title,
              body: body,
              id: notificationId,
              channelId: type,
              schedule: { at: new Date(Date.now() + 1000) },
              sound: 'notification',
              attachments: null,
              actionTypeId: '',
              extra: {
                data: 'Дополнительные данные',
                timestamp: new Date().toISOString()
              }
            }
          ]
        });

        // Вибрация при показе уведомления
        await this.vibrate(type === 'important' ? 'heavy' : 'medium');
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }

  async showDoorNotification(isOpen: boolean) {
    const title = isOpen ? 'Дверь открыта' : 'Дверь закрыта';
    const body = isOpen ? 'Кто-то открыл дверь' : 'Дверь была закрыта';
    
    await this.showLocalNotification(title, body, 'door-control');
    // Дополнительная вибрация при изменении состояния двери
    await this.vibrate('heavy');
  }

  async showImportantNotification(title: string, body: string) {
    await this.showLocalNotification(title, body, 'important');
  }

  async showRegularNotification(title: string, body: string) {
    await this.showLocalNotification(title, body, 'regular');
  }

  async scheduleRepeatingNotification(title: string, body: string, interval: 'day' | 'hour' | 'minute') {
    if (Capacitor.getPlatform() === 'android') {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: title,
              body: body,
              id: Date.now(),
              channelId: 'regular',
              schedule: { 
                every: interval,
                on: {
                  hour: 0,
                  minute: 0
                }
              },
              sound: 'notification'
            }
          ]
        });
      } catch (error) {
        console.error('Error scheduling repeating notification:', error);
      }
    }
  }
} 