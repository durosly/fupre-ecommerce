"use client";

import { useEffect, useState } from "react";
import { productService, uploadService } from "@/services/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	imageUrl: string;
	stock: number;
	category: string;
}

const emptyProduct = {
	name: "",
	description: "",
	price: "",
	stock: "",
	category: "general",
	imageUrl: "",
};

export default function AdminProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editing, setEditing] = useState<Product | null>(null);
	const [form, setForm] = useState(emptyProduct);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [deleting, setDeleting] = useState<string | null>(null);

	const fetchProducts = () => {
		productService
			.getAll()
			.then(setProducts)
			.catch(console.error)
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const openCreate = () => {
		setEditing(null);
		setForm(emptyProduct);
		setImageFile(null);
		setShowModal(true);
	};

	const openEdit = (p: Product) => {
		setEditing(p);
		setForm({
			name: p.name,
			description: p.description,
			price: p.price.toString(),
			stock: p.stock.toString(),
			category: p.category,
			imageUrl: p.imageUrl,
		});
		setImageFile(null);
		setShowModal(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			let imageUrl = form.imageUrl;

			if (imageFile) {
				const upload = await uploadService.upload(imageFile);
				imageUrl = upload.imageUrl;
			}

			const data = {
				name: form.name,
				description: form.description,
				price: Number(form.price),
				stock: Number(form.stock),
				category: form.category,
				imageUrl,
			};

			if (editing) {
				await productService.update(editing.id, data);
			} else {
				await productService.create(data);
			}

			setShowModal(false);
			fetchProducts();
		} catch (error) {
			console.error("Failed to save product:", error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this product?")) return;
		setDeleting(id);
		try {
			await productService.delete(id);
			setProducts(products.filter((p) => p.id !== id));
		} catch (error) {
			console.error("Failed to delete:", error);
		} finally {
			setDeleting(null);
		}
	};

	const formatPrice = (p: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(p);

	return (
		<div>
			<div className="flex items-center justify-between mb-8 animate-fade-in-up">
				<div>
					<h1 className="font-display text-3xl font-bold">Products</h1>
					<p className="text-sm text-muted mt-1">Manage your product catalog</p>
				</div>
				<Button onClick={openCreate}>+ Add Product</Button>
			</div>

			{/* Products Table */}
			<div className="bg-surface border border-border rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "100ms" }}>
				{loading ? (
					<div className="p-6 space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="h-16 rounded-xl animate-shimmer" />
						))}
					</div>
				) : products.length === 0 ? (
					<div className="p-12 text-center">
						<p className="text-muted mb-4">No products yet.</p>
						<Button onClick={openCreate}>Create First Product</Button>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border text-left">
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Product</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Category</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Price</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Stock</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
								</tr>
							</thead>
							<tbody>
								{products.map((p) => (
									<tr
										key={p.id}
										className={`border-b border-border/50 hover:bg-surface-hover transition-colors ${
											deleting === p.id ? "opacity-50" : ""
										}`}>
										<td className="px-5 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-hover shrink-0">
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
												<span className="font-medium text-sm truncate max-w-[200px]">{p.name}</span>
											</div>
										</td>
										<td className="px-5 py-4">
											<span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-accent-soft text-accent rounded-full">
												{p.category}
											</span>
										</td>
										<td className="px-5 py-4 text-sm font-medium">{formatPrice(p.price)}</td>
										<td className="px-5 py-4">
											<span
												className={`text-sm font-medium ${
													p.stock <= 5
														? "text-danger"
														: p.stock <= 20
															? "text-amber-600"
															: "text-success"
												}`}>
												{p.stock}
											</span>
										</td>
										<td className="px-5 py-4">
											<div className="flex gap-2">
												<button
													onClick={() => openEdit(p)}
													className="px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent-soft rounded-lg transition-colors cursor-pointer">
													Edit
												</button>
												<button
													onClick={() => handleDelete(p.id)}
													className="px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer">
													Delete
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
					<div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl p-7 animate-scale-in max-h-[90vh] overflow-y-auto">
						<h3 className="font-display text-xl font-semibold mb-6">{editing ? "Edit Product" : "Create Product"}</h3>

						<form onSubmit={handleSubmit} className="space-y-4">
							<Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-muted">Description</label>
								<textarea
									value={form.description}
									onChange={(e) => setForm({ ...form, description: e.target.value })}
									rows={3}
									required
									className="w-full px-4 py-3 bg-surface text-foreground border border-border rounded-xl text-sm placeholder:text-muted/60 transition-all duration-200 resize-none"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<Input
									label="Price (₦)"
									type="number"
									step="0.01"
									value={form.price}
									onChange={(e) => setForm({ ...form, price: e.target.value })}
									required
								/>
								<Input
									label="Stock"
									type="number"
									value={form.stock}
									onChange={(e) => setForm({ ...form, stock: e.target.value })}
									required
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-muted">Category</label>
								<select
									value={form.category}
									onChange={(e) => setForm({ ...form, category: e.target.value })}
									className="w-full px-4 py-3 bg-surface text-foreground border border-border rounded-xl text-sm transition-all duration-200">
									{["general", "electronics", "fashion", "beauty", "home"].map((c) => (
										<option key={c} value={c}>
											{c.charAt(0).toUpperCase() + c.slice(1)}
										</option>
									))}
								</select>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-muted">Product Image</label>
								<input
									type="file"
									accept="image/jpeg,image/png,image/webp"
									onChange={(e) => setImageFile(e.target.files?.[0] || null)}
									className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent-soft file:text-accent hover:file:bg-accent hover:file:text-white file:transition-colors file:cursor-pointer"
								/>
								{form.imageUrl && !imageFile && <p className="text-xs text-muted">Current: {form.imageUrl}</p>}
							</div>

							<div className="flex gap-3 pt-3">
								<Button type="submit" loading={submitting} className="flex-1">
									{editing ? "Update Product" : "Create Product"}
								</Button>
								<Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
									Cancel
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
