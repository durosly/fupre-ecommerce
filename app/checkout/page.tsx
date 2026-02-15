"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cartService, orderService } from "@/services/api";
import { useSession } from "@/lib/auth-client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CartItemWithProduct {
	id: string;
	productId: string;
	quantity: number;
	product: {
		id: string;
		name: string;
		price: number;
		imageUrl: string;
	};
}

export default function CheckoutPage() {
	const router = useRouter();
	const { data: session } = useSession();
	const [items, setItems] = useState<CartItemWithProduct[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const [paymentMethod, setPaymentMethod] = useState("card");
	const [form, setForm] = useState({
		billingName: "",
		billingEmail: "",
		billingAddress: "",
		billingCity: "",
		billingPhone: "",
	});

	useEffect(() => {
		if (!session?.user) {
			router.push("/auth/login");
			return;
		}
		cartService
			.getCart()
			.then((data: CartItemWithProduct[]) => {
				if (!data.length) {
					router.push("/cart");
					return;
				}
				setItems(data);
				setForm((f) => ({
					...f,
					billingName: session.user.name || "",
					billingEmail: session.user.email || "",
				}));
			})
			.catch(() => router.push("/cart"))
			.finally(() => setLoading(false));
	}, [session, router]);

	const formatPrice = (p: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(p);

	const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!form.billingName || !form.billingEmail || !form.billingAddress || !form.billingCity || !form.billingPhone) {
			setError("Please fill in all billing details.");
			return;
		}

		setSubmitting(true);
		try {
			const result = await orderService.checkout({
				paymentMethod,
				...form,
			});
			router.push(`/checkout/success?orderId=${result.orderId}`);
		} catch (err: any) {
			setError(err.response?.data?.error || "Checkout failed. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const updateForm = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-16 rounded-xl animate-shimmer" />
				))}
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto px-6 py-10">
			<div className="mb-8 animate-fade-in-up">
				<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-2 block">Checkout</span>
				<h1 className="font-display text-4xl font-bold">Complete Your Order</h1>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left — Form */}
					<div className="lg:col-span-2 space-y-8 animate-fade-in-up">
						{/* Billing Details */}
						<div className="bg-surface border border-border rounded-2xl p-6">
							<h3 className="font-display text-lg font-semibold mb-5">Billing Details</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Input
									label="Full Name"
									value={form.billingName}
									onChange={(e) => updateForm("billingName", e.target.value)}
									required
								/>
								<Input
									label="Email"
									type="email"
									value={form.billingEmail}
									onChange={(e) => updateForm("billingEmail", e.target.value)}
									required
								/>
								<Input
									label="Phone Number"
									type="tel"
									value={form.billingPhone}
									onChange={(e) => updateForm("billingPhone", e.target.value)}
									placeholder="+234..."
									required
								/>
								<Input label="City" value={form.billingCity} onChange={(e) => updateForm("billingCity", e.target.value)} required />
								<div className="sm:col-span-2">
									<Input
										label="Delivery Address"
										value={form.billingAddress}
										onChange={(e) => updateForm("billingAddress", e.target.value)}
										placeholder="Enter your full delivery address"
										required
									/>
								</div>
							</div>
						</div>

						{/* Payment Method */}
						<div className="bg-surface border border-border rounded-2xl p-6">
							<h3 className="font-display text-lg font-semibold mb-5">Payment Method</h3>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								{[
									{ value: "card", label: "Card (Dummy)", icon: "💳" },
									{ value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
									{ value: "pay_on_delivery", label: "Pay on Delivery", icon: "🚚" },
								].map((method) => (
									<button
										key={method.value}
										type="button"
										onClick={() => setPaymentMethod(method.value)}
										className={`
                      p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
                      ${paymentMethod === method.value ? "border-accent bg-accent-soft" : "border-border hover:border-accent/30"}
                    `}>
										<span className="text-2xl block mb-2">{method.icon}</span>
										<span className="text-sm font-medium">{method.label}</span>
									</button>
								))}
							</div>

							{paymentMethod === "card" && (
								<div className="mt-4 p-4 bg-accent-soft/50 rounded-xl border border-accent/20">
									<p className="text-xs text-muted">
										💡 This is a <strong>dummy payment</strong>. No real charges will be made. Click &quot;Pay Now&quot;
										to simulate a successful payment.
									</p>
								</div>
							)}
						</div>

						{error && (
							<div className="p-4 bg-danger/10 border border-danger/20 rounded-xl">
								<p className="text-sm text-danger font-medium">{error}</p>
							</div>
						)}
					</div>

					{/* Right — Summary */}
					<div className="animate-slide-in-right">
						<div className="bg-surface border border-border rounded-2xl p-6 sticky top-24">
							<h3 className="font-display text-lg font-semibold mb-5">Order Summary</h3>

							<div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
								{items.map((item) => (
									<div key={item.id} className="flex gap-3">
										<div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-hover shrink-0">
											{item.product.imageUrl ? (
												<img
													src={item.product.imageUrl}
													alt={item.product.name}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full bg-surface-hover" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">{item.product.name}</p>
											<p className="text-xs text-muted">Qty: {item.quantity}</p>
										</div>
										<span className="text-sm font-semibold whitespace-nowrap">
											{formatPrice(item.product.price * item.quantity)}
										</span>
									</div>
								))}
							</div>

							<div className="border-t border-border pt-4 space-y-2 mb-5">
								<div className="flex justify-between text-sm">
									<span className="text-muted">Subtotal</span>
									<span>{formatPrice(total)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted">Delivery</span>
									<span className="text-success font-medium">Free</span>
								</div>
								<div className="border-t border-border pt-2 flex justify-between">
									<span className="font-display font-semibold">Total</span>
									<span className="font-display text-xl font-bold text-accent">{formatPrice(total)}</span>
								</div>
							</div>

							<Button type="submit" size="lg" className="w-full" loading={submitting}>
								{paymentMethod === "pay_on_delivery" ? "Place Order" : "Pay Now"} — {formatPrice(total)}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
