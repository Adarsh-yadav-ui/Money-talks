import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { polar } from "./billing";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Error occured", { status: 400 });
    }
    switch (event.type) {
      case "user.created": // intentional fallthrough
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;

      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

polar.registerRoutes(http as any, {
  events: {
    "order.created": async (ctx, event) => {
      const data = event.data as any;
      const polarProductId = data.productId;
      if (!polarProductId) {
        console.error(
          "order.created webhook missing productId",
          JSON.stringify(data),
        );
        return;
      }

      const items = (data.items ?? []).map((item: any) => ({
        productName: item.label ?? data.product?.name ?? "Product",
        priceAmount: item.amount ?? 0,
        quantity: 1,
      }));

      await ctx.runMutation(internal.billing.handleOrderCreated, {
        polarOrderId: data.id,
        polarProductId,
        customerEmail: data.customer?.email ?? "",
        customerName: data.customer?.name ?? undefined,
        totalAmount: data.totalAmount ?? 0,
        currency: data.currency,
        items,
      });
    },
  },
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;