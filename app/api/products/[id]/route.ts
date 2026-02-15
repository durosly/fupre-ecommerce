import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const p = await db.select().from(product).where(eq(product.id, id)).limit(1);
		if (!p.length) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}
		return NextResponse.json(p[0]);
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
	}
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session || (session.user as any).role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await req.json();
		const { name, description, price, imageUrl, stock, category } = body;

		await db
			.update(product)
			.set({
				...(name && { name }),
				...(description && { description }),
				...(price != null && { price: Number(price) }),
				...(imageUrl && { imageUrl }),
				...(stock != null && { stock: Number(stock) }),
				...(category && { category }),
			})
			.where(eq(product.id, id));

		const updated = await db.select().from(product).where(eq(product.id, id)).limit(1);
		return NextResponse.json(updated[0]);
	} catch (error) {
		return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session || (session.user as any).role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		await db.delete(product).where(eq(product.id, id));
		return NextResponse.json({ message: "Product deleted" });
	} catch (error) {
		return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
	}
}
