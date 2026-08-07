import React from "react";
import { router, usePage } from "@inertiajs/react";

export default function PerPage({ url }) {
    const { url: currentUrl } = usePage();
    const params = new URLSearchParams(currentUrl.split("?")[1]);
    const currentPerPage = params.get("per_page") || "10";

    const handleChange = (e) => {
        const perPage = e.target.value;
        router.get(
            url,
            { ...Object.fromEntries(params), per_page: perPage },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500 dark:text-slate-400">Tampilkan:</label>
            <select
                value={currentPerPage}
                onChange={handleChange}
                className="py-1.5 pl-3 pr-8 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="all">Semua</option>
            </select>
        </div>
    );
}
