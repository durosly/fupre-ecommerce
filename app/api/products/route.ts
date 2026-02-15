import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
	try {
		const products = await db.select().from(product).orderBy(product.createdAt);
		return NextResponse.json(products);
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session || (session.user as any).role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { name, description, price, imageUrl, stock, category } = body;

		if (!name || !description || price == null || !imageUrl) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		const newProduct = {
			id: uuid(),
			name,
			description,
			price: Number(price),
			imageUrl,
			stock: Number(stock) || 0,
			category: category || "general",
			createdAt: new Date(),
		};

		await db.insert(product).values(newProduct);
		return NextResponse.json(newProduct, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
	}
}
