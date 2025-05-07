
import React from 'react';

interface RoomHeaderProps {
  roomNumber: string;
  guestName: string;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ roomNumber, guestName }) => {
  return (
    <div className="mb-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900">Номер {roomNumber}</h1>
      <p className="text-gray-600">Добро пожаловать, {guestName}</p>
    </div>
  );
};

export default RoomHeader;
