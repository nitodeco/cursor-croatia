"use client";

import { useEffect, useMemo, useState } from "react";
import { upcomingEvents } from "@/content/events";

export type CountdownValues = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

export type NextEventInfo = {
	id: string;
	title: string;
	location: string;
	date: string;
	lumaUrl?: string;
	targetDate: Date;
};

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function calculateCountdownValues(targetDate: Date): CountdownValues | null {
	const remaining = targetDate.getTime() - Date.now();

	if (remaining <= 0) {
		return null;
	}

	return {
		days: Math.floor(remaining / DAY_MS),
		hours: Math.floor((remaining % DAY_MS) / HOUR_MS),
		minutes: Math.floor((remaining % HOUR_MS) / MINUTE_MS),
		seconds: Math.floor((remaining % MINUTE_MS) / SECOND_MS),
	};
}

export function formatCountdownValue(value: number) {
	return value.toString().padStart(2, "0");
}

export function useNextEventCountdown() {
	const [isMounted, setIsMounted] = useState(false);

	const nextEvent = useMemo<NextEventInfo | null>(() => {
		if (!isMounted) return null;

		const now = Date.now();
		const candidates = upcomingEvents
			.map((event) => ({
				id: event.id,
				title: event.title,
				location: event.location,
				date: event.date,
				lumaUrl: event.lumaUrl,
				targetDate: new Date(`${event.date}T00:00:00`),
			}))
			.filter((candidate) => candidate.targetDate.getTime() > now)
			.sort((first, second) => first.targetDate.getTime() - second.targetDate.getTime());

		return candidates[0] ?? null;
	}, [isMounted]);

	const [countdownValues, setCountdownValues] = useState<CountdownValues | null>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted || !nextEvent) {
			setCountdownValues(null);
			return;
		}

		const update = () => {
			setCountdownValues(calculateCountdownValues(nextEvent.targetDate));
		};

		update();
		const intervalId = window.setInterval(update, SECOND_MS);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [nextEvent, isMounted]);

	return { nextEvent, countdownValues };
}
