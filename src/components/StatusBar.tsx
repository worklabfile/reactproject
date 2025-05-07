
import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusBarProps {
  doNotDisturb: boolean;
  toggleDoNotDisturb: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ doNotDisturb, toggleDoNotDisturb }) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-hotel-card rounded-lg shadow-sm mb-6">
      <div className="text-xs text-hotel-gray">
        Статус номера
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleDoNotDisturb}
        className={`flex items-center gap-1 ${doNotDisturb ? 'text-hotel-amber' : 'text-hotel-gray'}`}
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
