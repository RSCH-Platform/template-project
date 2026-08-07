import { useState } from 'react';

/**
 * Hook untuk mengelola seleksi bulk di tabel/grid
 * @param {Array} allItems - semua item yang bisa dipilih
 * @param {string} idKey   - nama key ID pada tiap item (default 'id')
 */
export default function useBulkSelect(allItems = [], idKey = 'id') {
    const [selected, setSelected] = useState([]);

    const toggle = (id) => {
        const strId = String(id);
        setSelected(prev =>
            prev.includes(strId)
                ? prev.filter(i => i !== strId)
                : [...prev, strId]
        );
    };

    const toggleAll = (checked) => {
        setSelected(checked ? allItems.map(i => String(i[idKey])) : []);
    };

    const isSelected = (id) => selected.includes(String(id));
    const isAllSelected = allItems.length > 0 && selected.length === allItems.length;
    const clear = () => setSelected([]);

    return { selected, toggle, toggleAll, isSelected, isAllSelected, clear };
}
