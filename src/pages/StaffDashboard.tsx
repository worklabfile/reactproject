
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, LogOut, MessageSquare, Calendar } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

// Mock booking data
const mockBookings = [
  { id: 'B12345', guest: 'Алексей Смирнов', room: '507', checkIn: '2025-05-07', checkOut: '2025-05-10', status: 'checked-in' },
  { id: 'B12346', guest: 'Мария Иванова', room: '302', checkIn: '2025-05-06', checkOut: '2025-05-09', status: 'confirmed' },
  { id: 'B12347', guest: 'Дмитрий Петров', room: '415', checkIn: '2025-05-08', checkOut: '2025-05-12', status: 'confirmed' },
  { id: 'B12348', guest: 'Елена Козлова', room: '201', checkIn: '2025-05-05', checkOut: '2025-05-07', status: 'checked-out' },
];

// Mock service requests
const mockRequests = [
  { id: 'R001', room: '507', type: 'Уборка', status: 'pending', time: '09:30' },
  { id: 'R002', room: '302', type: 'Доп. полотенца', status: 'completed', time: '08:15' },
  { id: 'R003', room: '415', type: 'Техническая проблема', status: 'in-progress', time: '10:45' },
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'requests'>('bookings');
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-hotel-blue text-white p-2 rounded-lg mr-3">
                <Hotel className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">GlowRoom Admin</h1>
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
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 flex items-center gap-2 font-medium text-sm ${
              activeTab === 'bookings'
                ? 'border-b-2 border-hotel-blue text-hotel-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Бронирования
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 flex items-center gap-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-b-2 border-hotel-blue text-hotel-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Запросы гостей
          </button>
        </div>
        
        {activeTab === 'bookings' ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Бронирования</CardTitle>
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
                        <th className="px-4 py-3">Заезд</th>
                        <th className="px-4 py-3">Выезд</th>
                        <th className="px-4 py-3">Статус</th>
                        <th className="px-4 py-3 rounded-tr-lg">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBookings.map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{booking.id}</td>
                          <td className="px-4 py-3">{booking.guest}</td>
                          <td className="px-4 py-3">{booking.room}</td>
                          <td className="px-4 py-3">{booking.checkIn}</td>
                          <td className="px-4 py-3">{booking.checkOut}</td>
                          <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                          <td className="px-4 py-3">
                            <Button variant="outline" size="sm">Подробнее</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Запросы гостей</CardTitle>
                <CardDescription>Управление запросами от гостей отеля</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">№</th>
                        <th className="px-4 py-3">Номер</th>
                        <th className="px-4 py-3">Тип запроса</th>
                        <th className="px-4 py-3">Время</th>
                        <th className="px-4 py-3">Статус</th>
                        <th className="px-4 py-3 rounded-tr-lg">Выполнено</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRequests.map((request) => (
                        <tr key={request.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{request.id}</td>
                          <td className="px-4 py-3">{request.room}</td>
                          <td className="px-4 py-3">{request.type}</td>
                          <td className="px-4 py-3">{request.time}</td>
                          <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                          <td className="px-4 py-3">
                            <Checkbox id={`complete-${request.id}`} checked={request.status === 'completed'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
