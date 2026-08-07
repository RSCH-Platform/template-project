import React from 'react';
import Modal from '@/Components/Dashboard/Modal';
import Button from '@/Components/Dashboard/Button';
import SearchableSelect from '@/Components/Dashboard/SearchableSelect';

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
    selectLabel = 'Pilih Item',
    selectPlaceholder = 'Cari dan pilih...',
    
    // Current items props (optional)
    currentItems = [],
    currentItemsLabel = 'Item Terdaftar Saat Ini:',
    renderCurrentItem,
}) {
    return (
        <Modal 
            show={show} 
            onClose={onClose}
            title={title}
            type="slide-over"
        >
            <form onSubmit={onSubmit} className="flex h-full flex-col">
                <div className="flex-1 space-y-6">
                    <div>
                        <SearchableSelect
                            options={options}
                            selected={selectedValues}
                            onChange={onChangeValues}
                            multiple={true}
                            placeholder={selectPlaceholder}
                            label={selectLabel}
                        />
                    </div>
                    
                    {currentItems && currentItems.length > 0 && renderCurrentItem && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                {currentItemsLabel}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {currentItems.map((item, index) => renderCurrentItem(item, index))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-shrink-0 justify-end gap-3 border-t dark:border-slate-800 pt-4 mt-6">
                    <Button 
                        type="button" 
                        onClick={onClose}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                    >
                        Batal
                    </Button>
                    <Button 
                        type="submit" 
                        processing={processing}
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
