
import React from 'react';
import { Hotel } from 'lucide-react';

interface RoomHeaderProps {
  roomNumber: string;
  guestName: string;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ roomNumber, guestName }) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-hotel-blue text-white p-2 rounded-lg">
          <Hotel className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Номер {roomNumber}</h1>
          <p className="text-gray-600">Добро пожаловать, {guestName}</p>
        </div>
      </div>
      
      <div className="h-2 w-20 bg-gradient-to-r from-hotel-blue to-hotel-light-blue rounded-full mt-2"></div>
    </div>
  );
};

export default RoomHeader;
