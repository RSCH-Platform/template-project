import React, { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { IconCheck, IconChevronDown, IconX } from '@tabler/icons-react';

export default function SearchableSelect({ 
    options, 
    selected, 
    onChange, 
    multiple = false, 
    placeholder = "Pilih...",
    label,
    errors
}) {
    const [query, setQuery] = useState('');

    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) =>
                  option.name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, ''))
              );

    const handleRemove = (e, idToRemove) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(selected.filter(id => id !== idToRemove));
    };

    const getDisplayValue = () => {
        if (multiple) {
            if (!selected || selected.length === 0) return placeholder;
            return `${selected.length} terpilih`;
        } else {
            if (!selected) return placeholder;
            const opt = options.find(o => o.id === selected);
            return opt ? opt.name : placeholder;
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {label && <label className="text-gray-600 dark:text-gray-300 text-sm font-medium">{label}</label>}
            
            <Combobox value={selected} onChange={onChange} multiple={multiple}>
                <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 sm:text-sm">
                        
                        <div className="flex items-center w-full">
                            <Combobox.Input
                                className="w-full border-none py-3 pl-4 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 bg-transparent focus:ring-0"
                                displayValue={getDisplayValue}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={placeholder}
                                autoComplete="off"
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <IconChevronDown
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </Combobox.Button>
                        </div>
                    </div>

                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                        {filteredOptions.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-400">
                                Tidak ditemukan.
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <Combobox.Option
                                    key={option.id}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${
                                            active ? 'bg-primary-500 text-white' : 'text-gray-900 dark:text-gray-100'
                                        }`
                                    }
                                    value={option.id}
                                >
                                    {({ selected: isSelected, active }) => {
                                        return (
                                            <>
                                                <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>
                                                    {option.name}
                                                </span>
                                                {isSelected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            active ? 'text-white' : 'text-primary-600 dark:text-primary-400'
                                                        }`}
                                                    >
                                                        <IconCheck className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        );
                                    }}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </div>
            </Combobox>
            
            {multiple && selected && selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selected.map(id => {
                        const opt = options.find(o => o.id === id);
                        if (!opt) return null;
                        return (
                            <div key={id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 text-xs font-medium border border-primary-200 dark:border-primary-800/50">
                                <span>{opt.name}</span>
                                <button type="button" onClick={(e) => handleRemove(e, id)} className="hover:text-danger-500 transition-colors">
                                    <IconX size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {errors && (
                <p className="text-xs text-danger-500">{errors}</p>
            )}
        </div>
    );
}
