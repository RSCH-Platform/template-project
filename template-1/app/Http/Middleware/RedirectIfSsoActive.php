<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfSsoActive
{
    /**
     * Handle an incoming request.
     *
     * Middleware ini akan redirect ke SSO login ketika SSO aktif,
     * untuk mencegah akses ke form login lokal.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ssoEnabled = config('iam.enabled', false) || env('USE_SSO', false);

        if ($ssoEnabled) {
            // Redirect ke SSO ketika SSO aktif
            return redirect()->route('sso.login');
        }

        return $next($request);
    }
}
