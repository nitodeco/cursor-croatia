import { CursorEvent } from "@/lib/types";

export const events: CursorEvent[] = [
	{
		id: "cursor-meetup-split-kickoff",
		title: "Cursor Meetup Croatia - Community Kick-off",
		date: "2026-03-03",
		displayDate: "March 3, 2026",
		location: "Technology Park Split, Split",
		lumaUrl: "https://luma.com/1xmnuu3i",
		status: "upcoming",
	},
	{
		id: "cursor-hackathon-zagreb",
		title: "Cursor Hackathon Zagreb",
		date: "2026-03-28",
		displayDate: "March 28, 2026",
		location: "Microblink Office, Zagreb",
		lumaUrl: "https://luma.com/zaqqtxf9",
		status: "upcoming",
	}
];

export const upcomingEvents = events.filter((event) => event.status === "upcoming");
export const pastEvents = events.filter((event) => event.status === "past");
