import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { IconApps, IconChevronRight, IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import axios from 'axios';

export default function AppSwitcher({ auth }) {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    // Only render if SSO is enabled
    if (!auth?.sso_enabled) return null;

    const fetchApps = async () => {
        if (hasFetched) return;
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get('/iam/user-applications');
            setApps(data);
        } catch (e) {
            setError('Gagal memuat aplikasi');
        } finally {
            setLoading(false);
            setHasFetched(true);
        }
    };

    return (
        <Menu as="div" className="relative z-10">
            {({ open }) => (
                <>
                    <Menu.Button
                        onClick={fetchApps}
                        className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                        title="Aplikasi"
                    >
                        <IconApps size={20} strokeWidth={1.5} />
                    </Menu.Button>

                    <Transition
                        show={open}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border bg-white shadow-lg dark:bg-slate-900 dark:border-slate-800 focus:outline-none overflow-hidden z-[100]">
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    Applications
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {apps?.length || 0} tersedia
                                </p>
                            </div>

                            <div className="max-h-80 overflow-y-auto dashboard-scrollbar p-1">
                                {/* Loading */}
                                {loading && (
                                    <div className="p-4 flex flex-col items-center justify-center text-slate-500 gap-2">
                                        <IconLoader2 size={24} className="animate-spin" />
                                        <span className="text-xs">Memuat aplikasi...</span>
                                    </div>
                                )}

                                {/* Error */}
                                {error && (
                                    <div className="p-4 flex flex-col items-center justify-center text-danger-500 gap-2">
                                        <IconAlertCircle size={24} />
                                        <span className="text-xs">{error}</span>
                                    </div>
                                )}

                                {/* Empty State */}
                                {!loading && !error && apps.length === 0 && (
                                    <div className="p-6 text-center text-sm text-slate-500">
                                        Tidak ada aplikasi
                                    </div>
                                )}

                                {/* List Apps */}
                                {!loading && !error && apps.map((app, index) => (
                                    <Menu.Item key={index}>
                                        {({ active }) => (
                                            <a
                                                href={app.app_url}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                                                    active ? 'bg-slate-50 dark:bg-slate-800/50' : ''
                                                }`}
                                            >
                                                {/* Icon */}
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                                    {app.logo_url ? (
                                                        <img src={app.logo_url} alt={app.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <IconApps className="w-5 h-5 text-slate-500" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                        {app.name}
                                                    </p>
                                                    {/* Role summary */}
                                                    {app.roles && app.roles.length > 0 && (
                                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                                            {app.roles[0].name}
                                                            {app.roles.length > 1 && ` +${app.roles.length - 1}`}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Status dot */}
                                                {app.status === 'active' && (
                                                    <span className="w-2 h-2 rounded-full bg-success-500"></span>
                                                )}

                                                {/* Arrow */}
                                                <IconChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            </a>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
}
