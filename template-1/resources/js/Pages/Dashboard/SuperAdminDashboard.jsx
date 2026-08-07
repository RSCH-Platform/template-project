import React from 'react';
import Card from '@/Components/Dashboard/Card';
import Widget from '@/Components/Dashboard/Widget';
import { usePage } from '@inertiajs/react';
import { IconShieldCheck, IconUsers, IconUserShield, IconActivity } from '@tabler/icons-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SuperAdminDashboard() {
    const { chart_labels, chart_data, super_admin_data } = usePage().props;

    const data = {
        labels: chart_labels || [],
        datasets: [
            {
                label: 'Jumlah Pengguna',
                data: chart_data || [],
                backgroundColor: 'rgba(139, 92, 246, 0.6)', // Violet/purple theme for Super Admin
                borderColor: 'rgb(139, 92, 246)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Distribusi Peran Pengguna',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Super Admin</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ringkasan sistem, pengguna, dan keamanan.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Widget
                    title={'Total Pengguna'}
                    subtitle={'Akun terdaftar'}
                    color={'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'}
                    icon={<IconUsers size={'24'} strokeWidth={'1.5'} />}
                    total={super_admin_data?.total_users || 0}
                />
                <Widget
                    title={'Total Roles'}
                    subtitle={'Hak akses sistem'}
                    color={'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}
                    icon={<IconUserShield size={'24'} strokeWidth={'1.5'} />}
                    total={super_admin_data?.total_roles || 0}
                />
                <Widget
                    title={'Total Units'}
                    subtitle={'Departemen / Ruangan'}
                    color={'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}
                    icon={<IconActivity size={'24'} strokeWidth={'1.5'} />}
                    total={super_admin_data?.total_units || 0}
                />
                <Widget
                    title={'Keamanan'}
                    subtitle={'Manajemen Sistem'}
                    color={'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}
                    icon={<IconShieldCheck size={'24'} strokeWidth={'1.5'} />}
                    total={'Aman'}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Distribusi Peran Pengguna">
                        <div className="p-4 bg-white dark:bg-slate-900">
                            <Bar options={options} data={data} />
                        </div>
                    </Card>
                </div>
                <div>
                    <Card title="Pengguna Terbaru">
                        <div className="p-4 bg-white dark:bg-slate-900">
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {super_admin_data?.recent_users?.map((user) => (
                                    <li key={user.id} className="py-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                        </div>
                                    </li>
                                ))}
                                {(!super_admin_data?.recent_users || super_admin_data.recent_users.length === 0) && (
                                    <li className="py-3 text-sm text-center text-slate-500">Belum ada pengguna</li>
                                )}
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>
            
            <Card title="Pemberitahuan Sistem">
                <div className="p-10 flex flex-col items-center justify-center text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">
                            <IconShieldCheck size={48} strokeWidth={1.5} />
                        </div>
                        <p className="font-medium text-slate-500 dark:text-slate-400 mt-1">Semua sistem berjalan normal (DB ✓, Queue ✓, Storage ✓). Tidak ada tugas tertunda.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
