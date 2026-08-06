import React from "react";
import { Head, usePage, useForm, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    IconUserPlus,
    IconDeviceFloppy,
    IconArrowLeft,
    IconShield,
} from "@tabler/icons-react";
import Input from "@/Components/Dashboard/Input";
import Checkbox from "@/Components/Dashboard/Checkbox";
import FormContainer from "@/Components/Dashboard/FormContainer";
import SearchableSelect from "@/Components/Dashboard/SearchableSelect";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Create() {
    const { roles, units, multipleDepartments } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        name: "",
        email: "",
        nip: "",
        password: "",
        password_confirmation: "",
        selectedRoles: [],
        selectedUnits: [],
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(null);

    const setSelectedRoles = (e) => {
        let items = [...data.selectedRoles];
        if (items.includes(e.target.value)) {
            items = items.filter((name) => name !== e.target.value);
        } else {
            items.push(e.target.value);
        }
        setData("selectedRoles", items);
    };

    const setSelectedUnits = (val) => {
        setData("selectedUnits", multipleDepartments ? val : (val ? [val] : []));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
            onSuccess: () => toast.success("Pengguna berhasil ditambahkan"),
            onError: () => toast.error("Gagal menyimpan pengguna"),
        });
    };

    return (
        <FormContainer
            title="Tambah Pengguna Baru"
            icon={<IconUserPlus size={28} className="text-primary-500" />}
            backUrl={route("users.index")}
            backLabel="Kembali ke Pengguna"
            onSubmit={submit}
            processing={processing}
        >
                    {/* Account Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                            Informasi Akun
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Avatar
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-slate-600 font-semibold">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>
                                                {data.name
                                                    ? data.name
                                                          .charAt(0)
                                                          .toUpperCase()
                                                    : "?"}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setData("avatar", file);
                                                setAvatarPreview(
                                                    URL.createObjectURL(file)
                                                );
                                            }
                                        }}
                                        errors={errors.avatar}
                                    />
                                </div>
                            </div>
                            <Input
                                type="text"
                                label="Nama Lengkap"
                                placeholder="Masukkan nama"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                errors={errors.name}
                            />
                            <Input
                                type="text"
                                label="NIP"
                                placeholder="Misal: 1261.78612"
                                value={data.nip}
                                onChange={(e) =>
                                    setData("nip", e.target.value)
                                }
                                errors={errors.nip}
                            />
                            <Input
                                type="email"
                                label="Email"
                                placeholder="email@example.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                errors={errors.email}
                            />
                            <Input
                                type="password"
                                label="Kata Sandi"
                                placeholder="Minimal 8 karakter"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                errors={errors.password}
                            />
                            <Input
                                type="password"
                                label="Konfirmasi Kata Sandi"
                                placeholder="Ulangi kata sandi"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                errors={errors.password_confirmation}
                            />
                        </div>
                    </div>

                    {/* Roles */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                            <IconShield size={16} />
                            Akses Group
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {roles.map((role, i) => (
                                <label
                                    key={i}
                                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                                        data.selectedRoles.includes(role.name)
                                            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/50"
                                            : "border-slate-200 dark:border-slate-700 hover:border-primary-300"
                                    }`}
                                >
                                    <Checkbox
                                        value={role.name}
                                        onChange={setSelectedRoles}
                                        checked={data.selectedRoles.includes(
                                            role.name
                                        )}
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                        {role.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    {errors.selectedRoles && (
                        <p className="text-xs text-danger-500 mt-3">
                            {errors.selectedRoles}
                        </p>
                    )}
                </div>

                {/* Units */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mt-4">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                        Departemen / Unit Kerja
                    </h3>
                    <div className="max-w-xl">
                        <SearchableSelect
                            options={units?.map(u => ({ id: u.id, name: u.unit_name })) || []}
                            selected={multipleDepartments ? data.selectedUnits : (data.selectedUnits[0] || null)}
                            onChange={setSelectedUnits}
                            multiple={multipleDepartments}
                            placeholder="Cari dan pilih departemen..."
                        />
                    </div>
                    {errors.selectedUnits && (
                        <p className="text-xs text-danger-500 mt-3">
                            {errors.selectedUnits}
                        </p>
                    )}
                </div>
        </FormContainer>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
