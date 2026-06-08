import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("byStatus", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();
  },
});

export const listBySellerEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const seller = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", args.email))
      .unique();
    if (!seller) return [];

    return await ctx.db
      .query("products")
      .withIndex("bySeller", (q) => q.eq("sellerId", seller._id))
      .order("desc")
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("bySlug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getMyProducts = query({
  args: { sellerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("bySeller", (q) => q.eq("sellerId", args.sellerId))
      .order("desc")
      .collect();
  },
});

export const listByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("byCategory", (q) => q.eq("categoryId", args.categoryId))
      .order("desc")
      .collect();
  },
});

export const searchProducts = query({
  args: { query: v.string(), categoryId: v.optional(v.id("categories")) },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("products")
      .withIndex("byStatus", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();

    const q = args.query.toLowerCase().trim();
    if (q) {
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (args.categoryId) {
      products = products.filter((p) => p.categoryId === args.categoryId);
    }

    return products;
  },
});

export const create = mutation({
  args: {
    sellerId: v.id("users"),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    coverImage: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db.insert("products", {
      sellerId: args.sellerId,
      name: args.name,
      slug: args.slug,
      description: args.description,
      price: args.price,
      coverImage: args.coverImage,
      categoryId: args.categoryId,
      fileUrl: args.fileUrl,
      fileName: args.fileName,
      fileSize: args.fileSize,
      status: "draft",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
    coverImage: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");
    if (product.sellerId !== user._id) throw new Error("Not your product");

    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");
    if (product.sellerId !== user._id) throw new Error("Not your product");

    await ctx.db.delete(args.id);
  },
});

export const createFromBilling = internalMutation({
  args: {
    sellerId: v.id("users"),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.optional(v.string()),
    price: v.number(),
    coverImage: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileStorageId: v.optional(v.string()),
    files: v.optional(v.array(v.object({
      storageId: v.string(),
      name: v.string(),
      size: v.optional(v.number()),
    }))),
    polarProductId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      sellerId: args.sellerId,
      name: args.name,
      slug: args.slug,
      description: args.description,
      content: args.content,
      price: args.price,
      coverImage: args.coverImage,
      categoryId: args.categoryId,
      fileUrl: args.fileUrl,
      fileName: args.fileName,
      fileStorageId: args.fileStorageId,
      files: args.files,
      polarProductId: args.polarProductId,
      status: "published",
      salesCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
