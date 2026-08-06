import React, { useState } from 'react';
import AppLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IconBuilding, IconTrash, IconEdit, IconUsers, IconX } from '@tabler/icons-react';
import PageContainer from '@/Components/Dashboard/PageContainer';
import Pagination from '@/Components/Dashboard/Pagination';
import Modal from '@/Components/Dashboard/Modal';
import SearchableSelect from '@/Components/Dashboard/SearchableSelect';
import toast from 'react-hot-toast';
import Button from '@/Components/Dashboard/Button';

export default function Index({ units, all_users }) {
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [showUsersModal, setShowUsersModal] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        user_ids: [],
    });

    const openUsersModal = (unit) => {
        setSelectedUnit(unit);
        setData('user_ids', unit.users ? unit.users.map(u => u.id) : []);
        setShowUsersModal(true);
    };

    const submitUsers = (e) => {
        e.preventDefault();
        post(route('units.users.sync', selectedUnit.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowUsersModal(false);
                toast.success('Pengguna departemen berhasil diperbarui');
            },
        });
    };

    return (
        <PageContainer
            title="Departemen"
            description={`${units?.total || units?.data?.length || 0} departemen terdaftar`}
            icon={<IconBuilding size={28} className="text-primary-500" />}
            actionLabel="Tambah Departemen"
            // actionUrl={route("units.create")} // uncomment if you create the create route
            canCreate={false} // set to true once create is implemented
        >
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase dark:border-slate-800 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-4 py-3">Kode</th>
                                <th className="px-4 py-3">Nama Departemen</th>
                                <th className="px-4 py-3 text-center">Jml Pengguna</th>
                                <th className="px-4 py-3">24 Jam</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {units?.data && units.data.length > 0 ? (
                                units.data.map((unit) => (
                                    <tr key={unit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{unit.unit_id}</td>
                                        <td className="px-4 py-3">{unit.unit_name}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-info-50 text-info-700 dark:bg-info-900/30 dark:text-info-400 text-xs font-semibold">
                                                <IconUsers size={14} />
                                                {unit.users_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {unit.is_24h ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400 text-xs font-medium">Ya</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-medium">Tidak</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openUsersModal(unit)}
                                                    className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"
                                                    title="Kelola Pengguna"
                                                >
                                                    <IconUsers size={18} />
                                                </button>
                                                <button className="p-2 text-warning-500 hover:bg-warning-50 dark:hover:bg-warning-500/10 rounded-lg transition-colors">
                                                    <IconEdit size={18} />
                                                </button>
                                                <button 
                                                    className="p-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg transition-colors"
                                                    onClick={() => {
                                                        if(confirm('Hapus departemen ini?')) router.delete(route('units.destroy', unit.id));
                                                    }}
                                                >
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                                <IconBuilding size={32} className="text-slate-400" strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                                                Belum Ada Departemen
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Departemen tidak ditemukan.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {units?.last_page !== 1 && <Pagination links={units?.links} />}

            <Modal 
                show={showUsersModal} 
                onClose={() => setShowUsersModal(false)}
                title={selectedUnit ? `Kelola Pengguna - ${selectedUnit.unit_name}` : 'Kelola Pengguna'}
                type="slide-over"
            >
                <form onSubmit={submitUsers} className="flex h-full flex-col">
                    <div className="flex-1 space-y-6">
                        <div>
                            <SearchableSelect
                                options={all_users || []}
                                selected={data.user_ids}
                                onChange={(val) => setData('user_ids', val)}
                                multiple={true}
                                placeholder="Cari dan pilih pengguna..."
                                label="Daftar Pengguna Departemen"
                            />
                        </div>
                        
                        {selectedUnit?.users && selectedUnit.users.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pengguna Terdaftar Saat Ini:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUnit.users.map(u => (
                                        <div key={u.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                                            <div className="w-6 h-6 rounded-full bg-primary-200 dark:bg-primary-900 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300 overflow-hidden">
                                                {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{u.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-shrink-0 justify-end gap-3 border-t dark:border-slate-800 pt-4 mt-6">
                        <Button 
                            type="button" 
                            onClick={() => setShowUsersModal(false)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit" 
                            processing={processing}
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
}

Index.layout = (page) => <AppLayout children={page} />;
