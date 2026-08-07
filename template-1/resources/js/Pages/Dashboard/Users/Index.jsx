import DashboardLayout from "@/Layouts/DashboardLayout";
import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { useAuthorization } from "@/Utils/authorization";
import {
    IconDatabaseOff,
    IconCirclePlus,
    IconTrash,
    IconShield,
    IconBuildingHospital,
} from "@tabler/icons-react";

import {
    PageContainer,
    ResourceToolbar,
    Button,
    Table,
    Checkbox,
    Pagination,
    EmptyState,
    UserCard,
    Badge,
    ActionButtons,
} from "@/Components/Dashboard";

import useBulkSelect from "@/Hooks/useBulkSelect";
import useDeleteConfirm from "@/Hooks/useDeleteConfirm";
import useViewMode from "@/Hooks/useViewMode";

export default function Index() {
    const { users, auth, loginType = 'email' } = usePage().props;
    const { can } = useAuthorization();
    const [viewMode, setViewMode] = useViewMode("usersViewMode", "grid");
    const canCreateUsers = can("users-create");
    const canUpdateUsers = can("users-update");
    const canDeleteUsers = can("users-delete");
    const canImpersonate = can("impersonate");

    const { selected, toggle, toggleAll, isSelected, isAllSelected, clear } = useBulkSelect(users.data);
    const { confirmDelete } = useDeleteConfirm();

    const deleteData = (ids) => {
        const url = route("users.destroy", Array.isArray(ids) ? ids : [ids]);
        confirmDelete(url, {
            onSuccess: () => clear(),
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
                canDeleteUsers && selected.length > 0 && (
                    <Button
                        type={"bulk"}
                        icon={<IconTrash size={18} />}
                        className={"bg-danger-500 hover:bg-danger-600 text-white"}
                        label={`Hapus ${selected.length}`}
                        onClick={() => deleteData(selected)}
                    />
                )
            }
        >
            <Head title="Pengguna" />

            <ResourceToolbar 
                url={route("users.index")}
                searchPlaceholder="Cari pengguna..."
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Content */}
            {users.data.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        {users.data.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                isSelected={isSelected(user.id)}
                                onSelect={(e) => toggle(e.target.value)}
                                onDelete={() => deleteData(user.id)}
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
                                                onChange={(e) => toggleAll(e.target.checked)}
                                                checked={isAllSelected}
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
                                                    onChange={() => toggle(user.id)}
                                                    checked={isSelected(user.id)}
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
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role, index) => (
                                                        <Badge 
                                                            key={index} 
                                                            label={role.name} 
                                                            icon={IconShield} 
                                                            variant="accent" 
                                                        />
                                                    ))}
                                                </div>

                                                <div className="flex flex-wrap gap-1">
                                                    {user.units?.map((unit, index) => (
                                                        <Badge 
                                                            key={`unit-${index}`} 
                                                            label={unit.unit_name} 
                                                            icon={IconBuildingHospital} 
                                                            variant="info" 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionButtons 
                                                canUpdate={canUpdateUsers}
                                                canDelete={canDeleteUsers}
                                                canImpersonate={canImpersonate}
                                                isCurrentUser={user.id === auth.user.id}
                                                editHref={route("users.edit", user.id)}
                                                impersonateHref={route("impersonate", user.id)}
                                                deleteUrl={route("users.destroy", user.id)}
                                            />
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
