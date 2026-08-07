import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import Input from "@/Components/Dashboard/Input";
import ListBox from "@/Components/Dashboard/ListBox";
import Modal from "@/Components/Dashboard/Modal";
import Search from "@/Components/Dashboard/Search";
import Pagination from "@/Components/Dashboard/Pagination";
import { useAuthorization } from "@/Utils/authorization";
import {
    IconDatabaseOff,
    IconCirclePlus,
    IconTrash,
    IconUserShield,
    IconPencilCog,
    IconPencilCheck,
    IconShield,
} from "@tabler/icons-react";

import EmptyState from "@/Components/Dashboard/EmptyState";
import RoleCard from "@/Components/Dashboard/RoleCard";
import PerPage from "@/Components/Dashboard/PerPage";

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
        delete: destroy,
    } = useForm({
        id: "",
        name: "",
        selectedPermission: [],
        isUpdate: false,
        isOpen: false,
    });

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
            onSuccess: () =>
                setData({ selectedPermission: [], name: "", isOpen: false }),
        });
    };

    const updateRole = async (e) => {
        e.preventDefault();
        post(route("roles.update", data.id), {
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
        if (confirm("Hapus role ini?")) {
            destroy(route("roles.destroy", roleId));
        }
    };

    return (
        <>
            <Head title="Akses Group" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <IconUserShield
                                size={28}
                                className="text-primary-500"
                            />
                            Akses Group
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {roles.total || roles.data?.length || 0} group
                            terdaftar
                        </p>
                    </div>
                    {canCreateRoles && (
                        <Button
                            type={"button"}
                            icon={
                                <IconCirclePlus
                                    size={18}
                                    strokeWidth={1.5}
                                />
                            }
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                            }
                            label={"Tambah Group"}
                            onClick={() => setData("isOpen", true)}
                        />
                    )}
                </div>
            </div>

            {/* Search and PerPage */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("roles.index")}
                        placeholder="Cari akses group..."
                    />
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                    <PerPage url={route("roles.index")} />
                </div>
            </div>

            {/* Modal */}
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
                            data={permissions}
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

            {/* Content */}
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

            {roles.last_page !== 1 && <Pagination links={roles.links} />}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
