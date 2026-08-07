import React from 'react';
import AppLayout from '@/Layouts/DashboardLayout';
import { FormContainer, Input, SectionCard } from '@/Components/Dashboard';
import { useForm, Head } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        unit_name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('units.store'), {
            onSuccess: () => {
                toast.success('Departemen berhasil ditambahkan');
            }
        });
    };

    return (
        <FormContainer
            title="Tambah Departemen"
            description="Tambahkan departemen baru ke dalam sistem."
            backUrl={route('units.index')}
            onSubmit={submit}
            processing={processing}
        >
            <Head title="Tambah Departemen" />
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

Create.layout = (page) => <AppLayout children={page} />;
