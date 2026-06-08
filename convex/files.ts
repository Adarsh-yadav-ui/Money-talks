import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getProductDownload = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", identity.email!))
      .unique();
    if (!user) throw new Error("User not found");

    const order = await ctx.db
      .query("orders")
      .withIndex("byBuyer", (q) => q.eq("buyerId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    const purchased = await Promise.all(
      order.map((o) =>
        ctx.db
          .query("orderItems")
          .withIndex("byOrder", (q) => q.eq("orderId", o._id))
          .filter((q) => q.eq(q.field("productId"), args.productId))
          .first()
      )
    );
    if (!purchased.some(Boolean)) throw new Error("Not purchased");

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");
    const firstFileStorageId = product.fileStorageId ?? product.files?.[0]?.storageId;
    if (!firstFileStorageId) throw new Error("No file attached");

    return await ctx.storage.getUrl(firstFileStorageId);
  },
});
