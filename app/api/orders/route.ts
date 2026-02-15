import { db } from "@/lib/db";
import { order, orderItem, cartItem, product } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
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
		const isAdmin = (session.user as any).role === "admin";

		let orders;
		if (isAdmin) {
			orders = await db.query.order.findMany({
				with: { items: { with: { product: true } }, user: true },
				orderBy: (o, { desc }) => [desc(o.createdAt)],
			});
		} else {
			orders = await db.query.order.findMany({
				where: eq(order.userId, session.user.id),
				with: { items: { with: { product: true } } },
				orderBy: (o, { desc }) => [desc(o.createdAt)],
			});
		}

		return NextResponse.json(orders);
	} catch {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await getSession();
		const body = await req.json();
		const { paymentMethod, billingName, billingEmail, billingAddress, billingCity, billingPhone } = body;

		if (!paymentMethod || !billingName || !billingEmail || !billingAddress || !billingCity || !billingPhone) {
			return NextResponse.json({ error: "Missing billing details" }, { status: 400 });
		}

		// Get cart items
		const items = await db.query.cartItem.findMany({
			where: eq(cartItem.userId, session.user.id),
			with: { product: true },
		});

		if (!items.length) {
			return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
		}

		// Calculate total and validate stock
		let totalAmount = 0;
		for (const item of items) {
			if (item.product.stock < item.quantity) {
				return NextResponse.json({ error: `Insufficient stock for ${item.product.name}` }, { status: 400 });
			}
			totalAmount += item.product.price * item.quantity;
		}

		// Create order
		const orderId = uuid();
		const paymentStatus = paymentMethod === "pay_on_delivery" ? "pending" : "paid";

		await db.insert(order).values({
			id: orderId,
			userId: session.user.id,
			totalAmount,
			paymentMethod,
			paymentStatus,
			orderStatus: "processing",
			billingName,
			billingEmail,
			billingAddress,
			billingCity,
			billingPhone,
			createdAt: new Date(),
		});

		// Create order items and reduce stock
		for (const item of items) {
			await db.insert(orderItem).values({
				id: uuid(),
				orderId,
				productId: item.productId,
				quantity: item.quantity,
				price: item.product.price,
			});

			await db
				.update(product)
				.set({ stock: item.product.stock - item.quantity })
				.where(eq(product.id, item.productId));
		}

		// Clear cart
		await db.delete(cartItem).where(eq(cartItem.userId, session.user.id));

		return NextResponse.json({ orderId, totalAmount, paymentStatus }, { status: 201 });
	} catch (error) {
		console.error("Checkout error:", error);
		return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
	}
}
