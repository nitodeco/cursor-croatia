"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useNextEventCountdown, formatCountdownValue } from "@/lib/useNextEventCountdown";

export const EventCountdown: React.FC = () => {
	const { locale, t } = useI18n();
	const { nextEvent, countdownValues } = useNextEventCountdown();

	if (!nextEvent || !countdownValues) {
		return null;
	}

	const formattedEventDate = nextEvent.targetDate.toLocaleDateString(locale === "en" ? "en-US" : locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const countdownItems = [
		{ value: countdownValues.days, label: t("countdown.days") },
		{ value: countdownValues.hours, label: t("countdown.hours") },
		{ value: countdownValues.minutes, label: t("countdown.minutes") },
		{ value: countdownValues.seconds, label: t("countdown.seconds") },
	];

	const getNumberSizeClassName = (formattedValue: string): string => {
		if (formattedValue.length >= 4) {
			return "text-base sm:text-xl md:text-2xl lg:text-3xl";
		}
		if (formattedValue.length === 3) {
			return "text-lg sm:text-2xl md:text-3xl lg:text-4xl";
		}
		return "text-xl sm:text-2xl md:text-4xl lg:text-5xl";
	};

	return (
		<div className="w-full max-w-3xl">
			<div className="rounded-lg border border-cursor-border bg-cursor-bg p-6 shadow-2xl md:p-8">
				<div className="text-center">
					<p className="text-xl font-medium text-cursor-text md:text-2xl">{nextEvent.title}</p>
					<p className="mt-2 text-sm text-cursor-text-muted">
						{formattedEventDate}
						<span className="mx-2 text-cursor-text-faint">&middot;</span>
						{nextEvent.location}
					</p>
				</div>

				<div className="mt-6 grid grid-cols-4 gap-2 md:gap-4">
					{countdownItems.map((countdownItem) => {
						const formattedValue = formatCountdownValue(countdownItem.value);
						const numberSizeClassName = getNumberSizeClassName(formattedValue);

						return (
							<div
								key={countdownItem.label}
								className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-md border border-cursor-border bg-cursor-surface px-2 py-5"
							>
								<p
									className={`m-0 w-full whitespace-nowrap text-center font-medium leading-none text-cursor-text tabular-nums ${numberSizeClassName}`}
								>
									{formattedValue}
								</p>
								<p className="m-0 text-center text-[0.6rem] uppercase tracking-wider text-cursor-text-muted sm:text-xs sm:tracking-widest">
									{countdownItem.label}
								</p>
							</div>
						);
					})}
				</div>

				{nextEvent.lumaUrl ? (
					<div className="mt-6 flex justify-center">
						<a
							href={nextEvent.lumaUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors bg-cursor-text text-cursor-bg hover:bg-cursor-text-secondary"
						>
							{t("home.register")}
							<ExternalLink className="size-4 shrink-0" aria-hidden />
						</a>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default EventCountdown;
