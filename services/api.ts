import axios from "axios";

const api = axios.create({
	baseURL: "/api",
	withCredentials: true,
});

export const productService = {
	getAll: () => api.get("/products").then((r) => r.data),
	getById: (id: string) => api.get(`/products/${id}`).then((r) => r.data),
	create: (data: any) => api.post("/products", data).then((r) => r.data),
	update: (id: string, data: any) => api.put(`/products/${id}`, data).then((r) => r.data),
	delete: (id: string) => api.delete(`/products/${id}`).then((r) => r.data),
};

export const uploadService = {
	upload: async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		return api
			.post("/upload", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((r) => r.data);
	},
};

export const cartService = {
	getCart: () => api.get("/cart").then((r) => r.data),
	addToCart: (productId: string, quantity: number = 1) => api.post("/cart", { productId, quantity }).then((r) => r.data),
	updateQuantity: (itemId: string, quantity: number) => api.put("/cart", { itemId, quantity }).then((r) => r.data),
	removeItem: (itemId: string) => api.delete(`/cart?itemId=${itemId}`).then((r) => r.data),
	clearCart: () => api.delete("/cart").then((r) => r.data),
};

export const orderService = {
	getOrders: () => api.get("/orders").then((r) => r.data),
	checkout: (data: { paymentMethod: string; billingName: string; billingEmail: string; billingAddress: string; billingCity: string; billingPhone: string }) =>
		api.post("/orders", data).then((r) => r.data),
	updateOrder: (id: string, data: any) => api.put(`/orders/${id}`, data).then((r) => r.data),
};
