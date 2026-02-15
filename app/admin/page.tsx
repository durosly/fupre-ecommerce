"use client";

import { useEffect, useState } from "react";
import { productService, orderService } from "@/services/api";

export default function AdminDashboardPage() {
	const [stats, setStats] = useState({
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
		lowStock: 0,
	});
	const [loading, setLoading] = useState(true);

	const formatPrice = (p: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(p);

	useEffect(() => {
		Promise.all([productService.getAll(), orderService.getOrders()])
			.then(([products, orders]) => {
				setStats({
					totalProducts: products.length,
					totalOrders: orders.length,
					totalRevenue: orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0),
					lowStock: products.filter((p: any) => p.stock <= 5).length,
				});
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const cards = [
		{ label: "Total Products", value: stats.totalProducts.toString(), icon: "📦", color: "bg-blue-500/10 text-blue-600" },
		{ label: "Total Orders", value: stats.totalOrders.toString(), icon: "🛒", color: "bg-green-500/10 text-green-600" },
		{ label: "Revenue", value: formatPrice(stats.totalRevenue), icon: "💰", color: "bg-amber-500/10 text-amber-600" },
		{ label: "Low Stock Items", value: stats.lowStock.toString(), icon: "⚠️", color: "bg-red-500/10 text-red-600" },
	];

	return (
		<div>
			<div className="mb-8 animate-fade-in-up">
				<h1 className="font-display text-3xl font-bold">Dashboard</h1>
				<p className="text-sm text-muted mt-1">Overview of your FUPREshop store</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 stagger-children">
				{cards.map((card) => (
					<div key={card.label} className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/30 transition-all duration-300">
						{loading ? (
							<div className="space-y-3">
								<div className="h-10 w-10 rounded-xl animate-shimmer" />
								<div className="h-8 rounded-lg animate-shimmer w-1/2" />
								<div className="h-4 rounded-lg animate-shimmer w-3/4" />
							</div>
						) : (
							<>
								<div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center text-lg mb-3`}>
									{card.icon}
								</div>
								<div className="text-2xl font-display font-bold mb-1">{card.value}</div>
								<div className="text-xs text-muted uppercase tracking-wider">{card.label}</div>
							</>
						)}
					</div>
				))}
			</div>

			{/* Quick Actions */}
			<div className="bg-surface border border-border rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
				<h3 className="font-display text-lg font-semibold mb-4">Quick Actions</h3>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					{[
						{ label: "Add New Product", href: "/admin/products", icon: "➕" },
						{ label: "View Orders", href: "/admin/orders", icon: "📋" },
						{ label: "Check Inventory", href: "/admin/inventory", icon: "📊" },
					].map((action) => (
						<a
							key={action.label}
							href={action.href}
							className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-accent/30 hover:bg-surface-hover transition-all duration-200">
							<span className="text-xl">{action.icon}</span>
							<span className="text-sm font-medium">{action.label}</span>
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
