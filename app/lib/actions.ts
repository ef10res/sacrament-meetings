'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addMeeting, updateMeeting, deleteMeeting } from './meetings-db';

const MeetingFormSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    meetingType: z.enum(
        ['testimony', 'regular', 'stake', 'general'],
        { error: 'Please select a valid meeting type' }
    ),    presiding: z.string().min(1, 'Presiding is required'),
    conducting: z.string().min(1, 'Conducting is required'),
    announcements: z.string()
        .transform(value =>
            value.split("\n")
                .map(item => item.trim())
                .filter(Boolean)
        )
        .optional(),
    openingHymn: z.object({
        number: z.coerce.number().int().positive(),
        title: z.string().min(1),
    }),
    openingPrayer: z.string().min(1, 'Opening prayer is required'),
    wardBusiness: z.array(
        z.object({
            description: z.string().min(1, "Description is required"),
        })
    ).default([]),
    stakeBusiness: z.boolean(),
    sacramentHymn: z.object({
        number: z.coerce.number().int().positive(),
        title: z.string().min(1),
    }),
    
    speakers: z.array(
        z.object({
            name: z.string().min(1, "Name is required"),
            topic: z.string().min(1, "Topic is required"),
            type: z.enum(["speaker", "musical number"]),
        })
    ).default([]),
    closingHymn: z.object({
        number: z.coerce.number().int().positive(),
        title: z.string().min(1),
    }),
    closingPrayer: z.string().min(1, 'Closing prayer is required'),
});

function buildMeetingFormData(formData: FormData) {
    return {
        date: formData.get('date'),
        meetingType: formData.get('meetingType'),
        presiding: formData.get('presiding'),
        conducting: formData.get('conducting'),
        announcements: formData.get('announcements') ?? '',
        openingHymn: {
            number: formData.get('openingHymn.number'),
            title: formData.get('openingHymn.title'),
        },
        openingPrayer: formData.get('openingPrayer'),
        wardBusiness: String(formData.get('wardBusiness') ?? '')
            .split('\n')
            .map(value => value.trim())
            .filter(Boolean)
            .map(description => ({ description })),
        stakeBusiness: formData.has('stakeBusiness'),
        sacramentHymn: {
            number: formData.get('sacramentHymn.number'),
            title: formData.get('sacramentHymn.title'),
        },
        speakers: String(formData.get('speakers') ?? '')
            .split('\n')
            .map(value => value.trim())
            .filter(Boolean)
            .map(line => {
                const [name, topic, type] = line.split(' - ');
                return { name, topic, type };
            }),
        closingHymn: {
            number: formData.get('closingHymn.number'),
            title: formData.get('closingHymn.title'),
        },
        closingPrayer: formData.get('closingPrayer'),
    };
}

function getFieldErrors(error: z.ZodError): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    for (const issue of error.issues) {
        const field = issue.path.join('.');

        if (!errors[field]) {
            errors[field] = [];
        }

        errors[field].push(issue.message);
    }

    return errors;
}

export type State = {
    errors?: Record<string, string[]>;
    message?: string | null;
};

export async function addMeetingAction(
    prevState: State,
    data: FormData
): Promise<State> {
    const parsedData = MeetingFormSchema.safeParse(
        buildMeetingFormData(data)
    );

    if (!parsedData.success) {
        return {
            errors: getFieldErrors(parsedData.error),
            message: 'Invalid form data',
        };
    }

    try {
        await addMeeting(parsedData.data);
    } catch (error) {
        console.error(error);
        return {
            message: 'An error occurred while adding the meeting',
        };
    }

    revalidatePath('/meetings');
    redirect('/meetings');
}

export async function updateMeetingAction(
    id: number,
    prevState: State,
    data: FormData
): Promise<State> {
    const parsedData = MeetingFormSchema.safeParse(
        buildMeetingFormData(data)
    );

    if (!parsedData.success) {
        return {
            errors: getFieldErrors(parsedData.error),
            message: 'Invalid form data',
        };
    }

    try {
        const meeting = await updateMeeting(id, parsedData.data);

        if (!meeting) {
            return {
                message: 'Meeting not found or could not be updated',
            };
        }
    } catch (error) {
        console.error(error);
        return {
            message: 'An error occurred while updating the meeting',
        };
    }

    revalidatePath('/meetings');
    redirect('/meetings');
}

export async function deleteMeetingAction(id: number): Promise<void> {
            const deleted = await deleteMeeting(id);

            if (!deleted) {
                throw new Error('Meeting not found or could not be deleted');
            }

    revalidatePath('/meetings');
}

