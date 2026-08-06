import React from 'react';
import AppLayout from '@/Layouts/DashboardLayout';
import FormContainer from '@/Components/Dashboard/FormContainer';
import Input from '@/Components/Dashboard/Input';
import Button from '@/Components/Dashboard/Button';
import { useForm, Head } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function Edit({ unit }) {
    const { data, setData, put, processing, errors } = useForm({
        unit_name: unit.unit_name || '',
        
        description: unit.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('units.update', unit.id), {
            onSuccess: () => {
                toast.success('Departemen berhasil diperbarui');
            }
        });
    };

    return (
        <FormContainer
            title="Edit Departemen"
            description="Perbarui informasi departemen yang ada di sistem."
            backUrl={route('units.index')}
        >
            <Head title="Edit Departemen" />
            <form onSubmit={submit} className="space-y-6">
                <Input
                    label="Nama Departemen"
                    value={data.unit_name}
                    onChange={(e) => setData('unit_name', e.target.value)}
                    error={errors.unit_name}
                    required
                />
                
                

                <Input
                    label="Deskripsi (Opsional)"
                    type="textarea"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    error={errors.description}
                />

                <div className="flex justify-end gap-3 mt-6">
                    <Button 
                        type="link" 
                        href={route('units.index')}
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
        </FormContainer>
    );
}

Edit.layout = (page) => <AppLayout children={page} />;
