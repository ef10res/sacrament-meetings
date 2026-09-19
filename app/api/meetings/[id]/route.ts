import { getMeetingById } from "@/app/lib/meetings-db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const meetingId = Number(id);
    if (!Number.isInteger(meetingId)) {
        return new Response("Invalid meeting ID", { status: 400 });
    }
    const meeting = getMeetingById(meetingId);
    if (!meeting) {
        return new Response("Meeting not found", { status: 404 });
    }

    return new Response(JSON.stringify(meeting));
}