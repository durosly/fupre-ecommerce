"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

const adminLinks = [
	{ href: "/admin", label: "Dashboard", icon: "📊" },
	{ href: "/admin/products", label: "Products", icon: "📦" },
	{ href: "/admin/orders", label: "Orders", icon: "🛒" },
	{ href: "/admin/inventory", label: "Inventory", icon: "📋" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const { data: session, isPending } = useSession();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!isPending && (!session?.user || (session.user as any).role !== "admin")) {
			router.push("/");
		}
	}, [session, isPending, router]);

	if (isPending) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!session?.user || (session.user as any).role !== "admin") {
		return null;
	}

	return (
		<div className="max-w-7xl mx-auto px-6 py-8">
			<div className="flex flex-col lg:flex-row gap-8">
				{/* Sidebar */}
				<aside className="lg:w-56 shrink-0">
					<div className="bg-surface border border-border rounded-2xl p-4 lg:sticky lg:top-24">
						<h3 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-muted px-3 mb-3">Admin Panel</h3>
						<nav className="space-y-1">
							{adminLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${pathname === link.href ? "bg-accent text-white shadow-[0_2px_8px_rgba(200,144,74,0.3)]" : "text-muted hover:text-foreground hover:bg-surface-hover"}
                  `}>
									<span>{link.icon}</span>
									{link.label}
								</Link>
							))}
						</nav>
					</div>
				</aside>

				{/* Main Content */}
				<main className="flex-1 min-w-0">{children}</main>
			</div>
		</div>
	);
}
