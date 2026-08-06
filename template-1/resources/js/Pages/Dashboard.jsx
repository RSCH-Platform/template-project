import Card from '@/Components/Dashboard/Card';
import Widget from '@/Components/Dashboard/Widget';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import { IconUsers, IconUserShield, IconShieldCheck, IconNurse, IconFileDescription } from '@tabler/icons-react';
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

export default function Dashboard() {
    const { total_users, chart_labels, chart_data } = usePage().props;

    const data = {
        labels: chart_labels || [],
        datasets: [
            {
                label: 'Jumlah Pengguna',
                data: chart_data || [],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
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
        <>
            <Head title='Dashboard' />
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Analitik</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ringkasan sistem dan status operasional.</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <Widget
                        title={'Semua Pengguna'}
                        subtitle={'Total Akun'}
                        color={'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}
                        icon={<IconUsers size={'24'} strokeWidth={'1.5'} />}
                        total={total_users}
                    />

                    <Widget
                        title={'Keamanan'}
                        subtitle={'Manajemen Sistem'}
                        color={'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}
                        icon={<IconShieldCheck size={'24'} strokeWidth={'1.5'} />}
                        total={'Aman'}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Distribusi Peran Pengguna">
                        <div className="p-4 bg-white dark:bg-slate-900">
                            <Bar options={options} data={data} />
                        </div>
                    </Card>
                    <Card title="Pemberitahuan Sistem">
                        <div className="p-10 flex flex-col items-center justify-center text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                    <IconShieldCheck size={48} strokeWidth={1.5} />
                                </div>
                                <p className="font-medium text-slate-500 dark:text-slate-400 mt-1">Semua sistem berjalan normal. Tidak ada tugas tertunda.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = page => <DashboardLayout children={page} />
