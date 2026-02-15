"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/api";

interface OrderItem {
	id: string;
	quantity: number;
	price: number;
	product: { name: string; imageUrl: string };
}

interface Order {
	id: string;
	userId: string;
	totalAmount: number;
	paymentMethod: string;
	paymentStatus: string;
	orderStatus: string;
	billingName: string;
	billingEmail: string;
	billingAddress: string;
	billingCity: string;
	billingPhone: string;
	createdAt: string;
	items: OrderItem[];
	user?: { name: string; email: string };
}

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [updating, setUpdating] = useState(false);

	const formatPrice = (p: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(p);

	useEffect(() => {
		orderService
			.getOrders()
			.then(setOrders)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const handleStatusUpdate = async (orderId: string, field: string, value: string) => {
		setUpdating(true);
		try {
			const updated = await orderService.updateOrder(orderId, { [field]: value });
			setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
			if (selectedOrder?.id === orderId) setSelectedOrder(updated);
		} catch (error) {
			console.error("Failed to update:", error);
		} finally {
			setUpdating(false);
		}
	};

	const statusColor = (status: string) => {
		switch (status) {
			case "paid":
			case "delivered":
				return "bg-success/10 text-success";
			case "processing":
			case "pending":
				return "bg-amber-500/10 text-amber-600";
			case "shipped":
				return "bg-blue-500/10 text-blue-600";
			default:
				return "bg-surface-hover text-muted";
		}
	};

	return (
		<div>
			<div className="mb-8 animate-fade-in-up">
				<h1 className="font-display text-3xl font-bold">Orders</h1>
				<p className="text-sm text-muted mt-1">Manage customer orders</p>
			</div>

			<div className="bg-surface border border-border rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "100ms" }}>
				{loading ? (
					<div className="p-6 space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="h-16 rounded-xl animate-shimmer" />
						))}
					</div>
				) : orders.length === 0 ? (
					<div className="p-12 text-center">
						<p className="text-muted">No orders yet.</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border text-left">
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Order</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Customer</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Amount</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Payment</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
									<th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Actions</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((o) => (
									<tr key={o.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
										<td className="px-5 py-4">
											<span className="text-sm font-mono">#{o.id.slice(0, 8)}</span>
										</td>
										<td className="px-5 py-4">
											<div>
												<p className="text-sm font-medium">{o.billingName}</p>
												<p className="text-xs text-muted">{o.billingEmail}</p>
											</div>
										</td>
										<td className="px-5 py-4 text-sm font-medium">{formatPrice(o.totalAmount)}</td>
										<td className="px-5 py-4">
											<span
												className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${statusColor(o.paymentStatus)}`}>
												{o.paymentStatus}
											</span>
										</td>
										<td className="px-5 py-4">
											<span
												className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${statusColor(o.orderStatus)}`}>
												{o.orderStatus}
											</span>
										</td>
										<td className="px-5 py-4">
											<button
												onClick={() => setSelectedOrder(o)}
												className="px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent-soft rounded-lg transition-colors cursor-pointer">
												View
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Order Detail Modal */}
			{selectedOrder && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
					<div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl p-7 animate-scale-in max-h-[90vh] overflow-y-auto">
						<h3 className="font-display text-xl font-semibold mb-1">Order #{selectedOrder.id.slice(0, 8)}</h3>
						<p className="text-xs text-muted mb-6">
							{new Date(selectedOrder.createdAt).toLocaleDateString("en-NG", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>

						{/* Customer Info */}
						<div className="bg-surface-hover rounded-xl p-4 mb-5">
							<h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Customer Details</h4>
							<p className="text-sm font-medium">{selectedOrder.billingName}</p>
							<p className="text-xs text-muted">{selectedOrder.billingEmail}</p>
							<p className="text-xs text-muted">{selectedOrder.billingPhone}</p>
							<p className="text-xs text-muted">
								{selectedOrder.billingAddress}, {selectedOrder.billingCity}
							</p>
						</div>

						{/* Items */}
						<div className="mb-5">
							<h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Items</h4>
							<div className="space-y-2">
								{selectedOrder.items.map((item) => (
									<div key={item.id} className="flex justify-between items-center text-sm">
										<span>
											{item.product?.name || "Product"} × {item.quantity}
										</span>
										<span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
									</div>
								))}
								<div className="border-t border-border pt-2 flex justify-between font-semibold">
									<span>Total</span>
									<span className="text-accent">{formatPrice(selectedOrder.totalAmount)}</span>
								</div>
							</div>
						</div>

						{/* Status Updates */}
						<div className="space-y-3 mb-6">
							<div>
								<label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">Order Status</label>
								<select
									value={selectedOrder.orderStatus}
									onChange={(e) => handleStatusUpdate(selectedOrder.id, "orderStatus", e.target.value)}
									disabled={updating}
									className="w-full px-4 py-2.5 bg-surface text-foreground border border-border rounded-xl text-sm transition-all duration-200">
									<option value="processing">Processing</option>
									<option value="shipped">Shipped</option>
									<option value="delivered">Delivered</option>
								</select>
							</div>
							<div>
								<label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">Payment Status</label>
								<select
									value={selectedOrder.paymentStatus}
									onChange={(e) => handleStatusUpdate(selectedOrder.id, "paymentStatus", e.target.value)}
									disabled={updating}
									className="w-full px-4 py-2.5 bg-surface text-foreground border border-border rounded-xl text-sm transition-all duration-200">
									<option value="pending">Pending</option>
									<option value="paid">Paid</option>
								</select>
							</div>
						</div>

						<button
							onClick={() => setSelectedOrder(null)}
							className="w-full py-3 bg-surface-hover text-foreground rounded-xl text-sm font-medium hover:bg-border transition-colors cursor-pointer">
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
