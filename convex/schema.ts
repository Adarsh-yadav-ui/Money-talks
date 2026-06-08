import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    username: v.string(),
    imageUrl: v.string(),
    bio: v.optional(v.string()),
    role: v.optional(v.union(v.literal("creator"), v.literal("buyer"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byClerkUserId", ["clerkUserId"])
    .index("byEmail", ["email"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("bySlug", ["slug"]),

  products: defineTable({
    sellerId: v.id("users"),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived"),
    ),
    coverImage: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    fileStorageId: v.optional(v.string()),
    files: v.optional(v.array(v.object({
      storageId: v.string(),
      name: v.string(),
      size: v.optional(v.number()),
    }))),
    categoryId: v.optional(v.id("categories")),
    salesCount: v.optional(v.number()),
    polarProductId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("bySeller", ["sellerId"])
    .index("byStatus", ["status"])
    .index("bySlug", ["slug"])
    .index("byCategory", ["categoryId"])
    .index("byPolarProductId", ["polarProductId"]),

  orders: defineTable({
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("refunded"),
    ),
    subtotal: v.number(),
    feeAmount: v.number(),
    netAmount: v.number(),
    polarOrderId: v.optional(v.string()),
    buyerEmail: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byBuyer", ["buyerId"])
    .index("bySeller", ["sellerId"])
    .index("byStatus", ["status"])
    .index("byPolarOrderId", ["polarOrderId"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    productName: v.string(),
    price: v.number(),
    fee: v.number(),
    net: v.number(),
    createdAt: v.number(),
  })
    .index("byOrder", ["orderId"])
    .index("byProduct", ["productId"]),
});
