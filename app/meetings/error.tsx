
'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('An uncaught error occurred:', error);
    }, [error]);

    return (
        <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-slate-200 bg-amber-50 p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold mb-4 text-slate-900">
                Something went wrong!
            </h1>

            <p className="mb-4 text-slate-700">
                {error.message}
            </p>

            <button
                type="button"
                onClick={reset}
                className="mb-4 px-4 py-2 bg-amber-500 text-white rounded"
            >
                Try again
            </button>

            <Link
                className="text-amber-700 underline"
                href="/meetings"
            >
                Go back to meetings
            </Link>
        </div>
    );
}
