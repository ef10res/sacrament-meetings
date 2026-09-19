import { getMeetings } from "@/app/lib/meetings-db";

export async function GET(request: Request) {
    const date = new URL(request.url).searchParams.get("date");
    const meetings = await getMeetings(date);
    return new Response(JSON.stringify(meetings));
}