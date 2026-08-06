import React from "react";
import { Head, Link } from "@inertiajs/react";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";

export default function FormContainer({
    title,
    icon,
    backUrl,
    backLabel = "Kembali",
    submitLabel = "Simpan",
    submitLabelProcessing = "Menyimpan...",
    onSubmit,
    processing = false,
    children,
}) {
    return (
        <>
            <Head title={title} />

            <div className="mb-6">
                <Link
                    href={backUrl}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-3"
                >
                    <IconArrowLeft size={16} />
                    {backLabel}
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {icon}
                    {title}
                </h1>
            </div>

            <form onSubmit={onSubmit}>
                <div className="max-w-2xl space-y-6">
                    {children}

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href={backUrl}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors disabled:opacity-50"
                        >
                            <IconDeviceFloppy size={18} />
                            {processing ? submitLabelProcessing : submitLabel}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}
