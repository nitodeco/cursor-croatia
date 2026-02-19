import { HeaderPhoto } from "@/lib/types";

// REPLACE: Use real event/city images that represent your local community.
// This layout uses explicit grid coordinates (1-indexed) for deterministic placement.
// Desktop grid: 4 columns x 4 rows (16 cells).
export const headerPhotos: HeaderPhoto[] = [
	{
		src: "/images/events/01.webp",
		alt: "Cursor community event group photo",
		row: 1,
		col: 1,
		rowSpan: 2,
		colSpan: 2,
		mobile: { row: 1, col: 1, rowSpan: 2, colSpan: 2 },
	},
	{
		src: "/images/events/split.webp",
		alt: "Cursor meetup participants in Split",
		row: 1,
		col: 3,
		mobile: { row: 3, col: 1 },
	},
	{
		src: "/images/events/zagreb.webp",
		alt: "Cursor community photo from Zagreb",
		row: 1,
		col: 4,
		rowSpan: 2,
		mobile: { row: 5, col: 1 },
	},
	{
		src: "/images/events/03.webp",
		alt: "Cursor workshop moment during session",
		row: 2,
		col: 3,
		mobile: { row: 3, col: 2 },
	},
	{
		src: "/images/events/04.webp",
		alt: "Cursor meetup attendees in discussion",
		row: 3,
		col: 1,
		rowSpan: 2,
		mobile: { row: 5, col: 2 },
	},
	{
		src: "/images/events/flag.webp",
		alt: "Croatian flag at community event",
		row: 3,
		col: 2,
		rowSpan: 2,
		colSpan: 2,
		mobile: { row: 6, col: 1, colSpan: 2 },
	},
	{
		src: "/images/events/02.webp",
		alt: "Cursor event participants and speakers",
		row: 3,
		col: 4,
		rowSpan: 2,
		mobile: { row: 4, col: 1, colSpan: 2 },
	},
];
