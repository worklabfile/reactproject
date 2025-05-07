
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, LogOut, MessageSquare, Calendar, Droplets, Waves, MapPin } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

// Mock booking data
const mockBookings = [
  { id: 'B12345', guest: 'Алексей Смирнов', room: '507', hotel: 'Аква-Минск', checkIn: '2025-05-07', checkOut: '2025-05-10', status: 'checked-in' },
  { id: 'B12346', guest: 'Мария Иванова', room: '302', hotel: 'Аква-Минск плюс', checkIn: '2025-05-06', checkOut: '2025-05-09', status: 'confirmed' },
  { id: 'B12347', guest: 'Дмитрий Петров', room: '415', hotel: 'Аква-Минск', checkIn: '2025-05-08', checkOut: '2025-05-12', status: 'confirmed' },
  { id: 'B12348', guest: 'Елена Козлова', room: '201', hotel: 'На том берегу', checkIn: '2025-05-05', checkOut: '2025-05-07', status: 'checked-out' },
  { id: 'B12349', guest: 'Игорь Васильев', room: '103', hotel: 'На том берегу', checkIn: '2025-05-09', checkOut: '2025-05-15', status: 'confirmed' },
];

// Mock service requests
const mockRequests = [
  { id: 'R001', room: '507', hotel: 'Аква-Минск', type: 'Уборка', status: 'pending', time: '09:30' },
  { id: 'R002', room: '302', hotel: 'Аква-Минск плюс', type: 'Доп. полотенца', status: 'completed', time: '08:15' },
  { id: 'R003', room: '415', hotel: 'Аква-Минск', type: 'Техническая проблема', status: 'in-progress', time: '10:45' },
  { id: 'R004', room: '201', hotel: 'На том берегу', type: 'Заказ еды', status: 'pending', time: '12:20' },
  { id: 'R005', room: '103', hotel: 'На том берегу', type: 'Аренда велосипеда', status: 'pending', time: '14:00' },
];

// Hotel services
const hotelServices = [
  { name: "Бесплатный Wi-Fi", icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg> },
  { name: "Мгновенное бронирование", icon: <Calendar className="h-5 w-5" /> },
  { name: "Аквапарк без очереди", icon: <Waves className="h-5 w-5" /> },
  { name: "Развлечения рядом", icon: <MapPin className="h-5 w-5" /> },
  { name: "Парковка на территории", icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { name: "Вкусные завтраки", icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> },
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeHotel, setActiveHotel] = useState<'all' | 'akva' | 'akva-plus' | 'na-tom-beregu'>('all');
  
  const handleLogout = () => {
    navigate('/staff');
  };
  
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'confirmed': 'bg-blue-100 text-blue-800',
      'checked-in': 'bg-green-100 text-green-800',
      'checked-out': 'bg-gray-100 text-gray-800',
      'pending': 'bg-amber-100 text-amber-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
    };
    
    return (
      <span className={`text-xs px-2.5 py-0.5 rounded-full ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status === 'checked-in' ? 'Проживает' : 
         status === 'checked-out' ? 'Выехал' : 
         status === 'confirmed' ? 'Подтверждено' :
         status === 'pending' ? 'Ожидает' :
         status === 'in-progress' ? 'В процессе' :
         status === 'completed' ? 'Выполнено' : status}
      </span>
    );
  };
  
  // Filter bookings and requests based on selected hotel
  const filteredBookings = activeHotel === 'all' 
    ? mockBookings 
    : mockBookings.filter(booking => {
        if (activeHotel === 'akva') return booking.hotel === 'Аква-Минск';
        if (activeHotel === 'akva-plus') return booking.hotel === 'Аква-Минск плюс';
        if (activeHotel === 'na-tom-beregu') return booking.hotel === 'На том берегу';
        return true;
      });
      
  const filteredRequests = activeHotel === 'all' 
    ? mockRequests 
    : mockRequests.filter(request => {
        if (activeHotel === 'akva') return request.hotel === 'Аква-Минск';
        if (activeHotel === 'akva-plus') return request.hotel === 'Аква-Минск плюс';
        if (activeHotel === 'na-tom-beregu') return request.hotel === 'На том берегу';
        return true;
      });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-hotel-blue text-white p-2 rounded-lg mr-3">
                <Droplets className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">АКВА-МИНСК</h1>
                <p className="text-sm text-gray-500">Панель управления отелем</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Выход</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hotel selector */}
        <div className="mb-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={activeHotel === 'all' ? 'bg-hotel-blue text-white' : ''} onClick={() => setActiveHotel('all')}>Все отели</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={activeHotel === 'akva' ? 'bg-hotel-blue text-white' : ''} onClick={() => setActiveHotel('akva')}>Аква-Минск</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={activeHotel === 'akva-plus' ? 'bg-hotel-blue text-white' : ''} onClick={() => setActiveHotel('akva-plus')}>Аква-Минск плюс</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={activeHotel === 'na-tom-beregu' ? 'bg-green-700 text-white' : ''} onClick={() => setActiveHotel('na-tom-beregu')}>На том берегу</NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Бронирования
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Запросы гостей
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              Услуги отелей
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="animate-fade-in">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Бронирования {activeHotel !== 'all' && (
                  <>
                    — {activeHotel === 'akva' ? 'Аква-Минск' : 
                       activeHotel === 'akva-plus' ? 'Аква-Минск плюс' : 
                       'Парк-отель «На том берегу»'}
                  </>
                )}</CardTitle>
                <CardDescription>Управление бронированиями и регистрацией гостей</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">№</th>
                        <th className="px-4 py-3">Гость</th>
                        <th className="px-4 py-3">Номер</th>
                        <th className="px-4 py-3">Отель</th>
                        <th className="px-4 py-3">Заезд</th>
                        <th className="px-4 py-3">Выезд</th>
                        <th className="px-4 py-3">Статус</th>
                        <th className="px-4 py-3 rounded-tr-lg">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{booking.id}</td>
                          <td className="px-4 py-3">{booking.guest}</td>
                          <td className="px-4 py-3">{booking.room}</td>
                          <td className="px-4 py-3">{booking.hotel}</td>
                          <td className="px-4 py-3">{booking.checkIn}</td>
                          <td className="px-4 py-3">{booking.checkOut}</td>
                          <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                          <td className="px-4 py-3">
                            <Button variant="outline" size="sm">Подробнее</Button>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                            Нет бронирований для отображения
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests" className="animate-fade-in">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Запросы гостей {activeHotel !== 'all' && (
                  <>
                    — {activeHotel === 'akva' ? 'Аква-Минск' : 
                       activeHotel === 'akva-plus' ? 'Аква-Минск плюс' : 
                       'Парк-отель «На том берегу»'}
                  </>
                )}</CardTitle>
                <CardDescription>Управление запросами от гостей отеля</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">№</th>
                        <th className="px-4 py-3">Номер</th>
                        <th className="px-4 py-3">Отель</th>
                        <th className="px-4 py-3">Тип запроса</th>
                        <th className="px-4 py-3">Время</th>
                        <th className="px-4 py-3">Статус</th>
                        <th className="px-4 py-3 rounded-tr-lg">Выполнено</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{request.id}</td>
                          <td className="px-4 py-3">{request.room}</td>
                          <td className="px-4 py-3">{request.hotel}</td>
                          <td className="px-4 py-3">{request.type}</td>
                          <td className="px-4 py-3">{request.time}</td>
                          <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                          <td className="px-4 py-3">
                            <Checkbox id={`complete-${request.id}`} checked={request.status === 'completed'} />
                          </td>
                        </tr>
                      ))}
                      {filteredRequests.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                            Нет запросов для отображения
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Services */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Услуги отелей</CardTitle>
                  <CardDescription>Стандартные услуги группы отелей «АКВА-МИНСК»</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {hotelServices.map((service, index) => (
                      <li key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
                        <div className="flex-shrink-0 text-hotel-blue">
                          {service.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Aqua-Minsk specific */}
              <Card>
                <CardHeader className="pb-2 bg-hotel-blue/10">
                  <CardTitle className="text-hotel-blue">Аква-Минск</CardTitle>
                  <CardDescription>Доп. услуги гостиницы «Аква-Минск»</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
                      <div className="flex-shrink-0 text-hotel-blue">
                        <Waves className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Аквапарк в здании отеля</h4>
                        <p className="text-sm text-gray-500">Приоритетный доступ для гостей</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
                      <div className="flex-shrink-0 text-hotel-blue">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Спа-центр</h4>
                        <p className="text-sm text-gray-500">Различные виды массажа и процедур</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Na Tom Beregu specific */}
              <Card>
                <CardHeader className="pb-2 bg-green-700/10">
                  <CardTitle className="text-green-700">На том берегу</CardTitle>
                  <CardDescription>Доп. услуги парк-отеля «На том берегу»</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
                      <div className="flex-shrink-0 text-green-700">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Аренда беседок</h4>
                        <p className="text-sm text-gray-500">Комфортный отдых на природе</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
                      <div className="flex-shrink-0 text-green-700">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Аренда бани-бочки</h4>
                        <p className="text-sm text-gray-500">Традиционная баня на берегу</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
                      <div className="flex-shrink-0 text-green-700">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Прокат спортинвентаря</h4>
                        <p className="text-sm text-gray-500">Велосипеды, сапборды, катамараны</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Группа гостиниц «АКВА-МИНСК». Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StaffDashboard;
