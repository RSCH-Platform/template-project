import { router, usePage } from '@inertiajs/react';
import { IconSearch, IconX } from '@tabler/icons-react';
import React, { useState, useEffect, useRef } from 'react';

export default function Search({ url, placeholder }) {
    const { url: currentUrl } = usePage();
    const params = new URLSearchParams(currentUrl.split('?')[1]);
    const [search, setSearch] = useState(params.get('search') || '');
    const isFirstRender = useRef(true);

    // Debounced real-time search (400ms)
    useEffect(() => {
        // Skip the very first render to avoid re-triggering on mount
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            const currentParams = new URLSearchParams(window.location.search);
            const newParams = { ...Object.fromEntries(currentParams), search };

            // Remove search param if empty
            if (!search) delete newParams.search;

            // Reset page to 1 on new search
            delete newParams.page;

            router.get(url, newParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3'>
                <IconSearch className='text-slate-400 w-4 h-4' />
            </div>
            <input
                type='text'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='py-2 pl-9 pr-9 block w-full rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-slate-700 bg-white border-slate-200 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:focus:border-primary-600 transition-colors'
                placeholder={placeholder}
            />
            {search && (
                <button
                    type='button'
                    onClick={() => setSearch('')}
                    className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors'
                >
                    <IconX className='w-4 h-4' />
                </button>
            )}
        </div>
    );
}
