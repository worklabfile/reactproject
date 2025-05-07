
import React from 'react';
import { Bell, BellOff, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusBarProps {
  doNotDisturb: boolean;
  toggleDoNotDisturb: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ doNotDisturb, toggleDoNotDisturb }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          <span>Подключено</span>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleDoNotDisturb}
        className={`flex items-center gap-1 ${doNotDisturb ? 'text-hotel-amber' : 'text-gray-500'}`}
      >
        {doNotDisturb ? (
          <>
            <BellOff className="h-4 w-4" />
            <span className="text-xs">Не беспокоить</span>
          </>
        ) : (
          <>
            <Bell className="h-4 w-4" />
            <span className="text-xs">Обслуживание доступно</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default StatusBar;
