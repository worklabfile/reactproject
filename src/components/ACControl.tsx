import React, { useState } from 'react';
import { BluetoothService } from '../services/bluetooth';
import { NotificationService } from '../services/notifications';
import { Snowflake, Fan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const bluetoothService = new BluetoothService();
const notificationService = NotificationService.getInstance();

export const ACControl: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const [temperature, setTemperature] = useState(22);
  const [fanSpeed, setFanSpeed] = useState(2);
  const [isDoNotDisturb, setIsDoNotDisturb] = useState(false);
  const [isMaintenanceAvailable, setIsMaintenanceAvailable] = useState(false);

  const vibrate = async (type: ImpactStyle = ImpactStyle.Medium) => {
    try {
      await Haptics.impact({ style: type });
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  };

  const handleToggle = async () => {
    await vibrate(ImpactStyle.Medium);
    try {
      const command = isOn ? 'AC_OFF' : 'AC_ON';
      const success = await bluetoothService.sendCommand(command);
      
      if (success) {
        setIsOn(!isOn);
        await vibrate(ImpactStyle.Heavy);
        await notificationService.showRegularNotification(
          'Кондиционер',
          isOn ? 'Кондиционер выключен' : 'Кондиционер включен'
        );
      }
    } catch (error) {
      console.error('Ошибка при управлении кондиционером:', error);
      await vibrate(ImpactStyle.Heavy);
      await notificationService.showImportantNotification(
        'Ошибка',
        'Не удалось выполнить команду'
      );
    }
  };

  const handleTemperatureChange = async (newTemp: number) => {
    await vibrate(ImpactStyle.Light);
    try {
      const command = `AC_TEMP_${newTemp}`;
      const success = await bluetoothService.sendCommand(command);
      
      if (success) {
        setTemperature(newTemp);
        // Интенсивность вибрации зависит от разницы температур
        const tempDiff = Math.abs(newTemp - 22); // 22 - комфортная температура
        if (tempDiff > 5) {
          await vibrate(ImpactStyle.Heavy);
        } else if (tempDiff > 2) {
          await vibrate(ImpactStyle.Medium);
        } else {
          await vibrate(ImpactStyle.Light);
        }
      }
    } catch (error) {
      console.error('Ошибка при изменении температуры:', error);
      await vibrate(ImpactStyle.Heavy);
      await notificationService.showImportantNotification(
        'Ошибка',
        'Не удалось изменить температуру'
      );
    }
  };

  const handleFanSpeedChange = async (newSpeed: number) => {
    await vibrate(ImpactStyle.Light);
    try {
      const command = `AC_FAN_${newSpeed}`;
      const success = await bluetoothService.sendCommand(command);
      
      if (success) {
        setFanSpeed(newSpeed);
        // Интенсивность вибрации зависит от скорости вентилятора
        switch (newSpeed) {
          case 1:
            await vibrate(ImpactStyle.Light);
            break;
          case 2:
            await vibrate(ImpactStyle.Medium);
            break;
          case 3:
            await vibrate(ImpactStyle.Heavy);
            break;
        }
      }
    } catch (error) {
      console.error('Ошибка при изменении скорости вентилятора:', error);
      await vibrate(ImpactStyle.Heavy);
      await notificationService.showImportantNotification(
        'Ошибка',
        'Не удалось изменить скорость вентилятора'
      );
    }
  };

  const handleDoNotDisturb = async () => {
    await vibrate(ImpactStyle.Medium);
    setIsDoNotDisturb(!isDoNotDisturb);
    await vibrate(ImpactStyle.Heavy);
    await notificationService.showRegularNotification(
      'Режим не беспокоить',
      isDoNotDisturb ? 'Режим не беспокоить выключен' : 'Режим не беспокоить включен'
    );
  };

  const handleMaintenance = async () => {
    await vibrate(ImpactStyle.Medium);
    setIsMaintenanceAvailable(!isMaintenanceAvailable);
    await vibrate(ImpactStyle.Heavy);
    await notificationService.showImportantNotification(
      'Обслуживание',
      isMaintenanceAvailable ? 'Обслуживание недоступно' : 'Обслуживание доступно'
    );
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-white to-blue-50 p-4 rounded-xl mb-6 animate-fade-in border border-blue-100">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-gray-900">Управление кондиционером</h2>
        <div className="flex items-center gap-1 px-2 py-1 bg-opacity-20 rounded-full">
          <Snowflake className={`h-4 w-4 ${isOn ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="text-xs text-gray-500">{isOn ? 'Включено' : 'Выключено'}</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center py-6">
        <div className={`w-24 h-24 flex items-center justify-center rounded-full 
          transition-all duration-500 ease-in-out transform
          ${isOn 
            ? 'bg-blue-100 text-blue-500 scale-110' 
            : 'bg-gray-100 text-gray-500'
          } 
          mb-6`}>
          {isOn ? 
            <Snowflake className="w-12 h-12" /> : 
            <Fan className="w-12 h-12" />}
        </div>
        
        <div className="flex space-x-4 mb-4">
          <Button 
            onClick={handleToggle}
            className={`px-6 py-3 rounded-lg text-white ${
              isOn
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            {isOn ? 'Выключить' : 'Включить'}
          </Button>
        </div>

        {isOn && (
          <>
            <div className="w-full max-w-xs mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Температура: {temperature}°C
              </label>
              <input
                type="range"
                min="16"
                max="30"
                value={temperature}
                onChange={(e) => handleTemperatureChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="w-full max-w-xs mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Скорость вентилятора: {fanSpeed}
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3].map((speed) => (
                  <Button
                    key={speed}
                    onClick={() => handleFanSpeedChange(speed)}
                    className={`px-4 py-2 rounded-lg ${
                      fanSpeed === speed
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                    } text-white`}
                  >
                    {speed}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex space-x-4 mt-4">
          <Button 
            onClick={handleDoNotDisturb}
            className={`px-4 py-2 rounded-lg ${
              isDoNotDisturb
                ? 'bg-purple-500 hover:bg-purple-600'
                : 'bg-gray-500 hover:bg-gray-600'
            } text-white`}
          >
            {isDoNotDisturb ? 'Не беспокоить' : 'Беспокоить'}
          </Button>

          <Button 
            onClick={handleMaintenance}
            className={`px-4 py-2 rounded-lg ${
              isMaintenanceAvailable
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-500 hover:bg-gray-600'
            } text-white`}
          >
            {isMaintenanceAvailable ? 'Обслуживание' : 'Нет обслуживания'}
          </Button>
        </div>
      </div>
    </Card>
  );
}; 