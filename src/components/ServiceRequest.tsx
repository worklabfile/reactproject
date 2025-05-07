
import React, { useState } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { useForm } from 'react-hook-form';

type ServiceRequestType = 'cleaning' | 'maintenance' | 'foodService' | 'other';
type RequestStatus = 'pending' | 'processing' | 'completed';

interface ServiceRequestProps {
  onRequestSubmit?: (type: ServiceRequestType, message: string) => void;
}

interface FormValues {
  message: string;
}

const ServiceRequest: React.FC<ServiceRequestProps> = ({ onRequestSubmit }) => {
  const [activeService, setActiveService] = useState<ServiceRequestType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      message: '',
    },
  });

  const handleServiceSelect = (type: ServiceRequestType) => {
    setActiveService(type);
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (!activeService) return;
    
    // Simulate sending request to hotel
    setRequestStatus('pending');
    
    // Close the sheet
    setIsOpen(false);
    
    // Show toast notification
    toast.success("Запрос отправлен");
    
    // Simulate response from hotel (status update)
    setTimeout(() => {
      setRequestStatus('processing');
      toast.info("Запрос принят в обработку");
      
      // Simulate completion
      setTimeout(() => {
        setRequestStatus('completed');
        toast.success("Запрос выполнен");
        
        // Reset after some time
        setTimeout(() => {
          setRequestStatus(null);
          setActiveService(null);
        }, 5000);
      }, 10000);
    }, 3000);
    
    // Call the callback if provided
    if (onRequestSubmit) {
      onRequestSubmit(activeService, data.message);
    }
    
    // Reset form
    form.reset();
  });
  
  const getServiceIcon = (type: ServiceRequestType) => {
    switch (type) {
      case 'cleaning':
        return '🧹';
      case 'maintenance':
        return '🔧';
      case 'foodService':
        return '🍽️';
      case 'other':
        return '❓';
    }
  };
  
  const getServiceName = (type: ServiceRequestType) => {
    switch (type) {
      case 'cleaning':
        return 'Уборка номера';
      case 'maintenance':
        return 'Техническая помощь';
      case 'foodService':
        return 'Обслуживание номера';
      case 'other':
        return 'Другой запрос';
    }
  };
  
  const getStatusIcon = () => {
    switch (requestStatus) {
      case 'pending':
        return <Clock className="h-5 w-5 text-hotel-amber animate-pulse" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-hotel-blue animate-pulse" />;
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="room-card overflow-hidden bg-white p-4 rounded-xl mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-gray-900">Услуги отеля</h2>
        {requestStatus && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
            {getStatusIcon()}
            <span>
              {requestStatus === 'pending' && 'Ожидает'}
              {requestStatus === 'processing' && 'В обработке'}
              {requestStatus === 'completed' && 'Выполнен'}
            </span>
          </div>
        )}
      </div>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="w-full bg-hotel-blue hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-200"
          >
            <Bell className="h-4 w-4 mr-2" />
            Запросить услугу
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Запрос услуги</SheetTitle>
          </SheetHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(['cleaning', 'maintenance', 'foodService', 'other'] as ServiceRequestType[]).map(type => (
                <Button
                  key={type}
                  variant={activeService === type ? "default" : "outline"}
                  className={`flex flex-col h-24 p-2 ${activeService === type ? 'border-2 border-hotel-blue' : ''}`}
                  onClick={() => handleServiceSelect(type)}
                >
                  <div className="text-2xl mb-1">{getServiceIcon(type)}</div>
                  <div className="text-xs">{getServiceName(type)}</div>
                </Button>
              ))}
            </div>
            
            {activeService && (
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дополнительная информация</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Опишите запрос подробнее..."
                            className="resize-none h-24"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-hotel-blue hover:bg-blue-600"
                    disabled={!activeService}
                  >
                    Отправить запрос
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      {requestStatus && activeService && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-xl">{getServiceIcon(activeService)}</div>
            <div>
              <div className="font-medium text-sm">{getServiceName(activeService)}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                {getStatusIcon()}
                {requestStatus === 'pending' && 'Ожидает обработки'}
                {requestStatus === 'processing' && 'Принято в работу'}
                {requestStatus === 'completed' && 'Выполнено'}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ServiceRequest;
