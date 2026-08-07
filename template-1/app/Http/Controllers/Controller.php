<?php

namespace App\Http\Controllers;

use App\Traits\HasDynamicPagination;

abstract class Controller
{
    use HasDynamicPagination;
}
