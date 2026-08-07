import React from 'react';
import AppLayout from '@/Layouts/DashboardLayout';
import { FormContainer, Input, SectionCard } from '@/Components/Dashboard';
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
            onSubmit={submit}
            processing={processing}
            submitLabel="Simpan Perubahan"
        >
            <Head title="Edit Departemen" />
            <SectionCard title="Informasi Departemen">
                <div className="space-y-6">
                    <Input
                        label="Nama Departemen"
                        value={data.unit_name}
                        onChange={(e) => setData('unit_name', e.target.value)}
                        errors={errors.unit_name}
                        required
                    />

                    <Input
                        label="Deskripsi (Opsional)"
                        type="textarea"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        errors={errors.description}
                    />
                </div>
            </SectionCard>
        </FormContainer>
    );
}

Edit.layout = (page) => <AppLayout children={page} />;
