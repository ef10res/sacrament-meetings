import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-slate-200 bg-amber-50 p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold mb-4 text-slate-900">
                Meeting Not Found
            </h1>
            <p className="mb-4 text-slate-700">
                The meeting you are looking for does not exist.
            </p>
            <Link
                className="text-amber-700 underline"
                href="/meetings"
            >
                Go back to meetings
            </Link>
        </div>
    );
}