import React, { useState } from 'react';
import { AirVent } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const AirControl: React.FC = () => {
  const [isOn, setIsOn] = useState(true);
  const [temperature, setTemperature] = useState(23);
  const [mode, setMode] = useState("cool");

  const vibrate = async (type: ImpactStyle = ImpactStyle.Medium) => {
    try {
      await Haptics.impact({ style: type });
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  };

  const toggleAir = async () => {
    await vibrate(ImpactStyle.Medium);
    setIsOn(!isOn);
  };

  const handleTemperatureChange = async (value: number[]) => {
    const newTemp = value[0];
    setTemperature(newTemp);
    
    // Вибрация зависит от разницы с комфортной температурой (22°C)
    const tempDiff = Math.abs(newTemp - 22);
    if (tempDiff > 5) {
      await vibrate(ImpactStyle.Heavy);
    } else if (tempDiff > 2) {
      await vibrate(ImpactStyle.Medium);
    } else {
      await vibrate(ImpactStyle.Light);
    }
  };

  const handleModeChange = async (value: string) => {
    if (value) {
      await vibrate(ImpactStyle.Medium);
      setMode(value);
    }
  };

  return (
    <Card className="room-card overflow-hidden bg-white p-4 rounded-xl mb-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Климат-контроль</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAir}
          className={`rounded-full ${isOn ? 'text-hotel-blue bg-hotel-light-blue/30' : 'text-gray-400 bg-gray-100'}`}
        >
          <AirVent className="h-5 w-5" />
        </Button>
      </div>
      
      <div className={`transition-opacity duration-300 ${isOn ? 'opacity-100' : 'opacity-50'}`}>
        <div className="flex justify-center mb-4">
          <div className="text-4xl font-semibold text-center">
            {temperature}°C
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <span className="text-xs text-blue-500">18°C</span>
            <div className="flex-grow mx-2">
              <Slider
                value={[temperature]}
                min={18}
                max={30}
                step={1}
                onValueChange={handleTemperatureChange}
                disabled={!isOn}
                className="temp-slider-track"
              />
            </div>
            <span className="text-xs text-red-500">30°C</span>
          </div>
        </div>
        
        <ToggleGroup type="single" value={mode} onValueChange={(value) => value && handleModeChange(value)} disabled={!isOn} className="justify-center">
          <ToggleGroupItem value="cool" aria-label="Охлаждение" className="text-xs">
            Охлаждение
          </ToggleGroupItem>
          <ToggleGroupItem value="heat" aria-label="Обогрев" className="text-xs">
            Обогрев
          </ToggleGroupItem>
          <ToggleGroupItem value="fan" aria-label="Вентиляция" className="text-xs">
            Вентиляция
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Card>
  );
};

export default AirControl;
