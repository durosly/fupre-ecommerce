import { db } from "@/lib/db";
import { cartItem, product } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Unauthorized");
	return session;
}

export async function GET() {
	try {
		const session = await getSession();
		const items = await db.query.cartItem.findMany({
			where: eq(cartItem.userId, session.user.id),
			with: { product: true },
		});
		return NextResponse.json(items);
	} catch {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await getSession();
		const { productId, quantity = 1 } = await req.json();

		if (!productId) {
			return NextResponse.json({ error: "Product ID required" }, { status: 400 });
		}

		// Check if product exists and has stock
		const prod = await db.select().from(product).where(eq(product.id, productId)).limit(1);
		if (!prod.length) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}
		if (prod[0].stock < quantity) {
			return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
		}

		// Check if item already in cart
		const existing = await db
			.select()
			.from(cartItem)
			.where(and(eq(cartItem.userId, session.user.id), eq(cartItem.productId, productId)))
			.limit(1);

		if (existing.length) {
			const newQty = existing[0].quantity + quantity;
			if (newQty > prod[0].stock) {
				return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
			}
			await db.update(cartItem).set({ quantity: newQty }).where(eq(cartItem.id, existing[0].id));
			return NextResponse.json({ ...existing[0], quantity: newQty });
		}

		const item = {
			id: uuid(),
			userId: session.user.id,
			productId,
			quantity,
		};
		await db.insert(cartItem).values(item);
		return NextResponse.json(item, { status: 201 });
	} catch {
		return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const session = await getSession();
		const { itemId, quantity } = await req.json();

		if (!itemId || quantity == null) {
			return NextResponse.json({ error: "Item ID and quantity required" }, { status: 400 });
		}

		if (quantity <= 0) {
			await db.delete(cartItem).where(and(eq(cartItem.id, itemId), eq(cartItem.userId, session.user.id)));
			return NextResponse.json({ message: "Item removed" });
		}

		await db
			.update(cartItem)
			.set({ quantity })
			.where(and(eq(cartItem.id, itemId), eq(cartItem.userId, session.user.id)));

		return NextResponse.json({ message: "Cart updated" });
	} catch {
		return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const session = await getSession();
		const { searchParams } = new URL(req.url);
		const itemId = searchParams.get("itemId");

		if (itemId) {
			await db.delete(cartItem).where(and(eq(cartItem.id, itemId), eq(cartItem.userId, session.user.id)));
		} else {
			await db.delete(cartItem).where(eq(cartItem.userId, session.user.id));
		}

		return NextResponse.json({ message: "Removed from cart" });
	} catch {
		return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
	}
}
