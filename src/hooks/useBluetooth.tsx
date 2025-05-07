import { useState, useEffect } from 'react';
import { toast } from "sonner";

interface BluetoothDevice {
  id: string;
  name: string;
}

export const useBluetooth = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);

  // Simulate Bluetooth functionality
  const connectToDoor = async () => {
    if (!navigator.bluetooth) {
      toast.error("Bluetooth не поддерживается в этом браузере.");
      return false;
    }

    try {
      setIsConnecting(true);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful connection
      setIsConnected(true);
      setDevice({
        id: 'room-door-123',
        name: 'Room Door Lock'
      });
      
      toast.success("Успешное подключение к замку двери");
      return true;
    } catch (error) {
      console.error('Ошибка при подключении к Bluetooth:', error);
      toast.error("Не удалось подключиться к замку двери.");
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromDoor = () => {
    setIsConnected(false);
    setDevice(null);
    toast.info("Отключено от замка двери");
  };

  const unlockDoor = async () => {
    if (!isConnected) {
      const connected = await connectToDoor();
      if (!connected) return false;
    }
    
    // Simulate unlocking delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast.success("Дверь открыта");
    return true;
  };

  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnectFromDoor();
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    device,
    connectToDoor,
    disconnectFromDoor,
    unlockDoor
  };
};
