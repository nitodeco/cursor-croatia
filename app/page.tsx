"use client";

import React from "react";
import { motion } from "framer-motion";
import { siDiscord } from "simple-icons";
import HeroHeader from "@/components/HeroHeader";
import AmbassadorSection from "@/components/AmbassadorSection";
import UpcomingEvents from "@/components/UpcomingEvents";
import PastEvents from "@/components/PastEvents";
import Partners from "@/components/Partners";
import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/content/site.config";
import { upcomingEvents } from "@/content/events";
import { useI18n } from "@/lib/i18n";

function buildHomeJsonLd() {
	const org = {
		"@type": "Organization",
		name: siteConfig.communityName,
		url: siteConfig.cursorCommunityUrl,
	};

	const eventItems = upcomingEvents.map((event) => ({
		"@type": "Event",
		name: event.title,
		startDate: event.date,
		location: {
			"@type": "Place",
			name: event.location,
		},
		organizer: org,
		...(event.lumaUrl ? { url: event.lumaUrl } : {}),
		eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
		eventStatus: "https://schema.org/EventScheduled",
	}));

	return {
		"@context": "https://schema.org",
		"@graph": [org, ...eventItems],
	};
}

const DiscordIcon: React.FC = () => {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
			<path d={siDiscord.path} fill="currentColor" />
		</svg>
	);
};

const DiscordSection: React.FC = () => {
	const { t } = useI18n();

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5 }}
			className="mb-12 w-full"
		>
			<div className="rounded-md border border-cursor-border bg-cursor-bg-dark p-5 md:p-6">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0">
						<h2 className="text-sm md:text-base font-medium text-cursor-text">{t("discord.title")}</h2>
						<p className="mt-2 text-sm text-cursor-text-muted">{t("discord.description")}</p>
					</div>
					<div className="rounded border border-cursor-border p-2 text-cursor-text-muted">
						<DiscordIcon />
					</div>
				</div>
				<a
					href={siteConfig.discordUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-4 inline-flex items-center justify-center rounded border border-cursor-border-emphasis px-4 py-2 text-sm font-medium text-cursor-text hover:text-cursor-text-muted transition-colors"
				>
					{t("discord.join")}
				</a>
			</div>
		</motion.section>
	);
};

export const Home: React.FC = () => {
	const { t } = useI18n();

	return (
		<main className="min-h-screen bg-cursor-bg text-cursor-text">
			<JsonLd data={buildHomeJsonLd()} />
			<HeroHeader />

			<div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
				<UpcomingEvents />
				<DiscordSection />
				<AmbassadorSection />
				<PastEvents />

				<motion.footer
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true, margin: "-50px" }}
					transition={{ duration: 0.5 }}
					className="mt-24 pt-8 border-t border-cursor-border text-center"
				>
					<Partners />
					<p className="text-cursor-text-muted text-sm mb-3">{siteConfig.footerTagline || t("footer.madeWith")}</p>
					<div className="flex items-center justify-center gap-4">
						<a
							href={siteConfig.lumaUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-cursor-text hover:text-cursor-text-muted transition-colors text-sm"
						>
							{t("footer.allEvents")}
						</a>
						<span className="text-cursor-text-faint">·</span>
						<a
							href={siteConfig.cursorCommunityUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-cursor-text hover:text-cursor-text-muted transition-colors text-sm"
						>
							{t("footer.community")}
						</a>
					</div>
				</motion.footer>
			</div>
		</main>
	);
};

export default Home;
