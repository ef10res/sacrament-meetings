"use client";

import Link from 'next/link';

import { usePathname } from 'next/navigation';

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav>
            <ul className="mt-4 flex gap-4">
                <li>
                    <Link href="/" className={pathname === '/' ? 'font-semibold text-gray-900' : 'text-gray-800 hover:text-blue-900'}>Home</Link>
                </li>
                <li>
                    <Link href="/meetings" className={pathname === '/meetings' ? 'font-semibold text-gray-900' : 'text-gray-800 hover:text-blue-900'}>Meetings</Link>
                </li>
            </ul>
        </nav>
    );
}