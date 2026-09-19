import NavLinks from './NavLinks';
import React from 'react';

export default function Header() {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="bg-blue-300 border-b-2 border-gray-300 p-4">
            <div className="mx-auto">
                <h1 className="text-2xl font-bold">Davis YSA Ward</h1>
                <p className="text-sm text-gray-900">{currentDate}</p>
                <NavLinks />
            </div>
        </header>
    );
}
