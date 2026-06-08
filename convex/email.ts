import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Resend } from "resend";

export const sendOrderConfirmation = internalAction({
  args: {
    email: v.string(),
    productNames: v.array(v.string()),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    const productList = args.productNames
      .map((name) => `<li>${name}</li>`)
      .join("");

    const { error } = await resend.emails.send({
      from: "Money Talks <onboarding@resend.dev>",
      to: args.email,
      subject: "Order Confirmation - Money Talks",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;border:2px solid #000;padding:24px">
          <h1 style="font-size:24px;margin:0 0 16px">Thank you for your purchase!</h1>
          <p style="margin:0 0 12px">You bought:</p>
          <ul style="margin:0 0 16px">${productList}</ul>
          <p style="font-size:18px;font-weight:700;margin:0 0 24px">Total: $${(args.totalAmount / 100).toFixed(2)}</p>
          <p style="color:#666;font-size:14px">Access your downloads from your dashboard.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send email:", error);
    }
  },
});
