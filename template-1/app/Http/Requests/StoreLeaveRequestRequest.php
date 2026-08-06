<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'leave_date' => 'required|date',
            'leave_type' => 'required|in:CUTI_TAHUNAN,CUTI_SAKIT,CUTI_DARURAT',
            'reason'     => 'nullable|string|max:500',
        ];
    }
}
