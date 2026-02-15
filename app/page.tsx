"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { productService, cartService } from "@/services/api";
import { useSession } from "@/lib/auth-client";

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	imageUrl: string;
	stock: number;
	category: string;
}

export default function HomePage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [addingId, setAddingId] = useState<string | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		productService
			.getAll()
			.then(setProducts)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const handleAddToCart = async (productId: string) => {
		if (!session?.user) {
			window.location.href = "/auth/login";
			return;
		}
		setAddingId(productId);
		try {
			await cartService.addToCart(productId, 1);
			window.dispatchEvent(new Event("cart-updated"));
		} catch (error) {
			console.error("Failed to add to cart:", error);
		} finally {
			setAddingId(null);
		}
	};

	return (
		<>
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				{/* Background decoration */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
					<div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-accent/3 blur-3xl" />
				</div>

				<div className="relative max-w-7xl mx-auto px-6 py-16 md:py-28">
					<div className="max-w-3xl animate-fade-in-up">
						<span className="inline-block px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent bg-accent-soft rounded-full mb-6">
							✦ Premium University Marketplace
						</span>
						<h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-6">
							Discover Products <span className="text-gradient italic">You&apos;ll Love</span>
						</h1>
						<p className="text-lg md:text-xl text-muted max-w-xl mb-10 leading-relaxed">
							From cutting-edge electronics to timeless fashion — curated for the discerning FUPRE student. Shop smarter, live better.
						</p>
						<div className="flex flex-wrap gap-4">
							<Link
								href="/products"
								className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover shadow-[0_4px_20px_rgba(200,144,74,0.35)] hover:shadow-[0_8px_30px_rgba(200,144,74,0.45)] transition-all duration-300 hover:-translate-y-0.5">
								Browse Collection
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</Link>
							<Link
								href="/about"
								className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-foreground border-2 border-border rounded-xl font-semibold text-sm hover:border-accent hover:text-accent transition-all duration-300">
								Learn More
							</Link>
						</div>
					</div>

					{/* Stats */}
					<div className="mt-16 pt-10 border-t border-border/50 grid grid-cols-3 gap-8 max-w-lg">
						{[
							{ value: "500+", label: "Products" },
							{ value: "2K+", label: "Happy Students" },
							{ value: "4.9★", label: "Average Rating" },
						].map((stat, i) => (
							<div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
								<div className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</div>
								<div className="text-xs text-muted uppercase tracking-wider mt-1">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="max-w-7xl mx-auto px-6 py-16">
				<div className="flex items-end justify-between mb-10">
					<div>
						<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-2 block">Featured</span>
						<h2 className="font-display text-3xl md:text-4xl font-bold">Trending Now</h2>
					</div>
					<Link href="/products" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
						View All
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</Link>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden">
								<div className="aspect-square animate-shimmer" />
								<div className="p-5 space-y-3">
									<div className="h-5 rounded-lg animate-shimmer w-3/4" />
									<div className="h-7 rounded-lg animate-shimmer w-1/2" />
									<div className="h-11 rounded-xl animate-shimmer" />
								</div>
							</div>
						))}
					</div>
				) : products.length === 0 ? (
					<div className="text-center py-20 animate-fade-in">
						<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent-soft flex items-center justify-center">
							<svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
						</div>
						<h3 className="font-display text-xl font-semibold mb-2">No Products Yet</h3>
						<p className="text-sm text-muted">Check back soon — we&apos;re stocking up!</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
						{products.map((p) => (
							<ProductCard key={p.id} {...p} onAddToCart={() => handleAddToCart(p.id)} loading={addingId === p.id} />
						))}
					</div>
				)}
			</section>

			{/* Categories Banner */}
			<section className="max-w-7xl mx-auto px-6 py-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					{[
						{
							title: "Electronics",
							desc: "Gadgets & tech essentials",
							color: "from-blue-900/80 to-blue-800/80",
							icon: "⚡",
						},
						{
							title: "Fashion",
							desc: "Style that speaks volumes",
							color: "from-rose-900/80 to-rose-800/80",
							icon: "👗",
						},
						{
							title: "Beauty",
							desc: "Glow up your routine",
							color: "from-amber-900/80 to-amber-800/80",
							icon: "✨",
						},
					].map((cat, i) => (
						<Link
							key={cat.title}
							href="/products"
							className="relative overflow-hidden rounded-2xl p-8 md:p-10 group animate-fade-in-up"
							style={{ animationDelay: `${i * 100}ms` }}>
							<div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
							<div className="relative z-10">
								<span className="text-4xl mb-4 block">{cat.icon}</span>
								<h3 className="font-display text-2xl font-bold text-white mb-1">{cat.title}</h3>
								<p className="text-sm text-white/70">{cat.desc}</p>
								<span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-white/80 uppercase tracking-wider group-hover:text-white transition-colors">
									Explore
									<svg
										className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</span>
							</div>
						</Link>
					))}
				</div>
			</section>
		</>
	);
}
