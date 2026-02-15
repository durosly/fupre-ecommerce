"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cartService } from "@/services/api";
import { useSession } from "@/lib/auth-client";
import Button from "@/components/ui/Button";

interface CartItemWithProduct {
	id: string;
	productId: string;
	quantity: number;
	product: {
		id: string;
		name: string;
		price: number;
		imageUrl: string;
		stock: number;
	};
}

export default function CartPage() {
	const [items, setItems] = useState<CartItemWithProduct[]>([]);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState<string | null>(null);
	const { data: session } = useSession();

	const fetchCart = () => {
		if (!session?.user) {
			setLoading(false);
			return;
		}
		cartService
			.getCart()
			.then(setItems)
			.catch(console.error)
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchCart();
	}, [session]);

	const formatPrice = (p: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(p);

	const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

	const handleUpdateQty = async (itemId: string, qty: number) => {
		setUpdating(itemId);
		try {
			if (qty <= 0) {
				await cartService.removeItem(itemId);
				setItems(items.filter((i) => i.id !== itemId));
			} else {
				await cartService.updateQuantity(itemId, qty);
				setItems(items.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i)));
			}
			window.dispatchEvent(new Event("cart-updated"));
		} catch (error) {
			console.error(error);
		} finally {
			setUpdating(null);
		}
	};

	const handleRemove = async (itemId: string) => {
		setUpdating(itemId);
		try {
			await cartService.removeItem(itemId);
			setItems(items.filter((i) => i.id !== itemId));
			window.dispatchEvent(new Event("cart-updated"));
		} catch (error) {
			console.error(error);
		} finally {
			setUpdating(null);
		}
	};

	if (!session?.user) {
		return (
			<div className="max-w-4xl mx-auto px-6 py-20 text-center animate-fade-in">
				<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent-soft flex items-center justify-center">
					<svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
					</svg>
				</div>
				<h2 className="font-display text-2xl font-bold mb-3">Sign In to View Cart</h2>
				<p className="text-muted mb-6">Please sign in to manage your shopping cart.</p>
				<Link
					href="/auth/login"
					className="inline-flex px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover transition-all duration-300">
					Sign In
				</Link>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="h-28 rounded-2xl animate-shimmer" />
				))}
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-6 py-10">
			<div className="mb-8 animate-fade-in-up">
				<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-2 block">Your Cart</span>
				<h1 className="font-display text-4xl font-bold">Shopping Cart</h1>
			</div>

			{items.length === 0 ? (
				<div className="text-center py-20 animate-fade-in">
					<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent-soft flex items-center justify-center">
						<svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
					</div>
					<h3 className="font-display text-xl font-semibold mb-2">Your Cart is Empty</h3>
					<p className="text-sm text-muted mb-6">Start shopping to fill it up!</p>
					<Link
						href="/products"
						className="inline-flex px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover transition-all duration-300">
						Browse Products
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-4 stagger-children">
						{items.map((item) => (
							<div
								key={item.id}
								className={`
                  flex gap-4 p-4 bg-surface border border-border rounded-2xl
                  transition-all duration-300
                  ${updating === item.id ? "opacity-60" : ""}
                `}>
								{/* Image */}
								<Link href={`/products/${item.productId}`} className="shrink-0">
									<div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-hover">
										{item.product.imageUrl ? (
											<img
												src={item.product.imageUrl}
												alt={item.product.name}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-muted text-xs">
												No img
											</div>
										)}
									</div>
								</Link>

								{/* Details */}
								<div className="flex-1 min-w-0">
									<Link href={`/products/${item.productId}`}>
										<h3 className="font-display font-semibold text-foreground truncate hover:text-accent transition-colors">
											{item.product.name}
										</h3>
									</Link>
									<p className="text-accent font-display font-bold mt-1">{formatPrice(item.product.price)}</p>

									<div className="flex items-center justify-between mt-3">
										{/* Quantity */}
										<div className="flex items-center border border-border rounded-lg overflow-hidden">
											<button
												onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
												className="px-3 py-1.5 text-xs hover:bg-surface-hover transition-colors cursor-pointer">
												−
											</button>
											<span className="px-3 py-1.5 text-xs font-semibold border-x border-border">
												{item.quantity}
											</span>
											<button
												onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
												disabled={item.quantity >= item.product.stock}
												className="px-3 py-1.5 text-xs hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50">
												+
											</button>
										</div>

										{/* Subtotal & Remove */}
										<div className="flex items-center gap-3">
											<span className="text-sm font-semibold">
												{formatPrice(item.product.price * item.quantity)}
											</span>
											<button
												onClick={() => handleRemove(item.id)}
												className="p-1.5 text-muted hover:text-danger transition-colors cursor-pointer"
												title="Remove">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Order Summary */}
					<div className="animate-slide-in-right">
						<div className="bg-surface border border-border rounded-2xl p-6 sticky top-24">
							<h3 className="font-display text-lg font-semibold mb-6">Order Summary</h3>

							<div className="space-y-3 mb-6">
								<div className="flex justify-between text-sm">
									<span className="text-muted">Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
									<span className="font-medium">{formatPrice(total)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted">Delivery</span>
									<span className="text-success font-medium">Free</span>
								</div>
								<div className="border-t border-border pt-3 flex justify-between">
									<span className="font-display font-semibold">Total</span>
									<span className="font-display text-xl font-bold text-accent">{formatPrice(total)}</span>
								</div>
							</div>

							<Link href="/checkout">
								<Button className="w-full" size="lg">
									Proceed to Checkout
								</Button>
							</Link>

							<Link href="/products" className="block text-center text-xs text-muted hover:text-accent mt-4 transition-colors">
								Continue Shopping
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
