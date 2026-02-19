import en from "./en.json";
import hr from "./hr.json";

export const localeBundles = {
	en,
	hr,
} as const;

export type LocaleBundleKey = keyof typeof localeBundles;
