import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
	title: "FUPREshop — Premium University Marketplace",
	description: "Your premier university marketplace. Discover quality products at great prices, from electronics to fashion, beauty, and home essentials.",
	keywords: ["FUPRE", "ecommerce", "university", "marketplace", "Nigeria"],
};

const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn("min-h-screen flex flex-col", playfairDisplay.className, dmSans.className)}>
				<div className="grain-overlay" />
				<Navbar />
				<main className="flex-1">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
