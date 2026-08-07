import Swal from 'sweetalert2';
import { useForm } from '@inertiajs/react';

/**
 * Hook untuk konfirmasi hapus data dengan SweetAlert2
 */
export default function useDeleteConfirm() {
    const { delete: destroy } = useForm();

    const confirmDelete = async (url, options = {}) => {
        const result = await Swal.fire({
            title: options.title || 'Hapus Data?',
            text: options.text || 'Data yang dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: options.confirmText || 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            destroy(url, {
                onSuccess: () => {
                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Data berhasil dihapus!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    options.onSuccess?.();
                },
            });
        }
    };

    return { confirmDelete };
}
