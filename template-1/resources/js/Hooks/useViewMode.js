import { useState, useEffect } from 'react';

export default function useViewMode(key = 'viewMode', defaultMode = 'grid') {
    const [viewMode, setViewMode] = useState(
        () => localStorage.getItem(key) || defaultMode
    );

    useEffect(() => {
        localStorage.setItem(key, viewMode);
    }, [viewMode, key]);

    return [viewMode, setViewMode];
}
