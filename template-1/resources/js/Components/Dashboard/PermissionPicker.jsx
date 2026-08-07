import React from 'react';
import Checkbox from './Checkbox';

export default function PermissionPicker({ permissions, selected, onChange, error }) {
    const handleChange = (e) => {
        const value = parseInt(e.target.value);
        onChange(prev =>
            prev.includes(value)
                ? prev.filter(id => id !== value)
                : [...prev, value]
        );
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {permissions.map(permission => (
                    <label key={permission.id}
                        className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                        <Checkbox
                            value={permission.id}
                            onChange={handleChange}
                            checked={selected.includes(permission.id)}
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {permission.name}
                        </span>
                    </label>
                ))}
            </div>
            {error && <p className="text-xs text-danger-500 mt-2">{error}</p>}
        </div>
    );
}
