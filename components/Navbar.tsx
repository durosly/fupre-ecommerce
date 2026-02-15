"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export default function Navbar() {
	const { data: session } = useSession();
	const pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [cartCount, setCartCount] = useState(0);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Fetch cart count
	useEffect(() => {
		if (session?.user) {
			fetch("/api/cart")
				.then((r) => r.json())
				.then((items) => {
					if (Array.isArray(items)) {
						setCartCount(items.reduce((a: number, b: any) => a + b.quantity, 0));
					}
				})
				.catch(() => {});
		} else {
			// Guest cart from localStorage
			try {
				const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
				setCartCount(guestCart.reduce((a: number, b: any) => a + (b.quantity || 0), 0));
			} catch {
				setCartCount(0);
			}
		}
	}, [session, pathname]);

	const isAdmin = session?.user && (session.user as any).role === "admin";

	const navLinks = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop" },
		{ href: "/about", label: "About" },
		{ href: "/contact", label: "Contact" },
	];

	return (
		<>
			<nav
				className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          ${scrolled ? "bg-surface/90 backdrop-blur-xl shadow-[0_1px_0_var(--border-color)] py-3" : "bg-transparent py-5"}
        `}>
				<div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 group">
						<div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-display font-bold text-lg shadow-[0_2px_8px_rgba(200,144,74,0.4)] group-hover:shadow-[0_4px_16px_rgba(200,144,74,0.5)] transition-shadow duration-300">
							F
						</div>
						<span className="font-display text-xl font-bold tracking-tight text-foreground">
							FUPRE<span className="text-accent">shop</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-8">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`
                  text-sm font-medium transition-colors duration-200 relative
                  ${pathname === link.href ? "text-accent" : "text-muted hover:text-foreground"}
                `}>
								{link.label}
								{pathname === link.href && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />}
							</Link>
						))}
					</div>

					{/* Right Side */}
					<div className="flex items-center gap-3">
						{/* Cart */}
						<Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-surface-hover transition-colors duration-200">
							<svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								/>
							</svg>
							{cartCount > 0 && (
								<span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
									{cartCount}
								</span>
							)}
						</Link>

						{/* Auth */}
						{session?.user ? (
							<div className="flex items-center gap-2">
								{isAdmin && (
									<Link
										href="/admin"
										className="hidden md:block text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-accent-soft text-accent rounded-xl hover:bg-accent hover:text-white transition-all duration-300">
										Admin
									</Link>
								)}
								<button
									onClick={() => signOut()}
									className="text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer px-3 py-2">
									Sign Out
								</button>
							</div>
						) : (
							<Link
								href="/auth/login"
								className="text-sm font-semibold px-5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent-hover shadow-[0_2px_8px_rgba(200,144,74,0.3)] transition-all duration-300">
								Sign In
							</Link>
						)}

						{/* Mobile Menu */}
						<button
							onClick={() => setMobileOpen(!mobileOpen)}
							className="md:hidden p-2 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								{mobileOpen ? (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileOpen && (
					<div className="md:hidden absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-border animate-fade-in">
						<div className="px-6 py-4 flex flex-col gap-3">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setMobileOpen(false)}
									className={`
                    text-sm font-medium py-2 transition-colors
                    ${pathname === link.href ? "text-accent" : "text-muted"}
                  `}>
									{link.label}
								</Link>
							))}
							{isAdmin && (
								<Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 text-accent">
									Admin Dashboard
								</Link>
							)}
						</div>
					</div>
				)}
			</nav>

			{/* Spacer */}
			<div className="h-20" />
		</>
	);
}
