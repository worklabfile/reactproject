import React, { useState, useEffect } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { cn } from '@/lib/utils';

interface RotarySwitchProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const RotarySwitch: React.FC<RotarySwitchProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  className
}) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);

  const vibrate = async (type: ImpactStyle = ImpactStyle.Medium) => {
    try {
      await Haptics.impact({ style: type });
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  };

  // Вычисляем угол для каждого значения
  const getAngleForValue = (val: string) => {
    const index = options.findIndex(opt => opt.value === val);
    return (index * (360 / options.length)) % 360;
  };

  // Вычисляем ближайшее значение для угла
  const getValueForAngle = (angle: number) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const index = Math.round(normalizedAngle / (360 / options.length)) % options.length;
    return options[index].value;
  };

  useEffect(() => {
    setRotation(getAngleForValue(value));
  }, [value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setStartAngle(startAngle);
    setCurrentAngle(startAngle);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setCurrentAngle(currentAngle);
    
    const angleDiff = currentAngle - startAngle;
    const newRotation = (rotation + angleDiff) % 360;
    setRotation(newRotation);
    
    const newValue = getValueForAngle(newRotation);
    if (newValue !== value) {
      vibrate(ImpactStyle.Medium);
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Снаппинг к ближайшему значению
    const snappedValue = getValueForAngle(rotation);
    if (snappedValue !== value) {
      vibrate(ImpactStyle.Heavy);
      onChange(snappedValue);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, rotation, value]);

  return (
    <div className={cn("relative w-48 h-48 mx-auto", className)}>
      {/* Фон с делениями */}
      <div className="absolute inset-0 rounded-full bg-gray-100 border-2 border-gray-200">
        {options.map((option, index) => {
          const angle = (index * (360 / options.length)) % 360;
          const radian = (angle * Math.PI) / 180;
          const x = 50 + 45 * Math.cos(radian);
          const y = 50 + 45 * Math.sin(radian);
          
          return (
            <div
              key={option.value}
              className="absolute w-2 h-2 bg-gray-400 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}
      </div>
      
      {/* Ручка */}
      <div
        className={cn(
          "absolute inset-0 rounded-full cursor-pointer transition-transform duration-100",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-0 left-1/2 w-1 h-8 bg-blue-500 rounded-full transform -translate-x-1/2" />
      </div>
      
      {/* Текущее значение */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">
        {options.find(opt => opt.value === value)?.label}
      </div>
    </div>
  );
}; 