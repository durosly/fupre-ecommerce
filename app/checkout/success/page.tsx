"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId");

	return (
		<div className="max-w-lg mx-auto px-6 py-20 text-center animate-scale-in">
			{/* Success Check */}
			<div className="w-24 h-24 mx-auto mb-8 rounded-full bg-success/10 flex items-center justify-center">
				<svg className="w-12 h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
				</svg>
			</div>

			<h1 className="font-display text-3xl font-bold mb-3">Order Confirmed! 🎉</h1>
			<p className="text-muted mb-2">Thank you for your purchase. Your order has been placed successfully.</p>
			{orderId && (
				<p className="text-xs text-muted/80 mb-8">
					Order ID: <span className="font-mono text-foreground bg-surface-hover px-2 py-1 rounded-md">{orderId.slice(0, 8)}...</span>
				</p>
			)}

			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				<Link
					href="/products"
					className="px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover transition-all duration-300">
					Continue Shopping
				</Link>
				<Link
					href="/"
					className="px-6 py-3 bg-surface border border-border text-foreground rounded-xl font-semibold text-sm hover:bg-surface-hover transition-all duration-300">
					Go Home
				</Link>
			</div>
		</div>
	);
}

export default function SuccessPage() {
	return (
		<Suspense
			fallback={
				<div className="max-w-lg mx-auto px-6 py-20 text-center">
					<div className="h-24 w-24 mx-auto mb-8 rounded-full animate-shimmer" />
					<div className="h-8 rounded-lg animate-shimmer w-3/4 mx-auto mb-4" />
					<div className="h-4 rounded-lg animate-shimmer w-1/2 mx-auto" />
				</div>
			}>
			<SuccessContent />
		</Suspense>
	);
}
