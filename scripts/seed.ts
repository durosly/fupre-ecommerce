import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { v4 as uuid } from "uuid";
import { product } from "../lib/db/schema";

const sqlite = new Database("sqlite.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite);

async function seed() {
	console.log("🌱 Seeding products...");

	const demoProducts = [
		{
			id: uuid(),
			name: "Premium Wireless Headphones",
			description:
				"Immersive sound quality with active noise cancellation. Features 30-hour battery life, premium comfort padding, and seamless Bluetooth 5.2 connectivity for an unmatched listening experience.",
			price: 45000,
			imageUrl: "/uploads/products/headphones.jpg",
			stock: 25,
			category: "electronics",
			createdAt: new Date(),
		},
		{
			id: uuid(),
			name: "Leather Crossbody Bag",
			description:
				"Handcrafted genuine leather crossbody bag with adjustable strap. Features multiple compartments, magnetic closure, and a timeless design perfect for everyday use.",
			price: 32000,
			imageUrl: "/uploads/products/bag.jpg",
			stock: 15,
			category: "fashion",
			createdAt: new Date(),
		},
		{
			id: uuid(),
			name: "Smart Fitness Watch",
			description:
				"Track your health and fitness goals with this advanced smartwatch. Heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life in a sleek waterproof design.",
			price: 55000,
			imageUrl: "/uploads/products/watch.jpg",
			stock: 30,
			category: "electronics",
			createdAt: new Date(),
		},
		{
			id: uuid(),
			name: "Organic Face Serum",
			description:
				"Rejuvenate your skin with our all-natural vitamin C serum. Made with organic ingredients, this lightweight formula brightens, hydrates, and reduces fine lines for a radiant glow.",
			price: 12000,
			imageUrl: "/uploads/products/serum.jpg",
			stock: 50,
			category: "beauty",
			createdAt: new Date(),
		},
		{
			id: uuid(),
			name: "Mechanical Keyboard",
			description:
				"Professional-grade mechanical keyboard with Cherry MX Blue switches, RGB backlighting, and aircraft-grade aluminum body. Perfect for typing enthusiasts and gamers.",
			price: 38000,
			imageUrl: "/uploads/products/keyboard.jpg",
			stock: 20,
			category: "electronics",
			createdAt: new Date(),
		},
		{
			id: uuid(),
			name: "Running Sneakers Pro",
			description:
				"Engineered for performance with responsive cushioning and breathable mesh upper. Lightweight carbon-fiber plate for energy return. Available in multiple colorways.",
			price: 28000,
			imageUrl: "/uploads/products/sneakers.jpg",
			stock: 35,
			category: "fashion",
			createdAt: new Date(),
		},
		{
			id: uuid(),
			name: "Aromatherapy Candle Set",
			description:
				"Hand-poured soy wax candles in three calming scents: Lavender, Eucalyptus, and Vanilla. Burns for 40+ hours each. Perfect for relaxation and home ambiance.",
			price: 8500,
			imageUrl: "/uploads/products/candles.jpg",
			stock: 40,
			category: "home",
			createdAt: new Date(),
		},
		{
			id: uuid(),
			name: "Portable Bluetooth Speaker",
			description:
				"Compact yet powerful 20W speaker with 360-degree surround sound. Waterproof IPX7 rating, 12-hour playtime, and built-in microphone for hands-free calls.",
			price: 22000,
			imageUrl: "/uploads/products/speaker.jpg",
			stock: 30,
			category: "electronics",
			createdAt: new Date(),
		},
	];

	for (const p of demoProducts) {
		await db.insert(product).values(p).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${demoProducts.length} products`);
	sqlite.close();
	process.exit(0);
}

seed().catch((e) => {
	console.error("❌ Seed failed:", e);
	sqlite.close();
	process.exit(1);
});
