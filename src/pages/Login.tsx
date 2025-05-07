
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hotel, Key, User, Droplets } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Login = () => {
  const [step, setStep] = useState<'booking' | 'verification'>('booking');
  const [bookingNumber, setBookingNumber] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingNumber.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите номер бронирования",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate SMS sending
    toast({
      title: "Код подтверждения отправлен",
      description: "На ваш номер телефона отправлен SMS с кодом подтверждения",
    });
    
    setStep('verification');
  };

  const handleVerifyOTP = () => {
    if (otpValue === '0000') {
      toast({
        title: "Успешно!",
        description: "Добро пожаловать в отель",
      });
      navigate('/room');
    } else {
      toast({
        title: "Неверный код",
        description: "Пожалуйста, проверьте код и попробуйте снова",
        variant: "destructive",
      });
    }
  };

  const handleStaffLogin = () => {
    navigate('/staff');
  };

  // Hotel info cards for carousel
  const hotelCards = [
    {
      title: "«Аква-Минск»",
      description: "Высокие стандарты обслуживания и атмосфера гостеприимства.",
    },
    {
      title: "«Аква-Минск плюс»",
      description: "Современные комфортабельные номера различных категорий.",
    },
    {
      title: "Парк-отель «На том берегу»",
      description: "Уникальный комплекс на живописном берегу водохранилища «Дрозды».",
    }
  ];

  // Services list
  const services = [
    { icon: "wifi", title: "Бесплатный Wi-Fi" },
    { icon: "calendar", title: "Мгновенное бронирование" },
    { icon: "waves", title: "Аквапарк без очереди" },
    { icon: "map", title: "Развлечения в шаговой доступности" },
    { icon: "car", title: "Парковка на территории отелей" },
    { icon: "utensils", title: "Вкусные завтраки" },
  ];

  return (
    <div className="min-h-screen akva-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-white text-hotel-blue p-3 rounded-xl shadow-lg">
            <Droplets className="h-8 w-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          АКВА-МИНСК
        </h1>
        <p className="text-center text-white/90 mb-8">
          Группа гостиниц с высокими стандартами обслуживания
        </p>
        
        {step === 'booking' ? (
          <Card className="shadow-lg border-none animate-fade-in backdrop-blur-sm bg-white/90">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Вход в номер</CardTitle>
              <CardDescription>
                Введите номер вашего бронирования для доступа
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center border rounded-md bg-white overflow-hidden">
                    <div className="px-3 py-2 text-gray-400">
                      <Key className="h-5 w-5" />
                    </div>
                    <Input 
                      type="text" 
                      placeholder="Номер бронирования" 
                      value={bookingNumber}
                      onChange={(e) => setBookingNumber(e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-hotel-blue hover:bg-hotel-blue/80">
                  Получить код
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full text-gray-600 hover:text-hotel-blue"
                onClick={handleStaffLogin}
              >
                <User className="mr-2 h-4 w-4" />
                Вход для персонала
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-lg border-none animate-fade-in backdrop-blur-sm bg-white/90">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Подтвердите вход</CardTitle>
              <CardDescription>
                Введите код, отправленный на ваш номер телефона
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-4">
                <InputOTP 
                  maxLength={4} 
                  value={otpValue} 
                  onChange={(value) => setOtpValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full bg-hotel-blue hover:bg-hotel-blue/80"
                disabled={otpValue.length < 4}
              >
                Подтвердить
              </Button>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setStep('booking')}
              >
                Назад
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-white text-center">Наши отели</h3>
          <Carousel className="w-full max-w-md">
            <CarouselContent>
              {hotelCards.map((hotel, index) => (
                <CarouselItem key={index}>
                  <Card className="hover:shadow-xl transition-all duration-300 h-full backdrop-blur-sm bg-white/80">
                    <CardHeader>
                      <CardTitle>{hotel.title}</CardTitle>
                      <CardDescription>{hotel.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 pt-2">
              <CarouselPrevious className="static bg-white/50 hover:bg-white hover:text-hotel-blue translate-y-0" />
              <CarouselNext className="static bg-white/50 hover:bg-white hover:text-hotel-blue translate-y-0" />
            </div>
          </Carousel>
        </div>
        
        <div className="flex justify-center gap-2 mt-6">
          <div className="p-1 rounded-full bg-white/90">
            <svg className="h-8 w-8" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34.5 0H3.5C1.57 0 0 1.57 0 3.5V20.5C0 22.43 1.57 24 3.5 24H34.5C36.43 24 38 22.43 38 20.5V3.5C38 1.57 36.43 0 34.5 0Z" fill="#016FD0"/>
              <path d="M19 20.18C23.5 20.18 27.15 16.54 27.15 12.03C27.15 7.52 23.5 3.88 19 3.88C14.49 3.88 10.85 7.52 10.85 12.03C10.85 16.54 14.49 20.18 19 20.18Z" fill="#FFFFFF"/>
              <path d="M19 17.36C21.94 17.36 24.33 14.97 24.33 12.03C24.33 9.09 21.94 6.7 19 6.7C16.06 6.7 13.67 9.09 13.67 12.03C13.67 14.97 16.06 17.36 19 17.36Z" fill="#016FD0"/>
            </svg>
          </div>
          <div className="p-1 rounded-full bg-white/90">
            <svg className="h-8 w-8" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34.5 0H3.5C1.57 0 0 1.57 0 3.5V20.5C0 22.43 1.57 24 3.5 24H34.5C36.43 24 38 22.43 38 20.5V3.5C38 1.57 36.43 0 34.5 0Z" fill="#FF5F00"/>
              <path d="M14.17 4.8H23.83V19.2H14.17V4.8Z" fill="#FFBC00"/>
              <path d="M14.77 12C14.77 9.1 16.2 6.5 18.39 4.8C16.65 3.3 14.41 2.4 12 2.4C5.37 2.4 0 6.7 0 12C0 17.3 5.37 21.6 12 21.6C14.41 21.6 16.65 20.7 18.39 19.2C16.2 17.5 14.77 14.9 14.77 12Z" fill="#EB001B"/>
              <path d="M38 12C38 17.3 32.63 21.6 26 21.6C23.59 21.6 21.35 20.7 19.61 19.2C21.8 17.5 23.23 14.9 23.23 12C23.23 9.1 21.8 6.5 19.61 4.8C21.35 3.3 23.59 2.4 26 2.4C32.63 2.4 38 6.7 38 12Z" fill="#007BB6"/>
            </svg>
          </div>
        </div>
        
        <p className="text-center text-white/80 text-sm mt-6">
          © {new Date().getFullYear()} Группа гостиниц «АКВА-МИНСК». Все права защищены.
        </p>
      </div>
    </div>
  );
};

export default Login;
