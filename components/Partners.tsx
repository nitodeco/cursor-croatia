"use client";

import React from "react";
import Image from "next/image";
import { partners } from "@/content/partners";
import { useI18n } from "@/lib/i18n";

export const Partners: React.FC = () => {
	const { t } = useI18n();

	if (partners.length === 0) {
		return null;
	}

	return (
		<div className="mb-8">
			<h3 className="text-xs uppercase tracking-wider text-cursor-text-muted font-medium mb-4">
				{t("footer.hostingPartners")}
			</h3>
			<div className="flex flex-wrap items-center gap-8 md:gap-10">
				{partners.map((partner) => (
					<a
						key={partner.name}
						href={partner.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={partner.name}
						className="flex h-12 w-40 items-center justify-center md:h-14 md:w-44 transition-transform duration-200 hover:-translate-y-0.5"
					>
						<div className="relative h-full w-full max-h-10 max-w-36 md:max-h-11 md:max-w-40">
							<Image
								src={partner.logo}
								alt={partner.name}
								fill
								className="object-contain"
								sizes="(max-width: 768px) 144px, 160px"
							/>
						</div>
					</a>
				))}
			</div>
		</div>
	);
};

export default Partners;
