<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class LogoutController extends Controller
{
    public function __invoke(Request $request)
    {
        $ssoEnabled = config('iam.enabled', false) || env('USE_SSO', false);

        if ($ssoEnabled) {
            return $this->handleSSOLogout($request);
        }

        return $this->handleLocalLogout($request);
    }

    private function handleSSOLogout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        $request->session()->forget('iam');

        $iamBase = config('iam.base_url', '');
        return redirect()->away(rtrim($iamBase, '/') . '/logout');
    }

    private function handleLocalLogout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('login.form');
    }
}
