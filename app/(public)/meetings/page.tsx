import MeetingCard  from "@/app/components/MeetingCard";
import { getMeetings, getMeetingsTotalPages } from "@/app/lib/meetings-db";
import MeetingSearch from "@/app/components/MeetingSearch";
import Pagination from "@/app/components/Pagination";

export default async function MeetingsPage(props: { searchParams?: Promise<{ query?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page) || 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query)
  ]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
      <MeetingSearch />
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
        <Pagination totalPages={totalPages} />
    </div>
  );
}