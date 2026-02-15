"use client";

import { useEffect, useState } from "react";
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

const categories = ["all", "electronics", "fashion", "beauty", "home", "general"];

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [addingId, setAddingId] = useState<string | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		productService
			.getAll()
			.then(setProducts)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const filtered = products.filter((p) => {
		const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
		const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

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
		<div className="max-w-7xl mx-auto px-6 py-10">
			{/* Header */}
			<div className="mb-10 animate-fade-in-up">
				<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-2 block">Collection</span>
				<h1 className="font-display text-4xl md:text-5xl font-bold mb-4">All Products</h1>
				<p className="text-muted max-w-lg">Browse our curated selection of premium products. Find exactly what you need.</p>
			</div>

			{/* Filters */}
			<div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
				{/* Search */}
				<div className="relative flex-1 max-w-md">
					<svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						type="text"
						placeholder="Search products..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm placeholder:text-muted/50 transition-all duration-200"
					/>
				</div>

				{/* Categories */}
				<div className="flex gap-2 flex-wrap">
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => setSelectedCategory(cat)}
							className={`
                px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider
                transition-all duration-200 cursor-pointer
                ${
			selectedCategory === cat
				? "bg-accent text-white shadow-[0_2px_8px_rgba(200,144,74,0.3)]"
				: "bg-surface border border-border text-muted hover:text-foreground hover:border-accent/30"
		}
              `}>
							{cat}
						</button>
					))}
				</div>
			</div>

			{/* Results count */}
			<p className="text-xs text-muted mb-6">
				Showing {filtered.length} of {products.length} products
			</p>

			{/* Products grid */}
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
			) : filtered.length === 0 ? (
				<div className="text-center py-20 animate-fade-in">
					<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent-soft flex items-center justify-center">
						<svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<h3 className="font-display text-xl font-semibold mb-2">No Products Found</h3>
					<p className="text-sm text-muted">Try adjusting your search or filters.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
					{filtered.map((p) => (
						<ProductCard key={p.id} {...p} onAddToCart={() => handleAddToCart(p.id)} loading={addingId === p.id} />
					))}
				</div>
			)}
		</div>
	);
}
