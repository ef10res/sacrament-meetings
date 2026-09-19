import { SacramentMeeting } from '../lib/types';

interface MeetingDetailProps {
    meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{meeting.date}</h2>
            <p className="text-gray-700">Meeting Type: {meeting.meetingType}</p>
            <p className="text-gray-700">Presiding: {meeting.presiding}</p>
            <p className="text-gray-700">Conducting: {meeting.conducting}</p>
            <p className="text-gray-700">Announcements: {meeting.announcements?.join(', ') || 'None'}</p>
            <p className="text-gray-700">Opening Hymn: {meeting.openingHymn.title}</p>
            {meeting.wardBusiness.length > 0 && (
                <div className="text-gray-700">
                    <p>Ward Business:</p>
                    <ul className="list-disc list-inside">
                        {meeting.wardBusiness.map((item, index) => (
                            <li key={index}>{item.description}</li>
                        ))}
                    </ul>
                </div>
            )}
            {meeting.stakeBusiness && <p className="text-gray-700">Stake Business: Yes</p>}
            <p className="text-gray-700">Sacrament Hymn: {meeting.sacramentHymn.title}</p>
            {meeting.speakers.length > 0 && (
                <div className="text-gray-700">
                    <p>Speakers:</p>
                    <ul className="list-disc list-inside">
                        {meeting.speakers.map((speaker, index) => (
                            <li key={index}>{speaker.name} - {speaker.topic}</li>
                        ))}
                    </ul>
                </div>
            )}
            <p className="text-gray-700">Closing Hymn: {meeting.closingHymn.title}</p>
            <p className="text-gray-700">Closing Prayer: {meeting.closingPrayer}</p>
        </div>
    );
}