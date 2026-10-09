import type { SacramentMeeting } from './types';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 5;

export async function getMeetings(
    query: string = '',
    currentPage: number = 1
): Promise<SacramentMeeting[]> {
    const searchTerm = `%${query}%`;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE
      presiding     ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;
    return rows as unknown as SacramentMeeting[];
}

export async function getMeetingsTotalPages(
    query: string = ''
): Promise<number> {
    const searchTerm = `%${query}%`;
    const rows = await sql`
    SELECT COUNT(*) FROM meetings
    WHERE
      presiding     ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
  `;
    return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(
    id: number
): Promise<SacramentMeeting | null> {
    const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings WHERE id = ${id}
  `;
    return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// Mutation stubs — will be wired to the database in Week 04
export async function addMeeting(
    data: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
    const { date, meetingType, presiding, conducting, announcements, openingHymn, openingPrayer, wardBusiness, stakeBusiness, sacramentHymn, speakers, closingHymn, closingPrayer } = data;
    const rows = await sql`
    INSERT INTO meetings (
      date,
      meeting_type,
      presiding,
      conducting,
      announcements,
      opening_hymn,
      opening_prayer,
      ward_business,
      stake_business,
      sacrament_hymn,
      speakers,
      closing_hymn,
      closing_prayer
    ) VALUES (
      ${date},
      ${meetingType},
      ${presiding},
      ${conducting},
      ${announcements},
      ${openingHymn},
      ${openingPrayer},
      ${wardBusiness},
      ${stakeBusiness},
      ${sacramentHymn},
      ${speakers},
      ${closingHymn},
      ${closingPrayer}
    )
    RETURNING *;
    `;
    return rows[0] as unknown as SacramentMeeting;
}

export async function updateMeeting(
    id: number,
    updates: Partial<SacramentMeeting>
): Promise<SacramentMeeting | null> {
    const { date, meetingType, presiding, conducting, announcements, openingHymn, openingPrayer, wardBusiness, stakeBusiness, sacramentHymn, speakers, closingHymn, closingPrayer } = updates;
    const rows = await sql`
    UPDATE meetings SET
      date = COALESCE(${date ?? null}, date),
      meeting_type = COALESCE(${meetingType ?? null}, meeting_type),
      presiding = COALESCE(${presiding ?? null}, presiding),
      conducting = COALESCE(${conducting ?? null}, conducting),
      announcements = COALESCE(${announcements ?? null}, announcements),
      opening_hymn = COALESCE(${openingHymn ?? null}, opening_hymn),
      opening_prayer = COALESCE(${openingPrayer ?? null}, opening_prayer),
      ward_business = COALESCE(${wardBusiness ?? null}, ward_business),
      stake_business = COALESCE(${stakeBusiness ?? null}, stake_business),
      sacrament_hymn = COALESCE(${sacramentHymn ?? null}, sacrament_hymn),
      speakers = COALESCE(${speakers ?? null}, speakers),
      closing_hymn = COALESCE(${closingHymn ?? null}, closing_hymn),
      closing_prayer = COALESCE(${closingPrayer ?? null}, closing_prayer)
    WHERE id = ${id}
    RETURNING *;
    `;
    return (rows[0] as unknown as SacramentMeeting) ?? null;
}

export async function deleteMeeting(id: number): Promise<boolean> {
    const result = await sql`
    DELETE FROM meetings WHERE id = ${id};
    `;
    return result.length > 0;
}
