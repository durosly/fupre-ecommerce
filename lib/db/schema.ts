import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ─── Auth tables (better-auth compatible) ───

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
	image: text("image"),
	role: text("role", { enum: ["admin", "user"] })
		.notNull()
		.default("user"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
	refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }),
	updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

// ─── Product table ───

export const product = sqliteTable("product", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	price: real("price").notNull(),
	imageUrl: text("imageUrl").notNull(),
	stock: integer("stock").notNull().default(0),
	category: text("category").notNull().default("general"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

// ─── Cart table ───

export const cartItem = sqliteTable("cart_item", {
	id: text("id").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	productId: text("productId")
		.notNull()
		.references(() => product.id, { onDelete: "cascade" }),
	quantity: integer("quantity").notNull().default(1),
});

// ─── Order tables ───

export const order = sqliteTable("order", {
	id: text("id").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	totalAmount: real("totalAmount").notNull(),
	paymentMethod: text("paymentMethod", {
		enum: ["card", "bank_transfer", "pay_on_delivery"],
	}).notNull(),
	paymentStatus: text("paymentStatus", {
		enum: ["paid", "pending"],
	})
		.notNull()
		.default("pending"),
	orderStatus: text("orderStatus", {
		enum: ["processing", "shipped", "delivered"],
	})
		.notNull()
		.default("processing"),
	billingName: text("billingName").notNull(),
	billingEmail: text("billingEmail").notNull(),
	billingAddress: text("billingAddress").notNull(),
	billingCity: text("billingCity").notNull(),
	billingPhone: text("billingPhone").notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const orderItem = sqliteTable("order_item", {
	id: text("id").primaryKey(),
	orderId: text("orderId")
		.notNull()
		.references(() => order.id, { onDelete: "cascade" }),
	productId: text("productId")
		.notNull()
		.references(() => product.id),
	quantity: integer("quantity").notNull(),
	price: real("price").notNull(),
});

// ─── Relations ───

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	cartItems: many(cartItem),
	orders: many(order),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const productRelations = relations(product, ({ many }) => ({
	cartItems: many(cartItem),
	orderItems: many(orderItem),
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
	user: one(user, { fields: [cartItem.userId], references: [user.id] }),
	product: one(product, { fields: [cartItem.productId], references: [product.id] }),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
	user: one(user, { fields: [order.userId], references: [user.id] }),
	items: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
	order: one(order, { fields: [orderItem.orderId], references: [order.id] }),
	product: one(product, { fields: [orderItem.productId], references: [product.id] }),
}));
