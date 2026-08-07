import React, { useState } from 'react';
import AppLayout from '@/Layouts/DashboardLayout';
import Swal from 'sweetalert2';
import { useAuthorization } from '@/Utils/authorization';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IconBuilding, IconTrash, IconEdit, IconUsers, IconX } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import {
    Table, Checkbox, Search, PageContainer, Pagination, 
    SearchableSelect, Button, PerPage, AssignRelationModal 
} from '@/Components/Dashboard';

export default function Index({ units, all_users }) {

    const { can } = useAuthorization();
    const canCreateUnits = can("units-create-all");
    const canUpdateUnits = can("units-update-all") || can("units-update-owned");
    const canDeleteUnits = can("units-delete-all") || can("units-delete-owned");

    const {
        data: bulkData,
        setData: setBulkData,
        delete: destroy,
    } = useForm({
        selectedUnit: [],
    });

    const setSelectedItem = (e) => {
        let items = bulkData.selectedUnit;
        if (items.some((id) => id === e.target.value))
            items = items.filter((id) => id !== e.target.value);
        else items.push(e.target.value);
        setBulkData("selectedUnit", items);
    };

    const deleteData = async (id) => {
        Swal.fire({
            title: "Hapus Departemen?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("units.destroy", id));
                Swal.fire({
                    title: "Berhasil!",
                    text: "Data berhasil dihapus!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setBulkData("selectedUnit", []);
            }
        });
    };

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
            actionUrl={route("units.create")}
            canCreate={canCreateUnits}
            actions={
                canDeleteUnits && bulkData.selectedUnit.length > 0 && (
                    <Button
                        type={"bulk"}
                        icon={<IconTrash size={18} />}
                        className={"bg-danger-500 hover:bg-danger-600 text-white"}
                        label={`Hapus ${bulkData.selectedUnit.length}`}
                        onClick={() => deleteData(bulkData.selectedUnit)}
                    />
                )
            }
        >
            
            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("units.index")}
                        placeholder="Cari departemen..."
                    />
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                    <PerPage url={route("units.index")} />
                </div>
            </div>

            <Table.Card title="Daftar Departemen" icon={<IconBuilding size={20} />}>
                <Table>
                    <Table.Thead>
                        <tr>
                            <Table.Th className={"w-10"}>
                                {canDeleteUnits && units?.data?.length > 0 && (
                                    <Checkbox
                                        value="all"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setBulkData("selectedUnit", units.data.map(u => u.id.toString()));
                                            } else {
                                                setBulkData("selectedUnit", []);
                                            }
                                        }}
                                        checked={bulkData.selectedUnit.length === units.data.length && units.data.length > 0}
                                    />
                                )}
                            </Table.Th>
                            <Table.Th className={"w-10"}>No</Table.Th>
                            <Table.Th>Nama Departemen</Table.Th>
                            <Table.Th className="text-center">Jml Pengguna</Table.Th>
                            
                            <Table.Th></Table.Th>
                        </tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {units?.data && units.data.length > 0 ? (
                            units.data.map((unit, i) => (
                                <tr key={unit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <Table.Td>
                                        {canDeleteUnits && (
                                            <Checkbox
                                                value={unit.id}
                                                onChange={setSelectedItem}
                                                checked={bulkData.selectedUnit.includes(unit.id.toString())}
                                            />
                                        )}
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        {++i + (units.current_page - 1) * units.per_page}
                                    </Table.Td>
                                    <Table.Td>{unit.unit_name}</Table.Td>
                                    <Table.Td className="text-center">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-info-50 text-info-700 dark:bg-info-900/30 dark:text-info-400 text-xs font-semibold">
                                            <IconUsers size={14} />
                                            {unit.users_count || 0}
                                        </span>
                                    </Table.Td>
                                    
                                    <Table.Td>
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                type="modal"
                                                onClick={(e) => { e.preventDefault(); openUsersModal(unit); }}
                                                className="border bg-primary-100 border-primary-200 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/50 dark:border-primary-800 dark:text-primary-400"
                                                icon={<IconUsers size={16} strokeWidth={1.5} />}
                                            />
                                            {canUpdateUnits && (
                                                <Button 
                                                    type="edit"
                                                    href={route("units.edit", unit.id)}
                                                    className="border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                    icon={<IconEdit size={16} strokeWidth={1.5} />}
                                                />
                                            )}
                                            {canDeleteUnits && (
                                                <Button 
                                                    type="button"
                                                    onClick={() => deleteData(unit.id)}
                                                    className="border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                    icon={<IconTrash size={16} strokeWidth={1.5} />}
                                                />
                                            )}
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))
                        ) : (
                            <Table.Empty colSpan={5} message="Departemen tidak ditemukan." />
                        )}
                    </Table.Tbody>
                </Table>
            </Table.Card>

            
            {units?.last_page !== 1 && <Pagination links={units?.links} />}

            <AssignRelationModal
                show={showUsersModal}
                onClose={() => setShowUsersModal(false)}
                title={selectedUnit ? `Kelola Pengguna - ${selectedUnit.unit_name}` : 'Kelola Pengguna'}
                onSubmit={submitUsers}
                processing={processing}
                options={all_users || []}
                selectedValues={data.user_ids}
                onChangeValues={(val) => setData('user_ids', val)}
                selectLabel="Daftar Pengguna Departemen"
                selectPlaceholder="Cari dan pilih pengguna..."
                currentItems={selectedUnit?.users || []}
                currentItemsLabel="Pengguna Terdaftar Saat Ini:"
                renderCurrentItem={(u) => (
                    <div key={u.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                        <div className="w-6 h-6 rounded-full bg-primary-200 dark:bg-primary-900 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300 overflow-hidden">
                            {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{u.name}</span>
                    </div>
                )}
            />
        </PageContainer>
    );
}

Index.layout = (page) => <AppLayout children={page} />;
