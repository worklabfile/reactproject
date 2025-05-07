
import React, { useState } from 'react';
import { DoorOpen, DoorClosed } from 'lucide-react';
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
    <Card className="room-card overflow-hidden bg-white p-4 rounded-xl mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-gray-900">Управление дверью</h2>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
      </div>
      
      <div className="flex flex-col items-center py-6">
        <div className={`w-24 h-24 flex items-center justify-center rounded-full 
          ${doorOpen ? 'bg-hotel-light-blue text-hotel-blue' : 'bg-gray-100 text-gray-500'} 
          mb-4 transform transition-all duration-300 ${isUnlocking ? 'animate-unlock' : ''}`}>
          {doorOpen ? 
            <DoorOpen className="w-12 h-12" /> : 
            <DoorClosed className="w-12 h-12" />}
        </div>
        
        <Button 
          onClick={handleUnlock}
          disabled={isUnlocking || isConnecting}
          className="w-full bg-hotel-blue hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-200"
        >
          {isUnlocking ? 'Открываем...' : doorOpen ? 'Дверь открыта' : 'Открыть дверь'}
        </Button>
      </div>
    </Card>
  );
};

export default DoorControl;
