<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasSearchable
{
    /**
     * Apply search filter to query based on request('search')
     * @param Builder $query
     * @param string|array $columns
     * @return Builder
     */
    protected function applySearch($query, $columns = ['name'])
    {
        $search = request('search');
        if (!$search) return $query;

        return $query->where(function ($q) use ($columns, $search) {
            foreach ((array) $columns as $col) {
                $q->orWhere($col, 'like', "%{$search}%");
            }
        });
    }
}
