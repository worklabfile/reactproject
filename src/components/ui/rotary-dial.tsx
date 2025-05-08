import React, { useState, useEffect } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { cn } from '@/lib/utils';

interface RotaryDialProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  formatValue?: (value: number) => string;
}

export const RotaryDial: React.FC<RotaryDialProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
  className,
  label,
  formatValue = (v) => v.toString()
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

  // Вычисляем угол для значения
  const getAngleForValue = (val: number) => {
    const range = max - min;
    const normalizedValue = (val - min) / range;
    return normalizedValue * 180; // Используем 180 градусов для полукруга
  };

  // Вычисляем значение для угла
  const getValueForAngle = (angle: number) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const range = max - min;
    const steps = range / step;
    const stepAngle = 180 / steps;
    const stepCount = Math.round(normalizedAngle / stepAngle);
    const newValue = min + (stepCount * step);
    return Math.min(Math.max(newValue, min), max);
  };

  useEffect(() => {
    setRotation(getAngleForValue(value));
  }, [value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault(); // Предотвращаем выделение текста
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
    e.preventDefault(); // Предотвращаем прокрутку страницы
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
      // Вибрация зависит от величины изменения
      const diff = Math.abs(newValue - value);
      if (diff > step * 2) {
        vibrate(ImpactStyle.Heavy);
      } else if (diff > step) {
        vibrate(ImpactStyle.Medium);
      } else {
        vibrate(ImpactStyle.Light);
      }
      onChange(newValue);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
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
      window.addEventListener('mousemove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp, { passive: false });
      // Блокируем прокрутку страницы
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      // Разблокируем прокрутку страницы
      document.body.style.overflow = '';
    };
  }, [isDragging, rotation, value]);

  return (
    <div className={cn("relative w-48 h-48 mx-auto", className)}>
      {/* Фон с делениями */}
      <div className="absolute inset-0 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden">
        {/* Полукруглый циферблат */}
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 0, 0 0)' }}>
          {/* Деления */}
          {Array.from({ length: Math.floor((max - min) / step) + 1 }).map((_, index) => {
            const angle = (index * (180 / ((max - min) / step))) % 360;
            const radian = (angle * Math.PI) / 180;
            const x = 50 + 45 * Math.cos(radian);
            const y = 50 + 45 * Math.sin(radian);
            
            return (
              <div
                key={index}
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
        {label && <div className="text-xs text-gray-500 mb-1">{label}</div>}
        <div>{formatValue(value)}</div>
      </div>
    </div>
  );
}; 