"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { siDiscord } from "simple-icons";
import BentoGrid from "@/components/BentoGrid";
import EventCountdown from "@/components/EventCountdown";
import LanguageToggle from "@/components/LanguageToggle";
import { headerPhotos } from "@/content/header-photos";
import { siteConfig } from "@/content/site.config";
import { useI18n } from "@/lib/i18n";
import { useNextEventCountdown, formatCountdownValue } from "@/lib/useNextEventCountdown";

const CompactCountdown: React.FC = () => {
	const { countdownValues } = useNextEventCountdown();

	if (!countdownValues) return null;

	const segments = [
		{ value: countdownValues.days, label: "d" },
		{ value: countdownValues.hours, label: "h" },
		{ value: countdownValues.minutes, label: "m" },
		{ value: countdownValues.seconds, label: "s" },
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: -8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -8 }}
			transition={{ duration: 0.2 }}
			className="flex flex-nowrap items-center gap-1.5 whitespace-nowrap text-[clamp(0.65rem,1.6vw,0.875rem)] tabular-nums text-cursor-text-secondary"
		>
			{segments.map((segment) => (
				<span key={segment.label} className="inline-flex items-baseline whitespace-nowrap">
					<span className="font-medium text-cursor-text">{formatCountdownValue(segment.value)}</span>
					<span className="text-cursor-text-muted">{segment.label}</span>
				</span>
			))}
		</motion.div>
	);
};

const DiscordIcon: React.FC = () => {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
			<path d={siDiscord.path} fill="currentColor" />
		</svg>
	);
};

export const HeroHeader: React.FC = () => {
	const { t } = useI18n();
	const { nextEvent } = useNextEventCountdown();
	const countdownRef = useRef<HTMLDivElement>(null);
	const [heroCountdownVisible, setHeroCountdownVisible] = useState(true);
	const [isClientRendered, setIsClientRendered] = useState(false);

	const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
		const entry = entries.at(0);

		if (entry) {
			setHeroCountdownVisible(entry.isIntersecting);
		}
	}, []);

	useEffect(() => {
		setIsClientRendered(true);
	}, []);

	useEffect(() => {
		const target = countdownRef.current;
		if (!target) return;

		const observer = new IntersectionObserver(handleIntersection, {
			threshold: 0.5,
		});

		observer.observe(target);

		return () => {
			observer.disconnect();
		};
	}, [handleIntersection]);

	const showCompactCountdown = isClientRendered && !!nextEvent && !heroCountdownVisible;

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center gap-4 px-4 py-6 sm:px-6 md:px-12 md:py-8 lg:px-16 bg-cursor-bg/90 backdrop-blur-md border-b border-cursor-border">
				<div className="flex items-center gap-3 min-w-0">
					<Image
						src="/cursor-logo.svg"
						alt="Cursor"
						width={128}
						height={48}
						priority
						className="h-6 md:h-8 w-auto shrink-0"
					/>
					<span className="font-cursor text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-cursor-text truncate">
						{siteConfig.communityName}
						{siteConfig.communityNameLocal ? (
							<span className="hidden sm:inline font-cursor font-normal tracking-wide text-lg md:text-xl lg:text-2xl text-cursor-text-secondary ml-1">
								{siteConfig.communityNameLocal}
							</span>
						) : null}
					</span>
				</div>
				<div className="flex items-center gap-3 md:gap-6 shrink-0">
					<AnimatePresence>{showCompactCountdown && <CompactCountdown />}</AnimatePresence>
					<a
						href={siteConfig.discordUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center p-2 rounded border border-cursor-border text-cursor-text-muted hover:text-cursor-text hover:border-cursor-border-emphasis transition-colors"
						aria-label="Join our Discord"
					>
						<DiscordIcon />
					</a>
					<LanguageToggle />
				</div>
			</nav>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="h-svh flex flex-col pt-[76px] md:pt-[88px]"
			>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="flex-1 min-h-0 overflow-hidden"
					style={{
						maskImage: "linear-gradient(to bottom, black 85%, transparent)",
						WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent)",
					}}
				>
					<div className="relative h-full">
						<BentoGrid photos={headerPhotos} cols={4} rows={4} mobileCols={2} mobileRows={4} />
						<div ref={countdownRef} className="absolute inset-0 z-10 flex items-center justify-center px-4">
							{isClientRendered ? <EventCountdown /> : null}
						</div>
					</div>
				</motion.div>
			</motion.div>
		</>
	);
};

export default HeroHeader;
