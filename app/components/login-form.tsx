
'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';

export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );

    return (
        <form
            action={formAction}
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Welcome Back
                </h2>
                <p className="text-sm text-slate-500">
                    Sign in to manage sacrament meeting programs.
                </p>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700"
                >
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    minLength={6}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {errorMessage && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-xs text-slate-500">
                Authorized bishopric members only
            </p>
        </form>
    );
}
