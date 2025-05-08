import React, { useState, useEffect } from 'react';
import { BluetoothService } from '../services/bluetooth';
import { NotificationService } from '../services/notifications';
import { DoorOpen, DoorClosed, Bluetooth } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

const bluetoothService = new BluetoothService();
const notificationService = NotificationService.getInstance();

export const DoorControl: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  const vibrate = async (type: ImpactStyle = ImpactStyle.Medium) => {
    try {
      await Haptics.impact({ style: type });
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  };

  const updateWidget = async (doorStatus: string) => {
    if (Capacitor.getPlatform() === 'android') {
      try {
        await App.open({ url: `com.example.app://widget?door=${doorStatus}` });
      } catch (error) {
        console.error('Error updating widget:', error);
      }
    }
  };

  useEffect(() => {
    // Инициализация уведомлений при монтировании компонента
    notificationService.initialize();
    vibrate(ImpactStyle.Light);

    // Настройка периодических уведомлений о состоянии двери
    const setupPeriodicNotifications = async () => {
      await notificationService.scheduleRepeatingNotification(
        'Проверка состояния двери',
        'Проверьте, что дверь надежно закрыта',
        'day' // каждые 24 часа
      );
    };

    setupPeriodicNotifications();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    await vibrate('medium');
    try {
      const devicesFound = await bluetoothService.requestDevice();
      if (devicesFound) {
        const connected = await bluetoothService.connect();
        setIsConnected(connected);
        if (connected) {
          await vibrate('heavy');
          await notificationService.showImportantNotification(
            'Подключение установлено',
            'Устройство успешно подключено'
          );
        }
      }
    } catch (error) {
      console.error('Ошибка при подключении:', error);
      await vibrate('heavy');
      await notificationService.showImportantNotification(
        'Ошибка подключения',
        'Не удалось подключиться к устройству'
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await vibrate('medium');
    await bluetoothService.disconnect();
    setIsConnected(false);
    await vibrate('heavy');
    await notificationService.showImportantNotification(
      'Отключено',
      'Устройство отключено'
    );
  };

  const handleDoorToggle = async () => {
    await vibrate(ImpactStyle.Medium);
    try {
      const command = isDoorOpen ? 'DOOR_CLOSE' : 'DOOR_OPEN';
      const success = await bluetoothService.sendCommand(command);
      
      if (success) {
        setIsDoorOpen(!isDoorOpen);
        await vibrate(ImpactStyle.Heavy);
        await notificationService.showRegularNotification(
          'Дверь',
          isDoorOpen ? 'Дверь закрыта' : 'Дверь открыта'
        );
        // Обновляем виджет
        await updateWidget(isDoorOpen ? 'Closed' : 'Open');
      }
    } catch (error) {
      console.error('Ошибка при управлении дверью:', error);
      await vibrate(ImpactStyle.Heavy);
      await notificationService.showImportantNotification(
        'Ошибка',
        'Не удалось выполнить команду'
      );
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-white to-blue-50 p-4 rounded-xl mb-6 animate-fade-in border border-blue-100">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-gray-900">Управление дверью</h2>
        <div className="flex items-center gap-1 px-2 py-1 bg-opacity-20 rounded-full">
          <Bluetooth className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="text-xs text-gray-500">{isConnected ? 'Подключено' : 'Отключено'}</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center py-6">
        <div className={`w-24 h-24 flex items-center justify-center rounded-full 
          transition-all duration-500 ease-in-out transform
          ${isDoorOpen 
            ? 'bg-green-100 text-green-500 scale-110' 
            : isConnecting 
              ? 'bg-blue-100 text-hotel-blue animate-pulse' 
              : 'bg-gray-100 text-gray-500'
          } 
          mb-6 ${isConnecting ? 'animate-unlock' : ''}`}>
          {isDoorOpen ? 
            <DoorOpen className="w-12 h-12" /> : 
            <DoorClosed className="w-12 h-12" />}
        </div>
        
        <div className="flex space-x-4">
          {!isConnected ? (
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className={`px-4 py-2 rounded-lg ${
                isConnecting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isConnecting ? 'Подключение...' : 'Подключиться'}
            </Button>
          ) : (
            <Button 
              onClick={handleDisconnect}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
            >
              Отключиться
            </Button>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={handleDoorToggle}
            disabled={!isConnected}
            className={`px-6 py-3 rounded-lg text-white ${
              isConnected
                ? isDoorOpen
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isDoorOpen ? 'Закрыть дверь' : 'Открыть дверь'}
          </Button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-lg">
            Статус: {isConnected ? 'Подключено' : 'Отключено'}
          </p>
          <p className="text-lg">
            Дверь: {isDoorOpen ? 'Открыта' : 'Закрыта'}
          </p>
        </div>
      </div>
    </Card>
  );
};
