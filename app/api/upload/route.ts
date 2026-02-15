import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session || (session.user as any).role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			return NextResponse.json({ error: "Invalid file type. Allowed: jpg, png, webp" }, { status: 400 });
		}

		if (file.size > MAX_SIZE) {
			return NextResponse.json({ error: "File too large. Max size: 5MB" }, { status: 400 });
		}

		// Ensure upload directory exists
		if (!existsSync(UPLOAD_DIR)) {
			await mkdir(UPLOAD_DIR, { recursive: true });
		}

		const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
		const filename = `${uuid()}.${ext}`;
		const filePath = path.join(UPLOAD_DIR, filename);

		const bytes = await file.arrayBuffer();
		await writeFile(filePath, Buffer.from(bytes));

		const imageUrl = `/uploads/products/${filename}`;
		return NextResponse.json({ imageUrl }, { status: 201 });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}
