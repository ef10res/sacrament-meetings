"use client";

import Link from 'next/link';

import { usePathname } from 'next/navigation';

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav>
            <ul className="mt-4 flex gap-4">
                <li>
                    <Link href="/" className={pathname === '/' ? 'font-semibold text-blue-500' : 'text-gray-700 hover:text-blue-500'}>Home</Link>
                </li>
                <li>
                    <Link href="/meetings" className={pathname === '/meetings' ? 'font-semibold text-blue-500' : 'text-gray-700 hover:text-blue-500'}>Meetings</Link>
                </li>
            </ul>
        </nav>
    );
}