"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/api";
import Button from "@/components/ui/Button";

interface Product {
	id: string;
	name: string;
	price: number;
	imageUrl: string;
	stock: number;
	category: string;
}

export default function AdminInventoryPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingStock, setEditingStock] = useState<{ id: string; stock: number } | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		productService
			.getAll()
			.then(setProducts)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const handleSaveStock = async () => {
		if (!editingStock) return;
		setSaving(true);
		try {
			await productService.update(editingStock.id, { stock: editingStock.stock });
			setProducts(products.map((p) => (p.id === editingStock.id ? { ...p, stock: editingStock.stock } : p)));
			setEditingStock(null);
		} catch (error) {
			console.error("Failed to update stock:", error);
		} finally {
			setSaving(false);
		}
	};

	const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
	const lowStockProducts = products.filter((p) => p.stock <= 5);
	const outOfStock = products.filter((p) => p.stock === 0);

	return (
		<div>
			<div className="mb-8 animate-fade-in-up">
				<h1 className="font-display text-3xl font-bold">Inventory</h1>
				<p className="text-sm text-muted mt-1">Track and update product stock levels</p>
			</div>

			{/* Summary */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 stagger-children">
				{[
					{ label: "Total Stock", value: totalStock, icon: "📊", color: "text-foreground" },
					{ label: "Low Stock", value: lowStockProducts.length, icon: "⚠️", color: "text-amber-600" },
					{ label: "Out of Stock", value: outOfStock.length, icon: "❌", color: "text-danger" },
				].map((stat) => (
					<div key={stat.label} className="bg-surface border border-border rounded-2xl p-5">
						<span className="text-2xl block mb-2">{stat.icon}</span>
						<div className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</div>
						<div className="text-xs text-muted uppercase tracking-wider mt-1">{stat.label}</div>
					</div>
				))}
			</div>

			{/* Inventory Table */}
			<div className="bg-surface border border-border rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "300ms" }}>
				{loading ? (
					<div className="p-6 space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="h-14 rounded-xl animate-shimmer" />
						))}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border text-left">
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Product</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Category</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Stock</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
								</tr>
							</thead>
							<tbody>
								{products.map((p) => (
									<tr key={p.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
										<td className="px-5 py-4">
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 rounded-lg overflow-hidden bg-surface-hover shrink-0">
													{p.imageUrl ? (
														<img
															src={p.imageUrl}
															alt={p.name}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full bg-surface-hover" />
													)}
												</div>
												<span className="text-sm font-medium truncate max-w-[200px]">{p.name}</span>
											</div>
										</td>
										<td className="px-5 py-4">
											<span className="text-xs text-muted uppercase tracking-wider">{p.category}</span>
										</td>
										<td className="px-5 py-4">
											{editingStock?.id === p.id ? (
												<input
													type="number"
													min="0"
													value={editingStock.stock}
													onChange={(e) =>
														setEditingStock({ id: p.id, stock: parseInt(e.target.value) || 0 })
													}
													className="w-20 px-3 py-1.5 bg-surface border border-accent rounded-lg text-sm"
													autoFocus
												/>
											) : (
												<span
													className={`text-sm font-semibold ${
														p.stock === 0
															? "text-danger"
															: p.stock <= 5
																? "text-amber-600"
																: "text-foreground"
													}`}>
													{p.stock}
												</span>
											)}
										</td>
										<td className="px-5 py-4">
											<span
												className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
													p.stock === 0
														? "bg-danger/10 text-danger"
														: p.stock <= 5
															? "bg-amber-500/10 text-amber-600"
															: "bg-success/10 text-success"
												}`}>
												{p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? "Low Stock" : "In Stock"}
											</span>
										</td>
										<td className="px-5 py-4">
											{editingStock?.id === p.id ? (
												<div className="flex gap-2">
													<Button size="sm" onClick={handleSaveStock} loading={saving}>
														Save
													</Button>
													<Button size="sm" variant="ghost" onClick={() => setEditingStock(null)}>
														Cancel
													</Button>
												</div>
											) : (
												<button
													onClick={() => setEditingStock({ id: p.id, stock: p.stock })}
													className="px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent-soft rounded-lg transition-colors cursor-pointer">
													Update
												</button>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
