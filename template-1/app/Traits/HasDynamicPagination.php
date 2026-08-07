<?php

namespace App\Traits;

trait HasDynamicPagination
{
    /**
     * Apply dynamic pagination to the given query builder based on 'per_page' request parameter.
     *
     * @param  \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Relations\Relation|\Illuminate\Database\Query\Builder  $query
     * @param  int  $defaultPerPage
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    protected function dynamicPaginate($query, $defaultPerPage = 10)
    {
        $perPage = request('per_page', $defaultPerPage);
        
        if ($perPage === 'all') {
            $perPage = $query->count();
            // Fallback to 1 if count is 0 to avoid DivisionByZeroError in Laravel's paginator
            $perPage = $perPage > 0 ? $perPage : 1; 
        }

        return $query->paginate($perPage)->withQueryString();
    }
}
