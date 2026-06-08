import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getCart = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const items = await ctx.db
      .query("cart")
      .withIndex("byBuyer", (q) => q.eq("buyerId", user._id))
      .collect();

    const products = await Promise.all(
      items.map((item) => ctx.db.get(item.productId))
    );

    return items.map((item, i) => ({
      ...item,
      product: products[i],
    })).filter((item) => item.product !== null);
  },
});

export const getCartCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return 0;

    const items = await ctx.db
      .query("cart")
      .withIndex("byBuyer", (q) => q.eq("buyerId", user._id))
      .collect();

    return items.length;
  },
});

export const addItem = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("cart")
      .withIndex("byBuyer", (q) => q.eq("buyerId", user._id))
      .collect();

    if (existing.some((item) => item.productId === args.productId)) {
      return;
    }

    await ctx.db.insert("cart", {
      buyerId: user._id,
      productId: args.productId,
      addedAt: Date.now(),
    });
  },
});

export const removeItem = mutation({
  args: { cartId: v.id("cart") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.cartId);
    if (!item || item.buyerId !== user._id) throw new Error("Not your cart item");

    await ctx.db.delete(args.cartId);
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const items = await ctx.db
      .query("cart")
      .withIndex("byBuyer", (q) => q.eq("buyerId", user._id))
      .collect();

    await Promise.all(items.map((item) => ctx.db.delete(item._id)));
  },
});
