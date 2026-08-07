import React, { useState, useEffect } from 'react';
import Card from '@/Components/Dashboard/Card';
import InfoCard from '@/Components/Dashboard/InfoCard';
import { usePage } from '@inertiajs/react';
import { IconCalendarEvent, IconClock, IconMapPin, IconBell, IconChecklist } from '@tabler/icons-react';

export default function PerawatDashboard() {
    const { auth } = usePage().props;
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const formatTime = (date) => {
        return new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        }).format(date);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold">Selamat Datang, {auth?.user?.name}!</h1>
                    <p className="text-emerald-100 mt-1">{formatDate(currentTime)} • {formatTime(currentTime)}</p>
                </div>
                <IconChecklist className="absolute -right-4 -bottom-4 text-emerald-700/30 w-40 h-40" strokeWidth={1} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Jadwal Hari Ini" icon={<IconCalendarEvent size={20} />}>
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 border-4 border-emerald-50 dark:border-slate-800">
                            <span className="text-2xl font-bold">Pagi</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">07:00 - 14:00</h3>
                        
                        <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <IconMapPin size={16} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gedung Utama - Lt. 2</span>
                        </div>
                        
                        <button className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm w-full max-w-xs">
                            Mulai Shift
                        </button>
                    </div>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card title="Pengingat & Tugas" icon={<IconBell size={20} />}>
                        <div className="space-y-3">
                            <div className="flex gap-3 p-3 rounded-xl border border-rose-100 bg-rose-50 dark:border-rose-900/30 dark:bg-rose-950/20">
                                <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div></div>
                                <div>
                                    <p className="text-sm font-medium text-rose-800 dark:text-rose-300">Laporan Shift Kemarin Belum Diisi</p>
                                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Harap segera lengkapi laporan operan pasien.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                                <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Pelatihan Bantuan Hidup Dasar</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sabtu, 14:00 di Ruang Aula.</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Kalender Minggu Ini">
                        <div className="flex justify-between items-center text-center px-2 py-4">
                            {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, i) => (
                                <div key={i} className={`flex flex-col items-center gap-2 ${i === 5 ? 'opacity-100' : 'opacity-60'}`}>
                                    <span className="text-xs font-semibold text-slate-500">{day}</span>
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${i === 5 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                                        {i + 3}
                                    </div>
                                    <div className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
