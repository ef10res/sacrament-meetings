'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    function createPageURL(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        return `${pathname}?${params.toString()}`;
    }

  return (
    <nav aria-label="Pagination" className="flex space-x-2 m-4">
        {currentPage > 1 && (
            <Link className="px-3 py-1 border rounded" href={createPageURL(currentPage - 1)}>Previous</Link>
          )}
          <span>Page {currentPage} of {totalPages}</span>
          {currentPage < totalPages && (
            <Link className="px-3 py-1 border rounded" href={createPageURL(currentPage + 1)}>Next</Link>
          )}
    </nav>
  );
}