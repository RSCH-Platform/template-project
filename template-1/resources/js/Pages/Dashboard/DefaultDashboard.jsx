import React from 'react';
import Card from '@/Components/Dashboard/Card';
import { usePage } from '@inertiajs/react';
import { IconDashboard } from '@tabler/icons-react';

export default function DefaultDashboard() {
    const { auth } = usePage().props;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Analitik</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Selamat datang, {auth?.user?.name}.</p>
            </div>

            <Card title="Pemberitahuan Sistem" icon={<IconDashboard size={20} />}>
                <div className="p-10 flex flex-col items-center justify-center text-center">
                    <p className="font-medium text-slate-500 dark:text-slate-400">Tidak ada data spesifik untuk peran Anda saat ini.</p>
                </div>
            </Card>
        </div>
    );
}
