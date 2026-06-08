import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("asc").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      createdAt: Date.now(),
    });
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("categories").collect();
    if (existing.length > 0) return;

    const defaults = [
      { name: "Templates & UI Kits", slug: "templates-ui-kits", description: "Website templates, UI kits, and design systems" },
      { name: "Icons & Graphics", slug: "icons-graphics", description: "Icon packs, illustrations, and graphic assets" },
      { name: "Fonts & Typography", slug: "fonts-typography", description: "Font families and typeface assets" },
      { name: "3D Assets", slug: "3d-assets", description: "3D models, textures, and environments" },
      { name: "Audio & Music", slug: "audio-music", description: "Music tracks, sound effects, and audio assets" },
      { name: "Video & Motion", slug: "video-motion", description: "Video templates, animations, and motion graphics" },
      { name: "Code & Scripts", slug: "code-scripts", description: "Code snippets, plugins, and developer tools" },
      { name: "E-books & Guides", slug: "ebooks-guides", description: "Digital books, guides, and educational content" },
    ];

    for (const cat of defaults) {
      await ctx.db.insert("categories", { ...cat, createdAt: Date.now() });
    }
  },
});
