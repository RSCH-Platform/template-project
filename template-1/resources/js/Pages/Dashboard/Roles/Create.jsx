import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm, usePage } from "@inertiajs/react";
import { IconDeviceFloppy, IconArrowLeft } from "@tabler/icons-react";
import { PageContainer, SectionCard, PermissionPicker, Button, Input } from "@/Components/Dashboard";

export default function Create() {
    const { permissions } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        permissions: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("roles.store"));
    };

    return (
        <PageContainer
            title="Tambah Akses Group"
            description="Buat akses group baru dan atur hak aksesnya"
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
                            label={processing ? "Menyimpan..." : "Simpan"}
                            disabled={processing}
                        />
                    </div>
                </form>
            </SectionCard>
        </PageContainer>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
