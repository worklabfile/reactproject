
import React, { useState } from 'react';
import RoomHeader from '@/components/RoomHeader';
import DoorControl from '@/components/DoorControl';
import LightControl from '@/components/LightControl';
import AirControl from '@/components/AirControl';
import StatusBar from '@/components/StatusBar';
import ServiceRequest from '@/components/ServiceRequest';

const Index = () => {
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const toggleDoNotDisturb = () => {
    setDoNotDisturb(!doNotDisturb);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="container max-w-md mx-auto px-4 py-6">
        <RoomHeader roomNumber="507" guestName="Алексей" />
        
        <StatusBar 
          doNotDisturb={doNotDisturb} 
          toggleDoNotDisturb={toggleDoNotDisturb} 
        />
        
        <DoorControl />
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Управление светом</h2>
          <div className="grid grid-cols-1 gap-4">
            <LightControl zone="Основной" />
            <LightControl zone="Ванная" />
          </div>
        </div>
        
        <AirControl />
        
        <ServiceRequest />
      </div>
    </div>
  );
};

export default Index;
