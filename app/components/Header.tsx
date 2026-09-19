import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gray-800 text-white p-4 shadow-md">
            <div id="header-title" className="container mx-auto flex justify-between items-center">Erick Flores</div>
            <nav className="max-w-4xl mx-auto flex space-x-4 justify-center items-center">
                <ul className="flex gap-4">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/current">Current</Link></li>
                    <li><Link href="/past">Past</Link></li>
                </ul>
            </nav>
        </header>
    );
}