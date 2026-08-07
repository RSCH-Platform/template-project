import React, { useState, useMemo } from 'react';
import Modal from '@/Components/Dashboard/Modal';
import Button from '@/Components/Dashboard/Button';
import SearchableSelect from '@/Components/Dashboard/SearchableSelect';
import Table from '@/Components/Dashboard/Table';
import Checkbox from '@/Components/Dashboard/Checkbox';
import { IconSearch, IconTrash, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import Input from '@/Components/Dashboard/Input';

export default function AssignRelationModal({
    show,
    onClose,
    title,
    onSubmit,
    processing,
    
    // Select props
    options = [],
    selectedValues = [],
    onChangeValues,
    selectLabel = 'Tambah Item',
    selectPlaceholder = 'Cari dan pilih...',
    valueKey = 'id',
    
    // Table props
    columns = [],
    renderRow,
    tableTitle = 'Item Terdaftar',
}) {
    // Local state for table features
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [tableSelection, setTableSelection] = useState([]);

    // Derived preview items (items that are currently selected in the form)
    const previewItems = useMemo(() => {
        return options.filter(opt => selectedValues.includes(opt[valueKey]));
    }, [options, selectedValues, valueKey]);

    // Processed items (filtered and sorted)
    const displayItems = useMemo(() => {
        let items = [...previewItems];
        
        // Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item => 
                Object.values(item).some(val => 
                    val !== null && val !== undefined && String(val).toLowerCase().includes(query)
                )
            );
        }
        
        // Sort
        if (sortConfig.key) {
            items.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        return items;
    }, [previewItems, searchQuery, sortConfig]);

    // Handle sort
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle table selection
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setTableSelection(displayItems.map(item => item[valueKey]));
        } else {
            setTableSelection([]);
        }
    };

    const handleSelectRow = (val) => {
        setTableSelection(prev => 
            prev.includes(val) ? prev.filter(id => id !== val) : [...prev, val]
        );
    };

    // Bulk detach
    const handleBulkDetach = () => {
        const newValues = selectedValues.filter(val => !tableSelection.includes(val));
        onChangeValues(newValues);
        setTableSelection([]);
    };

    const handleReset = () => {
        setSearchQuery('');
        setSortConfig({ key: null, direction: 'asc' });
        setTableSelection([]);
        onClose();
    };

    return (
        <Modal 
            show={show} 
            onClose={handleReset}
            title={title}
            type="slide-over"
            maxWidth="2xl"
        >
            <div className="flex h-full flex-col">
                <div className="flex-1 space-y-6 overflow-y-auto dashboard-scrollbar p-1">
                    {/* Select Input Section */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <SearchableSelect
                            options={options}
                            selected={selectedValues}
                            onChange={onChangeValues}
                            multiple={true}
                            placeholder={selectPlaceholder}
                            label={selectLabel}
                            disabled={processing}
                        />
                    </div>
                    
                    {/* Table Section */}
                    {columns && columns.length > 0 && (
                        <div className="space-y-3 pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    {tableTitle} ({previewItems.length})
                                    {processing && <IconRefresh className="animate-spin text-primary-500" size={16} />}
                                </h3>
                                
                                <div className="flex items-center gap-2">
                                    {tableSelection.length > 0 && (
                                        <Button
                                            type="button"
                                            onClick={handleBulkDetach}
                                            disabled={processing}
                                            icon={<IconTrash size={16} />}
                                            className="bg-danger-500 hover:bg-danger-600 text-white text-xs py-1.5"
                                        >
                                            Lepas ({tableSelection.length})
                                        </Button>
                                    )}
                                    <div className="relative w-full sm:w-56">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconSearch className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="block w-full pl-9 pr-3 py-1.5 text-sm border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                            placeholder="Cari dalam tabel..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                                <Table>
                                    <Table.Thead>
                                        <tr>
                                            <Table.Th className="w-10">
                                                <Checkbox
                                                    checked={displayItems.length > 0 && tableSelection.length === displayItems.length}
                                                    onChange={handleSelectAll}
                                                    disabled={processing}
                                                />
                                            </Table.Th>
                                            <Table.Th className="w-12 text-center">No</Table.Th>
                                            {columns.map((col, idx) => (
                                                <Table.Th 
                                                    key={idx}
                                                    className={`${col.className || ''} ${col.sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors' : ''}`}
                                                    onClick={() => col.sortable && handleSort(col.key)}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        {col.label}
                                                        {col.sortable && sortConfig.key === col.key && (
                                                            sortConfig.direction === 'asc' 
                                                                ? <IconChevronUp size={14} className="text-primary-500" />
                                                                : <IconChevronDown size={14} className="text-primary-500" />
                                                        )}
                                                    </div>
                                                </Table.Th>
                                            ))}
                                        </tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {displayItems.length > 0 ? (
                                            displayItems.map((item, index) => {
                                                const isSelected = tableSelection.includes(item[valueKey]);
                                                return (
                                                    <tr key={item[valueKey]} className={isSelected ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}>
                                                        <Table.Td>
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onChange={() => handleSelectRow(item[valueKey])}
                                                                disabled={processing}
                                                            />
                                                        </Table.Td>
                                                        <Table.Td className="text-center">{index + 1}</Table.Td>
                                                        {renderRow(item, index)}
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <Table.Empty colSpan={columns.length + 2} message="Tidak ada data untuk ditampilkan." />
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
