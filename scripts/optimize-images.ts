import { mkdir, readdir, readFile, rm, writeFile, rename, access } from "node:fs/promises";
import path from "node:path";
import sharp, { FitEnum } from "sharp";

type ResizeConfig = {
	width?: number;
	height?: number;
	fit: keyof FitEnum;
};

type OptimizationResult = {
	sourcePath: string;
	outputPath: string;
};

type EncodingConfig = {
	quality: number;
	alphaQuality: number;
	effort: number;
	lossless?: boolean;
};

const originalImageRootDirectoryPath = process.env.IMAGES_SOURCE_DIR
	? path.resolve(process.cwd(), process.env.IMAGES_SOURCE_DIR)
	: path.join(process.cwd(), "image-originals");
const optimizedImageRootDirectoryPath = path.join(process.cwd(), "public", "images");
const contentFilePaths = [
	path.join(process.cwd(), "content", "ambassadors.ts"),
	path.join(process.cwd(), "content", "header-photos.ts"),
	path.join(process.cwd(), "content", "world-events.ts"),
];

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const directoryResizeConfig: Record<string, ResizeConfig> = {
	ambassadors: { width: 224, height: 224, fit: "cover" },
	partners: { width: 640, height: 176, fit: "inside" },
	events: { fit: "inside" },
};
const defaultResizeConfig: ResizeConfig = { width: 2880, fit: "inside" };
const defaultEncodingConfig: EncodingConfig = {
	quality: 92,
	alphaQuality: 92,
	effort: 6,
};
const eventEncodingConfig: EncodingConfig = {
	quality: 98,
	alphaQuality: 100,
	effort: 6,
};
const flagEncodingConfig: EncodingConfig = {
	quality: 100,
	alphaQuality: 100,
	effort: 6,
	lossless: true,
};

async function collectImageFilePaths(directoryPath: string): Promise<string[]> {
	const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
	const nestedResults = await Promise.all(
		directoryEntries.map(async (directoryEntry) => {
			const directoryEntryPath = path.join(directoryPath, directoryEntry.name);
			if (directoryEntry.isDirectory()) {
				return collectImageFilePaths(directoryEntryPath);
			}

			const fileExtension = path.extname(directoryEntry.name).toLowerCase();
			if (imageExtensions.has(fileExtension)) {
				return [directoryEntryPath];
			}

			return [];
		}),
	);

	return nestedResults.flat();
}

function getResizeConfigForImage(imageFilePath: string): ResizeConfig {
	const relativeImagePath = path.relative(originalImageRootDirectoryPath, imageFilePath);
	const topLevelDirectory = relativeImagePath.split(path.sep)[0];

	return directoryResizeConfig[topLevelDirectory] ?? defaultResizeConfig;
}

function getEncodingConfigForImage(imageFilePath: string): EncodingConfig {
	const relativeImagePath = path.relative(originalImageRootDirectoryPath, imageFilePath).toLowerCase();
	const fileName = path.basename(relativeImagePath);

	if (relativeImagePath.startsWith(`events${path.sep}`) || relativeImagePath.startsWith("events/")) {
		if (fileName.includes("flag")) {
			return flagEncodingConfig;
		}
		return eventEncodingConfig;
	}

	return defaultEncodingConfig;
}

function buildWebpOutputFilePath(imageFilePath: string): string {
	const relativeImagePath = path.relative(originalImageRootDirectoryPath, imageFilePath);
	const relativeImagePathWithoutExtension = relativeImagePath.slice(0, -path.extname(relativeImagePath).length);
	return path.join(optimizedImageRootDirectoryPath, `${relativeImagePathWithoutExtension}.webp`);
}

async function optimizeImage(imageFilePath: string): Promise<OptimizationResult> {
	const resizeConfig = getResizeConfigForImage(imageFilePath);
	const encodingConfig = getEncodingConfigForImage(imageFilePath);
	const outputFilePath = buildWebpOutputFilePath(imageFilePath);
	const temporaryOutputFilePath = `${outputFilePath}.tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
	const imageProcessor = sharp(imageFilePath);

	await mkdir(path.dirname(outputFilePath), { recursive: true });

	await imageProcessor
		.rotate()
		.resize({
			width: resizeConfig.width,
			height: resizeConfig.height,
			fit: resizeConfig.fit,
			withoutEnlargement: true,
		})
		.webp(encodingConfig)
		.toFile(temporaryOutputFilePath);

	await rm(outputFilePath, { force: true });
	await rename(temporaryOutputFilePath, outputFilePath);

	return { sourcePath: imageFilePath, outputPath: outputFilePath };
}

async function updateContentReferences(): Promise<number> {
	let updatedFileCount = 0;

	for (const contentFilePath of contentFilePaths) {
		const fileContents = await readFile(contentFilePath, "utf8");
		const updatedFileContents = fileContents.replace(/(\/images\/[^"'`\s]+)\.(png|jpg|jpeg)\b/g, "$1.webp");

		if (updatedFileContents !== fileContents) {
			await writeFile(contentFilePath, updatedFileContents, "utf8");
			updatedFileCount += 1;
		}
	}

	return updatedFileCount;
}

async function run(): Promise<void> {
	try {
		await access(originalImageRootDirectoryPath);
	} catch {
		console.error(
			`Source image directory does not exist: ${path.relative(process.cwd(), originalImageRootDirectoryPath)}`,
		);
		console.error("Create it and place your original images there, preserving subfolders like events/.");
		process.exit(1);
	}

	const imageFilePaths = await collectImageFilePaths(originalImageRootDirectoryPath);

	if (imageFilePaths.length === 0) {
		console.log(`No source images found in ${path.relative(process.cwd(), originalImageRootDirectoryPath)}.`);
		return;
	}

	const optimizationResults = [];

	for (const imageFilePath of imageFilePaths) {
		const optimizationResult = await optimizeImage(imageFilePath);
		optimizationResults.push(optimizationResult);
		console.log(
			`Optimized ${path.relative(process.cwd(), optimizationResult.sourcePath)} -> ${path.relative(process.cwd(), optimizationResult.outputPath)}`,
		);
	}

	const updatedContentFileCount = await updateContentReferences();

	console.log(`Updated ${updatedContentFileCount} content file(s).`);
	console.log(`Optimized ${optimizationResults.length} image(s).`);
}

run().catch((error: unknown) => {
	console.error("Image optimization failed.");
	console.error(error);
	process.exit(1);
});
