import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm, usePage } from "@inertiajs/react";
import { IconDeviceFloppy, IconArrowLeft } from "@tabler/icons-react";
import { PageContainer, SectionCard, PermissionPicker, Button, Input } from "@/Components/Dashboard";

export default function Edit() {
    const { role, permissions } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions ? role.permissions.map((p) => p.id) : [],
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("roles.update", role.id));
    };

    return (
        <PageContainer
            title="Edit Akses Group"
            description="Ubah data akses group dan hak aksesnya"
            backUrl={route("roles.index")}
        >
            <SectionCard>
                <form onSubmit={submit} className="space-y-6">
                    <Input
                        label="Nama Akses Group"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Contoh: admin, manager, dll"
                        errors={errors.name}
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            Pilih Hak Akses (Permissions)
                        </label>
                        <PermissionPicker 
                            permissions={permissions}
                            selected={data.permissions}
                            onChange={(updater) => setData("permissions", updater(data.permissions))}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type={"link"}
                            href={route("roles.index")}
                            className={"bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"}
                            icon={<IconArrowLeft size={18} />}
                            label={"Batal"}
                        />
                        <Button
                            type={"submit"}
                            className={"bg-primary-500 hover:bg-primary-600 text-white"}
                            icon={<IconDeviceFloppy size={18} />}
                            label={processing ? "Menyimpan..." : "Simpan Perubahan"}
                            disabled={processing}
                        />
                    </div>
                </form>
            </SectionCard>
        </PageContainer>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
