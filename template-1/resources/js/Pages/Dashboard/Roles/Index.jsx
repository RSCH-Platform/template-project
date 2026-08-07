import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useAuthorization } from "@/Utils/authorization";
import useDeleteConfirm from "@/Hooks/useDeleteConfirm";
import {
    IconDatabaseOff,
    IconCirclePlus,
    IconUserShield,
    IconPencilCheck,
} from "@tabler/icons-react";

import {
    PageContainer,
    ResourceToolbar,
    Button,
    Input,
    ListBox,
    Modal,
    Pagination,
    EmptyState,
    RoleCard
} from "@/Components/Dashboard";

export default function Index() {
    const { roles, permissions, errors } = usePage().props;
    const { can } = useAuthorization();
    const canCreateRoles = can("roles-create");
    const canUpdateRoles = can("roles-update");
    const canDeleteRoles = can("roles-delete");

    const {
        data,
        setData,
        transform,
        post,
    } = useForm({
        id: "",
        name: "",
        selectedPermission: [],
        isUpdate: false,
        isOpen: false,
    });

    const { confirmDelete } = useDeleteConfirm();

    const setSelectedPermission = (value) =>
        setData("selectedPermission", value);

    transform((data) => ({
        ...data,
        selectedPermission: data.selectedPermission.map(
            (permission) => permission.id
        ),
        _method: data.isUpdate === true ? "put" : "post",
    }));

    const saveRole = async (e) => {
        e.preventDefault();
        post(route("roles.store"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () =>
                setData({ selectedPermission: [], name: "", isOpen: false }),
        });
    };

    const updateRole = async (e) => {
        e.preventDefault();
        post(route("roles.update", data.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () =>
                setData({
                    id: "",
                    name: "",
                    selectedPermission: [],
                    isUpdate: false,
                    isOpen: false,
                }),
        });
    };

    const handleEdit = (role) => {
        setData({
            id: role.id,
            selectedPermission: role.permissions,
            name: role.name,
            isUpdate: true,
            isOpen: true,
        });
    };

    const handleDelete = (roleId) => {
        confirmDelete(route("roles.destroy", roleId));
    };

    const rolesMeta = roles.meta || roles;

    return (
        <PageContainer
            title="Akses Group"
            description={`${rolesMeta.total || roles.data?.length || 0} group terdaftar`}
            icon={<IconUserShield size={28} className="text-primary-500" />}
            actions={
                canCreateRoles && (
                    <Button
                        type={"button"}
                        icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                        className={"bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"}
                        label={"Tambah Group"}
                        onClick={() => setData("isOpen", true)}
                    />
                )
            }
        >
            <Head title="Akses Group" />

            <ResourceToolbar 
                url={route("roles.index")}
                searchPlaceholder="Cari akses group..."
            />

            <Modal
                show={data.isOpen}
                onClose={() =>
                    setData({
                        isOpen: false,
                        id: "",
                        name: "",
                        selectedPermission: [],
                        isUpdate: false,
                    })
                }
                title={
                    data.isUpdate ? "Ubah Akses Group" : "Tambah Akses Group"
                }
                icon={<IconUserShield size={20} strokeWidth={1.5} />}
            >
                <form onSubmit={data.isUpdate ? updateRole : saveRole}>
                    <div className="mb-4">
                        <Input
                            label={"Nama group"}
                            type={"text"}
                            placeholder={"Masukan nama group"}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            errors={errors.name}
                        />
                    </div>
                    <div className="mb-4">
                        <ListBox
                            label={"Pilih hak akses"}
                            data={permissions?.data || permissions || []}
                            selected={data.selectedPermission}
                            setSelected={setSelectedPermission}
                            errors={errors.selectedPermission}
                        />
                    </div>
                    <Button
                        type={"submit"}
                        icon={<IconPencilCheck size={18} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white w-full justify-center"
                        }
                        label={"Simpan"}
                    />
                </form>
            </Modal>

            {roles.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {roles.data.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={() => handleEdit(role)}
                            onDelete={() => handleDelete(role.id)}
                            canUpdate={canUpdateRoles}
                            canDelete={canDeleteRoles}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={IconDatabaseOff}
                    title="Belum Ada Group"
                    description="Tambahkan group akses pertama."
                >
                    <Button
                        type={"button"}
                        icon={<IconCirclePlus size={18} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white"
                        }
                        label={"Tambah Group"}
                        onClick={() => setData("isOpen", true)}
                    />
                </EmptyState>
            )}

            {rolesMeta.last_page !== 1 && <Pagination links={rolesMeta.links} />}
        </PageContainer>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
