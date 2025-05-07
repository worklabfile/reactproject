
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hotel, Mail, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }
    
    // Demo login - in a real app, this would call an API
    if (email === 'admin@hotel.com' && password === 'admin') {
      toast({
        title: "Вход выполнен",
        description: "Добро пожаловать в панель управления",
      });
      navigate('/staff/dashboard');
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль",
        variant: "destructive",
      });
    }
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-hotel-blue text-white p-3 rounded-xl">
            <Shield className="h-8 w-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          GlowRoom Admin
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Панель управления отелем
        </p>
        
        <Card className="shadow-lg border-none animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Вход для персонала</CardTitle>
            <CardDescription>
              Введите ваши данные для входа в систему управления
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center border rounded-md bg-white overflow-hidden">
                  <div className="px-3 py-2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input 
                    type="email" 
                    placeholder="Электронная почта" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center border rounded-md bg-white overflow-hidden">
                  <div className="px-3 py-2 text-gray-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <Input 
                    type="password" 
                    placeholder="Пароль" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-hotel-blue hover:bg-blue-600">
                Войти
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full text-gray-600 hover:text-hotel-blue"
              onClick={handleGuestLogin}
            >
              <Hotel className="mr-2 h-4 w-4" />
              Вход для гостей
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} GlowRoom Hotel. Все права защищены.
        </p>
      </div>
    </div>
  );
};

export default StaffLogin;
