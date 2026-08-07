import DashboardLayout from "@/Layouts/DashboardLayout";
import React, { useState } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconDatabaseOff,
    IconCirclePlus,
    IconTrash,
    IconPencilCog,
    IconUser,
    IconShield,
    IconMail,
    IconLayoutGrid,
    IconList,
    IconUserShare,
    IconBuildingHospital,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Checkbox from "@/Components/Dashboard/Checkbox";
import Pagination from "@/Components/Dashboard/Pagination";
import PageContainer from "@/Components/Dashboard/PageContainer";
import { useAuthorization } from "@/Utils/authorization";
import Swal from "sweetalert2";

import EmptyState from "@/Components/Dashboard/EmptyState";
import UserCard from "@/Components/Dashboard/UserCard";
import PerPage from "@/Components/Dashboard/PerPage";

export default function Index() {
    const { users, auth, loginType = 'email' } = usePage().props;
    const { can } = useAuthorization();
    const [viewMode, setViewMode] = useState("grid");
    const canCreateUsers = can("users-create");
    const canUpdateUsers = can("users-update");
    const canDeleteUsers = can("users-delete");
    const canImpersonate = can("impersonate");

    const {
        data,
        setData,
        delete: destroy,
        reset,
    } = useForm({
        selectedUser: [],
    });

    const setSelectedUser = (e) => {
        let items = data.selectedUser;
        if (items.some((id) => id === e.target.value))
            items = items.filter((id) => id !== e.target.value);
        else items.push(e.target.value);
        setData("selectedUser", items);
    };

    const deleteData = async (id) => {
        Swal.fire({
            title: "Hapus Pengguna?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("users.destroy", [id]));
                Swal.fire({
                    title: "Berhasil!",
                    text: "Data berhasil dihapus!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setData("selectedUser", []);
            }
        });
    };

    return (
        <PageContainer
            title="Pengguna"
            description={`${users.total || users.data?.length || 0} pengguna terdaftar`}
            canCreate={canCreateUsers}
            actionLabel="Tambah Pengguna"
            actionUrl={route("users.create")}
            actions={
                canDeleteUsers && data.selectedUser.length > 0 && (
                    <Button
                        type={"bulk"}
                        icon={<IconTrash size={18} />}
                        className={"bg-danger-500 hover:bg-danger-600 text-white"}
                        label={`Hapus ${data.selectedUser.length}`}
                        onClick={() => deleteData(data.selectedUser)}
                    />
                )
            }
        >

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("users.index")}
                        placeholder="Cari pengguna..."
                    />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <PerPage url={route("users.index")} />
                    <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "grid"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <IconLayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "list"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <IconList size={20} />
                    </button>
                </div>
            </div>
        </div>

        {/* Content */}
            {users.data.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {users.data.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                isSelected={data.selectedUser.includes(
                                    user.id.toString()
                                )}
                                onSelect={setSelectedUser}
                                onDelete={deleteData}
                                canUpdate={canUpdateUsers}
                                canDelete={canDeleteUsers}
                                canImpersonate={canImpersonate}
                                currentUserId={auth.user.id}
                                loginType={loginType}
                            />
                        ))}
                    </div>
                ) : (
                    <Table.Card title={"Data Pengguna"}>
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className={"w-10"}>
                                        {canDeleteUsers && (
                                            <Checkbox
                                                onChange={(e) => {
                                                    const allUserIds =
                                                        users.data.map((user) =>
                                                            user.id.toString()
                                                        );
                                                    setData(
                                                        "selectedUser",
                                                        e.target.checked
                                                            ? allUserIds
                                                            : []
                                                    );
                                                }}
                                                checked={
                                                    data.selectedUser.length ===
                                                    users.data.length
                                                }
                                            />
                                        )}
                                    </Table.Th>
                                    <Table.Th className={"w-10"}>No</Table.Th>
                                    <Table.Th>Pengguna</Table.Th>
                                    <Table.Th>Group Akses & Departemen</Table.Th>
                                    <Table.Th></Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {users.data.map((user, i) => (
                                    <tr
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        key={user.id}
                                    >
                                        <Table.Td>
                                            {canDeleteUsers && (
                                                <Checkbox
                                                    value={user.id}
                                                    onChange={setSelectedUser}
                                                    checked={data.selectedUser.includes(
                                                        user.id.toString()
                                                    )}
                                                />
                                            )}
                                        </Table.Td>
                                        <Table.Td className={"text-center"}>
                                            {++i +
                                                (users.current_page - 1) *
                                                    users.per_page}
                                        </Table.Td>
                                    <Table.Td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        user.name
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {user[loginType]}
                                                    </p>
                                                </div>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-accent-100 dark:bg-accent-900/50 text-accent-700 dark:text-accent-400"
                                                    >
                                                        <IconShield size={12} />
                                                        {role.name}
                                                    </span>
                                                ))}
                                                {user.units?.map((unit, index) => (
                                                    <span
                                                        key={`unit-${index}`}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-info-100 dark:bg-info-900/50 text-info-700 dark:text-info-400"
                                                    >
                                                        <IconBuildingHospital size={12} />
                                                        {unit.unit_name}
                                                    </span>
                                                ))}
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex gap-2">
                                                {canImpersonate && user.id !== auth.user.id && (
                                                    <Button
                                                        type={"link"}
                                                        icon={<IconUserShare size={16} strokeWidth={1.5} />}
                                                        className={"border bg-info-100 border-info-200 text-info-600 hover:bg-info-200 dark:bg-info-900/50 dark:border-info-800 dark:text-info-400"}
                                                        href={route("impersonate", user.id)}
                                                    />
                                                )}
                                                {canUpdateUsers && (
                                                    <Button
                                                        type={"edit"}
                                                        icon={
                                                            <IconPencilCog
                                                                size={16}
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                        }
                                                        className={
                                                            "border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                        }
                                                        href={route(
                                                            "users.edit",
                                                            user.id
                                                        )}
                                                    />
                                                )}
                                                {canDeleteUsers && (
                                                    <Button
                                                        type={"delete"}
                                                        icon={
                                                            <IconTrash
                                                                size={16}
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                        }
                                                        className={
                                                            "border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                        }
                                                        url={route(
                                                            "users.destroy",
                                                            user.id
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.Card>
                )
            ) : (
                <EmptyState
                    icon={IconDatabaseOff}
                    title="Belum Ada Pengguna"
                    description="Tambahkan pengguna pertama Anda."
                >
                    {canCreateUsers && (
                        <Button
                            type={"link"}
                            icon={<IconCirclePlus size={18} />}
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white"
                            }
                            label={"Tambah Pengguna"}
                            href={route("users.create")}
                        />
                    )}
                </EmptyState>
            )}

            {users.last_page !== 1 && <Pagination links={users.links} />}
        </PageContainer>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
