<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'unit_id' => 'required|exists:units,id',
            'shift_template_id' => 'required|exists:shift_templates,id',
            'date' => 'required|date',
            'start_slot' => 'required|integer|min:0|max:47',
            'end_slot' => 'required|integer|min:0|max:47',
            'hours' => 'required|numeric|min:0',
        ];
    }
}
