"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productService, cartService } from "@/services/api";
import { useSession } from "@/lib/auth-client";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	imageUrl: string;
	stock: number;
	category: string;
}

export default function ProductDetailPage() {
	const { id } = useParams();
	const router = useRouter();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const [adding, setAdding] = useState(false);
	const { data: session } = useSession();

	useEffect(() => {
		if (id) {
			productService
				.getById(id as string)
				.then(setProduct)
				.catch(() => router.push("/products"))
				.finally(() => setLoading(false));
		}
	}, [id, router]);

	const formatPrice = (p: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(p);

	const handleAddToCart = async () => {
		if (!session?.user) {
			router.push("/auth/login");
			return;
		}
		setAdding(true);
		try {
			await cartService.addToCart(product!.id, quantity);
			window.dispatchEvent(new Event("cart-updated"));
			router.push("/cart");
		} catch (error) {
			console.error("Failed to add to cart:", error);
		} finally {
			setAdding(false);
		}
	};

	if (loading) {
		return (
			<div className="max-w-7xl mx-auto px-6 py-10">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					<div className="aspect-square rounded-2xl animate-shimmer" />
					<div className="space-y-4">
						<div className="h-8 rounded-lg animate-shimmer w-3/4" />
						<div className="h-10 rounded-lg animate-shimmer w-1/3" />
						<div className="h-24 rounded-lg animate-shimmer" />
						<div className="h-14 rounded-xl animate-shimmer w-1/2" />
					</div>
				</div>
			</div>
		);
	}

	if (!product) return null;

	return (
		<div className="max-w-7xl mx-auto px-6 py-10">
			{/* Breadcrumb */}
			<nav className="flex gap-2 text-xs text-muted mb-8 animate-fade-in">
				<Link href="/" className="hover:text-accent transition-colors">
					Home
				</Link>
				<span>/</span>
				<Link href="/products" className="hover:text-accent transition-colors">
					Products
				</Link>
				<span>/</span>
				<span className="text-foreground">{product.name}</span>
			</nav>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
				{/* Image */}
				<div className="animate-fade-in-up">
					<div className="relative aspect-square rounded-2xl overflow-hidden bg-surface border border-border">
						{product.imageUrl ? (
							<img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full flex items-center justify-center text-muted">
								<svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
						)}
						<span className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-white rounded-full backdrop-blur-sm">
							{product.category}
						</span>
					</div>
				</div>

				{/* Details */}
				<div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
					<h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

					<p className="text-3xl font-display font-bold text-accent mb-6">{formatPrice(product.price)}</p>

					<div className="flex items-center gap-3 mb-6">
						<span
							className={`
                px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider
                ${product.stock > 10 ? "bg-success/10 text-success" : product.stock > 0 ? "bg-amber-500/10 text-amber-600" : "bg-danger/10 text-danger"}
              `}>
							{product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
						</span>
					</div>

					<div className="border-t border-border pt-6 mb-8">
						<h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted mb-3">Description</h3>
						<p className="text-foreground/80 leading-relaxed">{product.description}</p>
					</div>

					{/* Quantity & Add to Cart */}
					{product.stock > 0 && (
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<span className="text-sm font-medium text-muted">Quantity:</span>
								<div className="flex items-center border border-border rounded-xl overflow-hidden">
									<button
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className="px-4 py-2.5 text-foreground hover:bg-surface-hover transition-colors cursor-pointer">
										−
									</button>
									<span className="px-5 py-2.5 font-semibold text-sm border-x border-border min-w-[50px] text-center">
										{quantity}
									</span>
									<button
										onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
										className="px-4 py-2.5 text-foreground hover:bg-surface-hover transition-colors cursor-pointer">
										+
									</button>
								</div>
							</div>

							<div className="flex gap-3">
								<Button size="lg" loading={adding} onClick={handleAddToCart} className="flex-1">
									Add to Cart — {formatPrice(product.price * quantity)}
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
