
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hotel, Key, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-hotel-blue text-white p-3 rounded-xl">
            <Hotel className="h-8 w-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          GlowRoom
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Умное управление номером отеля
        </p>
        
        {step === 'booking' ? (
          <Card className="shadow-lg border-none animate-fade-in">
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
                <Button type="submit" className="w-full bg-hotel-blue hover:bg-blue-600">
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
          <Card className="shadow-lg border-none animate-fade-in">
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
                className="w-full bg-hotel-blue hover:bg-blue-600"
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
        
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} GlowRoom Hotel. Все права защищены.
        </p>
      </div>
    </div>
  );
};

export default Login;
