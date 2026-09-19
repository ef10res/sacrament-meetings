import Link from 'next/link';
import { SacramentMeeting } from '../lib/types';

interface MeetingCardProps {
    meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{meeting.date}</h2>
            <p className="text-gray-700">Presiding: {meeting.presiding}</p>
            <p className="text-gray-700">Conducting: {meeting.conducting}</p>
            <Link href={`/meetings/${meeting.id}`} className="text-blue-500 hover:underline">
                View Details
            </Link>
        </div>
    );
}