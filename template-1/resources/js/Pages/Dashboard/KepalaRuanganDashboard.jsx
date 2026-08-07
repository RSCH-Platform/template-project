import React from 'react';
import Card from '@/Components/Dashboard/Card';
import StatCard from '@/Components/Dashboard/StatCard';
import ListCard from '@/Components/Dashboard/ListCard';
import { usePage } from '@inertiajs/react';
import { IconUsers, IconClock, IconCheck, IconBuildingHospital } from '@tabler/icons-react';

export default function KepalaRuanganDashboard() {
    const { kepala_data, auth } = usePage().props;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Kepala Ruangan</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Halo, {auth?.user?.name}. Ringkasan departemen Anda: {kepala_data?.unit_names?.join(', ') || 'Belum ada unit'}.
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <StatCard 
                    title="Total Anggota"
                    value={kepala_data?.total_members || 0}
                    subtitle="Di semua unit Anda"
                    icon={IconUsers}
                    gradient="from-blue-500 to-indigo-600"
                />
                <StatCard 
                    title="Shift Aktif Hari Ini"
                    value={kepala_data?.active_shifts || 0}
                    subtitle="Menunggu validasi"
                    icon={IconClock}
                    gradient="from-indigo-500 to-purple-600"
                />
                <StatCard 
                    title="Kehadiran Hari Ini"
                    value={`${kepala_data?.present_today || 0}/${kepala_data?.total_members || 0}`}
                    subtitle="Berdasarkan jadwal"
                    icon={IconCheck}
                    gradient="from-emerald-500 to-teal-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ListCard title="Jadwal Shift Hari Ini" icon={IconClock} emptyMessage="Tidak ada shift terjadwal">
                    <div className="space-y-4">
                        {/* Mock data shift */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div>
                                <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-md">Pagi</span>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-2">Budi Santoso, Siti Aminah</p>
                            </div>
                            <span className="text-xs text-slate-500">07:00 - 14:00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div>
                                <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">Siang</span>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-2">Agus Pratama</p>
                            </div>
                            <span className="text-xs text-slate-500">14:00 - 21:00</span>
                        </div>
                    </div>
                </ListCard>

                <ListCard title="Status Anggota" icon={IconUsers} emptyMessage="Tidak ada data anggota">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">BS</div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Budi Santoso</span>
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Hadir</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">SA</div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Siti Aminah</span>
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Hadir</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">DR</div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dina Rahmawati</span>
                            </div>
                            <span className="text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded">Off / Libur</span>
                        </div>
                    </div>
                </ListCard>
            </div>
        </div>
    );
}
