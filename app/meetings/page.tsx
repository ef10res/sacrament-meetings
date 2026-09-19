import MeetingCard from "../components/MeetingCard";
import { getMeetings } from "../lib/meetings-db";

export default function MeetingsPage() {
  const meetings = getMeetings();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-bold mt-8">Sacrament Meetings</h1>
        <p className="text-lg mt-4">
          Welcome to the sacrament meetings schedule and information page.
        </p>
        <div className="mt-4 w-full">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </main>
    </div>
  );
}