import MeetingDetail from "../../components/MeetingDetail";
import { getMeetingById } from "../../lib/meetings-db";

export default async function MeetingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const meetingId = Number(id);
    const meeting = getMeetingById(meetingId);

    if (!meeting) {
        return <div>Meeting not found</div>;
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <MeetingDetail meeting={meeting} />
            </main>
        </div>
    );
}