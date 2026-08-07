import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useAuthorization } from '@/Utils/authorization';
import SuperAdminDashboard from './Dashboard/SuperAdminDashboard';
import KepalaRuanganDashboard from './Dashboard/KepalaRuanganDashboard';
import PerawatDashboard from './Dashboard/PerawatDashboard';
import DefaultDashboard from './Dashboard/DefaultDashboard';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    const { canAny } = useAuthorization();

    return (
        <>
            <Head title='Dashboard' />
            {canAny(['users-access', 'roles-access']) ? (
                <SuperAdminDashboard />
            ) : canAny(['units-access-owned']) ? (
                <KepalaRuanganDashboard />
            ) : canAny(['dashboard-access']) ? (
                <PerawatDashboard />
            ) : (
                <DefaultDashboard />
            )}
        </>
    );
}

Dashboard.layout = page => <DashboardLayout children={page} />;

