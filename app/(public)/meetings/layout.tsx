import Link from "next/link";

export default function MeetingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <nav className="flex gap-4 p-4">
                <Link href="/meetings">
                    All Meetings
                </Link>

                <Link href="/meetings/current">
                    Current Meeting
                </Link>
            </nav>

            {children}
        </section>
    );
}