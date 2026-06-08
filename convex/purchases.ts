import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getMyPurchases = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const orders = await ctx.db
      .query("orders")
      .withIndex("byBuyer", (q) => q.eq("buyerId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    const orderItems = await Promise.all(
      orders.map((o) =>
        ctx.db
          .query("orderItems")
          .withIndex("byOrder", (q) => q.eq("orderId", o._id))
          .collect()
      )
    );

    const allItems = orderItems.flat();
    const productIds = [...new Set(allItems.map((item) => item.productId))];
    const products = await Promise.all(
      productIds.map((id) => ctx.db.get(id))
    );

    return products
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .map((p) => ({
        ...p,
        purchasedAt: allItems.find((item) => item.productId === p._id)?.createdAt,
      }));
  },
});

export const hasPurchased = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const product = await ctx.db.get(args.productId);
    if (!product) return false;

    if (product.sellerId === user._id) return true;

    const orders = await ctx.db
      .query("orders")
      .withIndex("byBuyer", (q) => q.eq("buyerId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    const result = await Promise.all(
      orders.map((o) =>
        ctx.db
          .query("orderItems")
          .withIndex("byOrder", (q) => q.eq("orderId", o._id))
          .filter((q) => q.eq(q.field("productId"), args.productId))
          .first()
      )
    );

    return result.some(Boolean);
  },
});
