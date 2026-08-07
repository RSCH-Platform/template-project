import React from 'react';
import Checkbox from './Checkbox';
import { IconShield } from '@tabler/icons-react';

export default function RolePicker({ roles, selected, onChange, error }) {
    return (
        <div>
            <div className="flex flex-wrap gap-3">
                {roles.map((role, i) => (
                    <label
                        key={i}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                            selected.includes(role.name)
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/50'
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                        }`}
                    >
                        <Checkbox
                            value={role.name}
                            onChange={onChange}
                            checked={selected.includes(role.name)}
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                            {role.name}
                        </span>
                    </label>
                ))}
            </div>
            {error && <p className="text-xs text-danger-500 mt-2">{error}</p>}
        </div>
    );
}
