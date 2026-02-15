"use client";

import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
	id: string;
	name: string;
	price: number;
	imageUrl: string;
	stock: number;
	category: string;
	onAddToCart?: () => void;
	loading?: boolean;
}

export default function ProductCard({ id, name, price, imageUrl, stock, category, onAddToCart, loading }: ProductCardProps) {
	const formatPrice = (p: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(p);

	return (
		<div className="group relative bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:border-accent/30 hover:-translate-y-1">
			{/* Image */}
			<Link href={`/products/${id}`} className="block relative aspect-square overflow-hidden bg-surface-hover">
				<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
				{imageUrl ? (
					<img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
				) : (
					<div className="w-full h-full flex items-center justify-center text-muted">
						<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				)}

				{/* Category badge */}
				<span className="absolute top-3 left-3 z-20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-white rounded-full backdrop-blur-sm">
					{category}
				</span>

				{/* Stock indicator */}
				{stock <= 5 && stock > 0 && (
					<span className="absolute top-3 right-3 z-20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-danger/90 text-white rounded-full">
						{stock} left
					</span>
				)}
				{stock === 0 && (
					<div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
						<span className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-black/70 rounded-full">Out of Stock</span>
					</div>
				)}
			</Link>

			{/* Info */}
			<div className="p-5">
				<Link href={`/products/${id}`}>
					<h3 className="font-display text-lg font-semibold text-foreground mb-1 truncate group-hover:text-accent transition-colors duration-300">
						{name}
					</h3>
				</Link>
				<p className="text-xl font-bold text-accent mb-4 font-display">{formatPrice(price)}</p>

				{/* Add to Cart */}
				<button
					onClick={(e) => {
						e.preventDefault();
						onAddToCart?.();
					}}
					disabled={stock === 0 || loading}
					className={`
            w-full py-3 rounded-xl text-sm font-semibold
            transition-all duration-300 cursor-pointer
            ${
			stock === 0
				? "bg-surface-hover text-muted cursor-not-allowed"
				: "bg-accent text-white hover:bg-accent-hover shadow-[0_2px_12px_rgba(200,144,74,0.3)] hover:shadow-[0_4px_20px_rgba(200,144,74,0.4)] active:scale-[0.98]"
		}
            ${loading ? "animate-pulse-soft" : ""}
          `}>
					{loading ? "Adding..." : stock === 0 ? "Out of Stock" : "Add to Cart"}
				</button>
			</div>
		</div>
	);
}
