<?php

namespace App\Http\Controllers;

use App\Traits\HasDynamicPagination;
use App\Traits\HasSearchable;
use App\Traits\HasOwnershipCheck;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller
{
    use HasDynamicPagination, HasSearchable, HasOwnershipCheck, AuthorizesRequests;
}
