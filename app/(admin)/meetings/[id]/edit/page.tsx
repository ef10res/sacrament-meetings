
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { updateMeetingAction, type State } from '@/app/lib/actions';
import type { SacramentMeeting } from '@/app/lib/types';

const initialState: State = {
    errors: {},
    message: null,
};

const inputStyle =
    'mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const labelStyle = 'block text-sm font-semibold text-slate-700';
const errorStyle = 'mt-1 text-sm text-red-600';
const sectionStyle =
    'rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8';

export default function EditMeetingPage() {
    const params = useParams<{ id: string }>();
    const meetingId = Number(params.id);

    const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const updateMeetingWithId = updateMeetingAction.bind(null, meetingId);

    const [state, formAction, isPending] = useActionState(
        updateMeetingWithId,
        initialState
    );

    useEffect(() => {
        if (!Number.isSafeInteger(meetingId) || meetingId <= 0) {
            return;
        }

        let cancelled = false;

        async function loadMeeting() {
            try {
                const response = await fetch(`/api/meetings/${meetingId}`);

                if (!response.ok) {
                    throw new Error('Meeting not found or could not be loaded');
                }

                const data: SacramentMeeting = await response.json();

                if (!cancelled) {
                    setMeeting(data);
                }
            } catch (error) {
                if (!cancelled) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : 'Could not load meeting'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadMeeting();

        return () => {
            cancelled = true;
        };
    }, [meetingId]);

    if (!Number.isSafeInteger(meetingId) || meetingId <= 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <p role="alert" className="rounded-xl bg-white p-8 text-red-600 shadow-sm">
                    Invalid meeting ID.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-lg font-medium text-slate-600">
                    Loading meeting...
                </p>
            </div>
        );
    }

    if (loadError || !meeting) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <p role="alert" className="rounded-xl bg-white p-8 text-red-600 shadow-sm">
                    {loadError || 'Meeting not found'}
                </p>
            </div>
        );
    }

    const fieldError = (name: string) =>
        state.errors?.[name]?.join(', ');

    const speakerErrors = Object.entries(state.errors ?? {})
        .filter(([key]) => key === 'speakers' || key.startsWith('speakers.'))
        .flatMap(([, messages]) => messages)
        .join(', ');

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Edit Sacrament Meeting
                    </h1>
                    <p className="mt-3 text-slate-500">
                        Update the details of your sacrament meeting.
                    </p>
                </div>

                <form action={formAction} key={meeting.id} className="space-y-6">

                    {/* Meeting Information */}
                    <section className={sectionStyle}>
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Meeting Information
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Basic information about the meeting.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="date" className={labelStyle}>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    aria-describedby="dateHelp"
                                    defaultValue={meeting.date}
                                    className={inputStyle}
                                    required
                                />
                                <p id="dateHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('date')}
                                </p>
                            </div>

                            <div>
                                <label htmlFor="meetingType" className={labelStyle}>
                                    Meeting Type
                                </label>
                                <select
                                    id="meetingType"
                                    name="meetingType"
                                    aria-describedby="meetingTypeHelp"
                                    defaultValue={meeting.meetingType}
                                    className={inputStyle}
                                    required
                                >
                                    <option value="">Select a meeting type</option>
                                    <option value="testimony">Testimony</option>
                                    <option value="regular">Regular</option>
                                    <option value="stake">Stake</option>
                                    <option value="general">General</option>
                                </select>
                                <p id="meetingTypeHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('meetingType')}
                                </p>
                            </div>

                            <div>
                                <label htmlFor="presiding" className={labelStyle}>
                                    Presiding
                                </label>
                                <input
                                    type="text"
                                    id="presiding"
                                    name="presiding"
                                    placeholder="e.g. Bishop Gutierrez"
                                    aria-describedby="presidingHelp"
                                    defaultValue={meeting.presiding}
                                    className={inputStyle}
                                    required
                                />
                                <p id="presidingHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('presiding')}
                                </p>
                            </div>

                            <div>
                                <label htmlFor="conducting" className={labelStyle}>
                                    Conducting
                                </label>
                                <input
                                    type="text"
                                    id="conducting"
                                    name="conducting"
                                    placeholder="e.g. Brother Paulsen"
                                    aria-describedby="conductingHelp"
                                    defaultValue={meeting.conducting}
                                    className={inputStyle}
                                    required
                                />
                                <p id="conductingHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('conducting')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Opening */}
                    <section className={sectionStyle}>
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Opening
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Opening hymn and prayer.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                            <div>
                                <label htmlFor="openingHymn.number" className={labelStyle}>
                                    Hymn Number
                                </label>
                                <input
                                    type="number"
                                    id="openingHymn.number"
                                    name="openingHymn.number"
                                    placeholder="201"
                                    aria-describedby="openingHymnNumberHelp"
                                    defaultValue={meeting.openingHymn.number}
                                    className={inputStyle}
                                    required
                                />
                                <p id="openingHymnNumberHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('openingHymn.number')}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="openingHymn.title" className={labelStyle}>
                                    Hymn Title
                                </label>
                                <input
                                    type="text"
                                    id="openingHymn.title"
                                    name="openingHymn.title"
                                    placeholder="Joy to the World"
                                    aria-describedby="openingHymnTitleHelp"
                                    defaultValue={meeting.openingHymn.title}
                                    className={inputStyle}
                                    required
                                />
                                <p id="openingHymnTitleHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('openingHymn.title')}
                                </p>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="openingPrayer" className={labelStyle}>
                                    Opening Prayer
                                </label>
                                <input
                                    type="text"
                                    id="openingPrayer"
                                    name="openingPrayer"
                                    placeholder="Name of person offering the prayer"
                                    aria-describedby="openingPrayerHelp"
                                    defaultValue={meeting.openingPrayer}
                                    className={inputStyle}
                                    required
                                />
                                <p id="openingPrayerHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('openingPrayer')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Announcements and Business */}
                    <section className={sectionStyle}>
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Announcements & Business
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Update announcements and ward or stake business.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="announcements" className={labelStyle}>
                                    Announcements
                                </label>
                                <textarea
                                    id="announcements"
                                    name="announcements"
                                    rows={3}
                                    placeholder="Enter one announcement per line..."
                                    aria-describedby="announcementsHelp"
                                    defaultValue={meeting.announcements?.join('\n')}
                                    className={inputStyle}
                                />
                                <p id="announcementsHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('announcements')}
                                </p>
                            </div>

                            <div>
                                <label htmlFor="wardBusiness" className={labelStyle}>
                                    Ward Business
                                </label>
                                <textarea
                                    id="wardBusiness"
                                    name="wardBusiness"
                                    rows={3}
                                    placeholder="Enter one ward business item per line..."
                                    aria-describedby="wardBusinessHelp"
                                    defaultValue={meeting.wardBusiness
                                        .map(item => item.description)
                                        .join('\n')}
                                    className={inputStyle}
                                />
                                <p id="wardBusinessHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('wardBusiness')}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <label
                                    htmlFor="stakeBusiness"
                                    className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700"
                                >
                                    <input
                                        type="checkbox"
                                        id="stakeBusiness"
                                        name="stakeBusiness"
                                        aria-describedby="stakeBusinessHelp"
                                        defaultChecked={meeting.stakeBusiness}
                                        className="h-5 w-5 rounded border-slate-300 accent-blue-600"
                                    />
                                    Include Stake Business
                                </label>
                                <p id="stakeBusinessHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('stakeBusiness')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Sacrament */}
                    <section className={sectionStyle}>
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Sacrament
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Sacrament hymn information.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                            <div>
                                <label htmlFor="sacramentHymn.number" className={labelStyle}>
                                    Hymn Number
                                </label>
                                <input
                                    type="number"
                                    id="sacramentHymn.number"
                                    name="sacramentHymn.number"
                                    placeholder="169"
                                    aria-describedby="sacramentHymnNumberHelp"
                                    defaultValue={meeting.sacramentHymn.number}
                                    className={inputStyle}
                                    required
                                />
                                <p id="sacramentHymnNumberHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('sacramentHymn.number')}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="sacramentHymn.title" className={labelStyle}>
                                    Hymn Title
                                </label>
                                <input
                                    type="text"
                                    id="sacramentHymn.title"
                                    name="sacramentHymn.title"
                                    placeholder="In Remembrance of Thy Suffering"
                                    aria-describedby="sacramentHymnTitleHelp"
                                    defaultValue={meeting.sacramentHymn.title}
                                    className={inputStyle}
                                    required
                                />
                                <p id="sacramentHymnTitleHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('sacramentHymn.title')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Speakers */}
                    <section className={sectionStyle}>
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Speakers
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Update the speakers and their assigned topics.
                            </p>
                        </div>

                        <label htmlFor="speakers" className={labelStyle}>
                            Speaker Details
                        </label>
                        <textarea
                            id="speakers"
                            name="speakers"
                            rows={4}
                            placeholder={'Sister Tipiani - Living Christ - speaker\nBrother Cunha - Christ Birth - speaker'}
                            aria-describedby="speakersHelp"
                            defaultValue={meeting.speakers
                                .map(item => `${item.name} - ${item.topic} - ${item.type}`)
                                .join('\n')}
                            className={inputStyle}
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            Format: Name - Topic - speaker (one per line)
                        </p>
                        <p id="speakersHelp" aria-live="polite" className={errorStyle}>
                            {speakerErrors}
                        </p>
                    </section>

                    {/* Closing */}
                    <section className={sectionStyle}>
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Closing
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Closing hymn and prayer.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                            <div>
                                <label htmlFor="closingHymn.number" className={labelStyle}>
                                    Hymn Number
                                </label>
                                <input
                                    type="number"
                                    id="closingHymn.number"
                                    name="closingHymn.number"
                                    placeholder="204"
                                    aria-describedby="closingHymnNumberHelp"
                                    defaultValue={meeting.closingHymn.number}
                                    className={inputStyle}
                                    required
                                />
                                <p id="closingHymnNumberHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('closingHymn.number')}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="closingHymn.title" className={labelStyle}>
                                    Hymn Title
                                </label>
                                <input
                                    type="text"
                                    id="closingHymn.title"
                                    name="closingHymn.title"
                                    placeholder="Silent Night"
                                    aria-describedby="closingHymnTitleHelp"
                                    defaultValue={meeting.closingHymn.title}
                                    className={inputStyle}
                                    required
                                />
                                <p id="closingHymnTitleHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('closingHymn.title')}
                                </p>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="closingPrayer" className={labelStyle}>
                                    Closing Prayer
                                </label>
                                <input
                                    type="text"
                                    id="closingPrayer"
                                    name="closingPrayer"
                                    placeholder="Name of person offering the prayer"
                                    aria-describedby="closingPrayerHelp"
                                    defaultValue={meeting.closingPrayer}
                                    className={inputStyle}
                                    required
                                />
                                <p id="closingPrayerHelp" aria-live="polite" className={errorStyle}>
                                    {fieldError('closingPrayer')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        {state.message && (
                            <p role="status" aria-live="polite" className="mb-4 text-sm text-red-600">
                                {state.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            id="updateMeeting"
                            disabled={isPending}
                            className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? 'Updating Meeting...' : 'Update Meeting'}
                        </button>

                        <p className="mt-3 text-center text-xs text-slate-400">
                            Review your changes before saving.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
