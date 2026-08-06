<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfSsoDisabled
{
    /**
     * Handle an incoming request.
     *
     * Middleware ini akan redirect ke form login lokal (Breeze) ketika SSO disabled
     * dan user mencoba mengakses SSO routes seperti /sso/login atau /callback.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ssoEnabled = config('iam.enabled', false) || env('USE_SSO', false);

        if (!$ssoEnabled) {
            // Redirect ke Breeze login ketika SSO tidak aktif
            return redirect()->route('login.form');
        }

        return $next($request);
    }
}
