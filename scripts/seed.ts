import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { v4 as uuid } from "uuid";
import { product } from "../lib/db/schema";
import fs from "fs";
import path from "path";

const sqlite = new Database("sqlite.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite);

const PRODUCTS_DIR = path.join(process.cwd(), "public", "uploads", "products");

interface DummyProduct {
	id: number;
	title: string;
	description: string;
	price: number;
	stock: number;
	category: string;
	thumbnail: string;
}

/**
 * Downloads an image from a URL and saves it locally.
 */
async function downloadImage(url: string, filename: string): Promise<string> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to download image: ${url} (${res.status})`);
	}

	const buffer = Buffer.from(await res.arrayBuffer());
	const filePath = path.join(PRODUCTS_DIR, filename);
	fs.writeFileSync(filePath, buffer);

	return filename;
}

/**
 * Derives a clean filename from the product title.
 * e.g. "Essence Mascara Lash Princess" -> "essence-mascara-lash-princess.webp"
 */
function slugify(title: string, ext: string = ".webp"): string {
	return (
		title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "") + ext
	);
}

async function seed() {
	console.log("🌱 Seeding products from DummyJSON...\n");

	// Ensure the images directory exists
	fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

	// 1. Fetch 10 products from DummyJSON
	const response = await fetch("https://dummyjson.com/products?limit=10");
	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	const data = (await response.json()) as { products: DummyProduct[] };
	const apiProducts = data.products;

	console.log(`📦 Fetched ${apiProducts.length} products from API\n`);

	// 2. Process each product: download image + insert into DB
	for (const p of apiProducts) {
		const filename = slugify(p.title);

		// Download the thumbnail image
		console.log(`  ⬇️  Downloading image for "${p.title}"...`);
		await downloadImage(p.thumbnail, filename);
		console.log(`  ✅ Saved as ${filename}`);

		// Map to our product schema
		const productData = {
			id: uuid(),
			name: p.title,
			description: p.description,
			price: p.price,
			imageUrl: `/uploads/products/${filename}`,
			stock: p.stock,
			category: p.category,
			createdAt: new Date(),
		};

		await db.insert(product).values(productData).onConflictDoNothing();
		console.log(`  💾 Inserted "${p.title}" into database\n`);
	}

	console.log(`\n✅ Seeded ${apiProducts.length} products successfully!`);
	sqlite.close();
	process.exit(0);
}

seed().catch((e) => {
	console.error("❌ Seed failed:", e);
	sqlite.close();
	process.exit(1);
});
