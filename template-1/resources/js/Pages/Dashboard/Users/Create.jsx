import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, useForm } from "@inertiajs/react";
import {
    IconUserPlus,
    IconShield,
    IconBuildingHospital
} from "@tabler/icons-react";
import { 
    FormContainer, 
    Input, 
    SectionCard, 
    AvatarUploader, 
    RolePicker, 
    SearchableSelect 
} from "@/Components/Dashboard";
import toast from "react-hot-toast";

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

    const handleRoleChange = (e) => {
        const value = e.target.value;
        let items = [...data.selectedRoles];
        if (items.includes(value)) {
            items = items.filter((name) => name !== value);
        } else {
            items.push(value);
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
            <SectionCard title="Informasi Akun" className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 mb-2">
                        <AvatarUploader 
                            name={data.name}
                            preview={avatarPreview}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setData("avatar", file);
                                    setAvatarPreview(URL.createObjectURL(file));
                                }
                            }}
                            error={errors.avatar}
                        />
                    </div>
                    <Input
                        type="text"
                        label="Nama Lengkap"
                        placeholder="Masukkan nama"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        errors={errors.name}
                    />
                    <Input
                        type="text"
                        label="NIP"
                        placeholder="Misal: 1261.78612"
                        value={data.nip}
                        onChange={(e) => setData("nip", e.target.value)}
                        errors={errors.nip}
                    />
                    <Input
                        type="email"
                        label="Email"
                        placeholder="email@example.com"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        errors={errors.email}
                    />
                    <div className="hidden md:block"></div>
                    <Input
                        type="password"
                        label="Kata Sandi"
                        placeholder="Minimal 8 karakter"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        errors={errors.password}
                    />
                    <Input
                        type="password"
                        label="Konfirmasi Kata Sandi"
                        placeholder="Ulangi kata sandi"
                        value={data.password_confirmation}
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        errors={errors.password_confirmation}
                    />
                </div>
            </SectionCard>

            <SectionCard title="Akses Group" icon={<IconShield size={18} />} className="mb-6">
                <RolePicker 
                    roles={roles}
                    selected={data.selectedRoles}
                    onChange={handleRoleChange}
                    error={errors.selectedRoles}
                />
            </SectionCard>

            <SectionCard title="Departemen / Unit Kerja" icon={<IconBuildingHospital size={18} />}>
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
                    <p className="text-xs text-danger-500 mt-3">{errors.selectedUnits}</p>
                )}
            </SectionCard>
        </FormContainer>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
