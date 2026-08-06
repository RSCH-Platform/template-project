import DashboardLayout from "@/Layouts/DashboardLayout";
import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import { IconDeviceFloppy, IconArrowLeft } from "@tabler/icons-react";
import PageContainer from "@/Components/Dashboard/PageContainer";
import Checkbox from "@/Components/Dashboard/Checkbox";

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

    const handlePermissionChange = (e) => {
        const value = parseInt(e.target.value);
        let items = [...data.permissions];
        if (items.includes(value)) {
            items = items.filter((id) => id !== value);
        } else {
            items.push(value);
        }
        setData("permissions", items);
    };

    return (
        <PageContainer
            title="Tambah Akses Group"
            description="Buat akses group baru dan atur hak aksesnya"
            backUrl={route("roles.index")}
        >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Nama Akses Group
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl border ${
                                errors.name
                                    ? "border-danger-500 focus:border-danger-500"
                                    : "border-slate-200 dark:border-slate-700 focus:border-primary-500"
                            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                            placeholder="Contoh: admin, manager, dll"
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-sm text-danger-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            Pilih Hak Akses (Permissions)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {permissions.map((permission) => (
                                <label
                                    key={permission.id}
                                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                >
                                    <Checkbox
                                        value={permission.id}
                                        onChange={handlePermissionChange}
                                        checked={data.permissions.includes(
                                            permission.id
                                        )}
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {permission.name}
                                    </span>
                                </label>
                            ))}
                        </div>
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
            </div>
        </PageContainer>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
