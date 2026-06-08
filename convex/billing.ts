import { Polar as PolarSDK } from "@polar-sh/sdk";
import { PolarCore } from "@polar-sh/sdk/core.js";
import { checkoutsCreate } from "@polar-sh/sdk/funcs/checkoutsCreate.js";
import { Polar } from "@convex-dev/polar";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

export const polar = new Polar(components.polar, {
  organizationToken: process.env.POLAR_ORGANIZATION_TOKEN!,
  server: "sandbox",
  getUserInfo: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return {
      userId: identity.subject,
      email: identity.email!,
    };
  },
});

function getPolarClient() {
  return new PolarSDK({
    accessToken: process.env.POLAR_ORGANIZATION_TOKEN!,
    server: "sandbox",
  });
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

export const createProduct = action({
  args: {
    sellerId: v.id("users"),
    name: v.string(),
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
  },
  handler: async (ctx, args) => {
    const sdk = getPolarClient();

    const polarProduct = await sdk.products.create({
      name: args.name,
      description: args.description || null,
      prices: [
        {
          amountType: "fixed" as const,
          priceAmount: args.price,
        },
      ],
    });

    const slug = slugify(args.name);

    const runMutation = ctx.runMutation as unknown as (
      name: unknown,
      args: Record<string, unknown>,
    ) => Promise<string>;

    const productId = await runMutation(internal.products.createFromBilling, {
      sellerId: args.sellerId,
      name: args.name,
      slug,
      description: args.description,
      content: args.content,
      price: args.price,
      coverImage: args.coverImage,
      categoryId: args.categoryId,
      fileUrl: args.fileUrl,
      fileName: args.fileName,
      fileStorageId: args.fileStorageId,
      files: args.files,
      polarProductId: polarProduct.id,
    });

    return {
      productId,
      polarProductId: polarProduct.id,
    };
  },
});

export const generateCheckoutUrl = action({
  args: {
    productId: v.id("products"),
    successUrl: v.optional(v.string()),
    returnUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.runQuery(internal.billing.getProduct, {
      id: args.productId,
    });
    if (!product) throw new Error("Product not found");
    if (!product.polarProductId) throw new Error("Product not linked to Polar");

    const identity = await ctx.auth.getUserIdentity();

    const core = new PolarCore({
      accessToken: process.env.POLAR_ORGANIZATION_TOKEN!,
      server: "sandbox",
    });
    const result = await checkoutsCreate(core, {
      products: [product.polarProductId],
      customerEmail: identity?.email ?? undefined,
      successUrl: args.successUrl ?? undefined,
      returnUrl: args.returnUrl ?? undefined,
    });
    if (!result.ok) {
      console.error("Failed to create checkout:", JSON.stringify(result));
      throw new Error("Failed to create checkout");
    }
    return result.value.url;
  },
});

export const generateCartCheckoutUrl = action({
  args: {
    productIds: v.array(v.id("products")),
    successUrl: v.optional(v.string()),
    returnUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const polarProductIds: string[] = [];
    for (const id of args.productIds) {
      const product = await ctx.runQuery(internal.billing.getProduct, { id });
      if (product?.polarProductId) {
        polarProductIds.push(product.polarProductId);
      }
    }
    if (polarProductIds.length === 0) throw new Error("No valid products");

    const core = new PolarCore({
      accessToken: process.env.POLAR_ORGANIZATION_TOKEN!,
      server: "sandbox",
    });
    const result = await checkoutsCreate(core, {
      products: polarProductIds,
      customerEmail: identity?.email ?? undefined,
      successUrl: args.successUrl ?? undefined,
      returnUrl: args.returnUrl ?? undefined,
    });
    if (!result.ok) {
      console.error("Failed to create cart checkout:", JSON.stringify(result));
      throw new Error("Failed to create cart checkout");
    }
    return result.value.url;
  },
});

export const generateCheckoutUrlForPolarProduct = action({
  args: { polarProductId: v.string() },
  handler: async (ctx, args) => {
    const sdk = getPolarClient();
    const link = await sdk.checkoutLinks.create({
      productId: args.polarProductId,
      paymentProcessor: "stripe",
    });
    return link.url;
  },
});

export const getProduct = internalQuery({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getProductByPolarId = internalQuery({
  args: { polarProductId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("byPolarProductId", (q) =>
        q.eq("polarProductId", args.polarProductId),
      )
      .unique();
  },
});

export const handleOrderCreated = internalMutation({
  args: {
    polarOrderId: v.string(),
    polarProductId: v.string(),
    customerEmail: v.string(),
    customerName: v.optional(v.string()),
    totalAmount: v.number(),
    currency: v.string(),
    items: v.array(
      v.object({
        productName: v.string(),
        priceAmount: v.number(),
        quantity: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orders")
      .withIndex("byPolarOrderId", (q) =>
        q.eq("polarOrderId", args.polarOrderId),
      )
      .unique();
    if (existing) return;

    const product = await ctx.db
      .query("products")
      .withIndex("byPolarProductId", (q) =>
        q.eq("polarProductId", args.polarProductId),
      )
      .unique();
    if (!product)
      throw new Error("Product not found for Polar ID: " + args.polarProductId);

    const buyer = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", args.customerEmail))
      .unique();

    const now = Date.now();
    const subtotal = args.totalAmount;
    const feeAmount = Math.round(subtotal * 0.1);
    const netAmount = subtotal - feeAmount;

    const orderId = await ctx.db.insert("orders", {
      buyerId: buyer?._id ?? ("guest" as any),
      sellerId: product.sellerId,
      status: "completed",
      subtotal,
      feeAmount,
      netAmount,
      polarOrderId: args.polarOrderId,
      buyerEmail: args.customerEmail,
      createdAt: now,
      updatedAt: now,
    });

    const productNames: string[] = [];

    for (const item of args.items) {
      const itemFee = Math.round(item.priceAmount * 0.1);
      const itemNet = item.priceAmount - itemFee;

      const itemProduct = await ctx.db
        .query("products")
        .withIndex("byPolarProductId", (q) =>
          q.eq("polarProductId", args.polarProductId),
        )
        .unique();

      await ctx.db.insert("orderItems", {
        orderId,
        productId: itemProduct?._id ?? product._id,
        productName: item.productName,
        price: item.priceAmount,
        fee: itemFee,
        net: itemNet,
        createdAt: now,
      });

      productNames.push(item.productName);

      if (itemProduct) {
        await ctx.db.patch(itemProduct._id, {
          salesCount: (itemProduct.salesCount ?? 0) + item.quantity,
          updatedAt: now,
        });
      }
    }

    await ctx.db.patch(product._id, {
      salesCount: (product.salesCount ?? 0) + 1,
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.email.sendOrderConfirmation, {
      email: args.customerEmail,
      productNames,
      totalAmount: args.totalAmount,
    });
  },
});
