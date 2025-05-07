
import React, { useState } from 'react';
import { DoorOpen, DoorClosed, Bluetooth } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBluetooth } from '@/hooks/useBluetooth';
import { Card } from '@/components/ui/card';

const DoorControl: React.FC = () => {
  const { isConnected, isConnecting, unlockDoor } = useBluetooth();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);

  const handleUnlock = async () => {
    try {
      setIsUnlocking(true);
      const success = await unlockDoor();
      
      if (success) {
        setDoorOpen(true);
        // Reset door state after a delay
        setTimeout(() => {
          setDoorOpen(false);
        }, 3000);
      }
    } finally {
      setIsUnlocking(false);
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
          ${doorOpen 
            ? 'bg-green-100 text-green-500 scale-110' 
            : isUnlocking 
              ? 'bg-blue-100 text-hotel-blue animate-pulse' 
              : 'bg-gray-100 text-gray-500'
          } 
          mb-6 ${isUnlocking ? 'animate-unlock' : ''}`}>
          {doorOpen ? 
            <DoorOpen className="w-12 h-12" /> : 
            <DoorClosed className="w-12 h-12" />}
        </div>
        
        <Button 
          onClick={handleUnlock}
          disabled={isUnlocking || isConnecting}
          className={`w-full py-3 rounded-lg shadow-md transition-all duration-300 
            ${doorOpen 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-hotel-blue hover:bg-blue-600'
            } text-white text-lg font-medium`}
        >
          {isUnlocking ? 'Открываем...' : doorOpen ? 'Дверь открыта' : 'Открыть дверь'}
        </Button>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          {isConnecting ? 'Подключение к замку...' : 
           isConnected ? 'Bluetooth-соединение установлено' : 
           'Нажмите, чтобы подключиться к замку'}
        </p>
      </div>
    </Card>
  );
};

export default DoorControl;
