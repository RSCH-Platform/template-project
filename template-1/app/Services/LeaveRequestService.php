<?php

namespace App\Services;

use App\Models\LeaveRequest;
use Illuminate\Support\Facades\Auth;

class LeaveRequestService
{
    /**
     * Buat pengajuan cuti baru dengan validasi H-3 rule.
     */
    public function store(array $data): array
    {
        if (!LeaveRequest::passesH3Rule($data['leave_date'], $data['leave_type'])) {
            return [
                'success' => false,
                'error'   => ['leave_date' => 'Pengajuan cuti harus minimal H-3 (3 hari sebelumnya).'],
            ];
        }

        $leaveRequest = LeaveRequest::create([
            'user_id'    => Auth::id(),
            'leave_date' => $data['leave_date'],
            'leave_type' => $data['leave_type'],
            'reason'     => $data['reason'] ?? null,
            'status'     => 'pending',
        ]);

        return ['success' => true, 'data' => $leaveRequest];
    }

    public function approve(LeaveRequest $leaveRequest): void
    {
        $leaveRequest->update([
            'status'      => 'approved',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);
    }

    public function reject(LeaveRequest $leaveRequest, string $reason): void
    {
        $leaveRequest->update([
            'status'           => 'rejected',
            'rejection_reason' => $reason,
            'reviewed_by'      => Auth::id(),
            'reviewed_at'      => now(),
        ]);
    }

    public function cancel(LeaveRequest $leaveRequest): array
    {
        if (!$leaveRequest->isPending()) {
            return ['success' => false, 'error' => 'Hanya cuti berstatus pending yang dapat dibatalkan.'];
        }

        $leaveRequest->delete();
        return ['success' => true];
    }
}
