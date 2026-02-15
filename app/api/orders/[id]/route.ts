import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session || (session.user as any).role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await req.json();
		const { orderStatus, paymentStatus } = body;

		await db
			.update(order)
			.set({
				...(orderStatus && { orderStatus }),
				...(paymentStatus && { paymentStatus }),
			})
			.where(eq(order.id, id));

		const updated = await db.query.order.findFirst({
			where: eq(order.id, id),
			with: { items: { with: { product: true } }, user: true },
		});

		return NextResponse.json(updated);
	} catch (error) {
		return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
	}
}
