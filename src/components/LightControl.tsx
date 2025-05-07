import React, { useState } from 'react';
import { Lightbulb, LightbulbOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface LightControlProps {
  zone: string;
}

const LightControl: React.FC<LightControlProps> = ({ zone }) => {
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(60);

  const vibrate = async (type: ImpactStyle = ImpactStyle.Medium) => {
    try {
      await Haptics.impact({ style: type });
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  };

  const toggleLight = async () => {
    await vibrate(ImpactStyle.Medium);
    setIsOn(!isOn);
  };

  const handleBrightnessChange = async (value: number[]) => {
    const newBrightness = value[0];
    setBrightness(newBrightness);
    
    // Вибрация зависит от интенсивности света
    if (newBrightness > 80) {
      await vibrate(ImpactStyle.Heavy);
    } else if (newBrightness > 40) {
      await vibrate(ImpactStyle.Medium);
    } else {
      await vibrate(ImpactStyle.Light);
    }
  };

  return (
    <Card className="room-card overflow-hidden bg-white p-4 rounded-xl mb-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Свет: {zone}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLight}
          className={`rounded-full ${isOn ? 'text-hotel-amber bg-hotel-light-amber/30' : 'text-gray-400 bg-gray-100'}`}
        >
          {isOn ? (
            <Lightbulb className={`h-5 w-5 ${isOn ? 'animate-pulse-light' : ''}`} />
          ) : (
            <LightbulbOff className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className={`transition-opacity duration-300 ${isOn ? 'opacity-100' : 'opacity-50'}`}>
        <div className="flex items-center mb-2">
          <LightbulbOff className="h-4 w-4 text-gray-400 mr-2" />
          <div className="flex-grow px-2 py-1">
            <Slider
              value={[brightness]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleBrightnessChange}
              disabled={!isOn}
              className="slider-track"
            />
          </div>
          <Lightbulb className="h-4 w-4 text-hotel-amber ml-2" />
        </div>
        <div className="text-xs text-right text-gray-500">
          {brightness}%
        </div>
      </div>
    </Card>
  );
};

export default LightControl;
