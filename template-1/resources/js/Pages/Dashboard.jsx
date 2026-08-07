import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useAuthorization } from '@/Utils/authorization';
import SuperAdminDashboard from './Dashboard/SuperAdminDashboard';
import KepalaRuanganDashboard from './Dashboard/KepalaRuanganDashboard';
import PerawatDashboard from './Dashboard/PerawatDashboard';
import DefaultDashboard from './Dashboard/DefaultDashboard';
import { Head, Deferred } from '@inertiajs/react';

export default function Dashboard() {
    const { canAny } = useAuthorization();

    return (
        <>
            <Head title='Dashboard' />
            <Deferred data={['chart_labels', 'chart_data', 'super_admin_data', 'kepala_data']} fallback={<div className="p-6 text-center text-slate-500">Memuat dashboard...</div>}>
                {canAny(['users-access', 'roles-access']) ? (
                    <SuperAdminDashboard />
                ) : canAny(['units-access-owned']) ? (
                    <KepalaRuanganDashboard />
                ) : canAny(['dashboard-access']) ? (
                    <PerawatDashboard />
                ) : (
                    <DefaultDashboard />
                )}
            </Deferred>
        </>
    );
}

Dashboard.layout = page => <DashboardLayout children={page} />;

