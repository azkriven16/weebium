import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createReview = mutation({
    args: {
        title: v.string(),
        author: v.string(),
        content: v.string(),
        mediaType: v.string(),
        tags: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;

        const reviewId = await ctx.db.insert("reviews", {
            ...args,
            userId,
            claps: 0,
            lastSavedAt: Date.now(),
        });

        return reviewId;
    },
});

export const getReview = query({
    args: { id: v.id("reviews") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const updateReview = mutation({
    args: {
        id: v.id("reviews"),
        title: v.string(),
        author: v.string(),
        content: v.string(),
        mediaType: v.string(),
        tags: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updateFields } = args;
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;

        const existingReview = await ctx.db.get(id);
        if (!existingReview || existingReview.userId !== userId) {
            throw new Error("Not authorized to update this review");
        }

        await ctx.db.patch(id, {
            ...updateFields,
            lastSavedAt: Date.now(),
        });
    },
});

export const publishReview = mutation({
    args: { id: v.id("reviews") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;

        const existingReview = await ctx.db.get(args.id);
        if (!existingReview || existingReview.userId !== userId) {
            throw new Error("Not authorized to publish this review");
        }

        await ctx.db.patch(args.id, { publishedAt: Date.now() });
    },
});

export const listReviews = query({
    args: {
        limit: v.optional(v.number()),
        cursor: v.optional(v.id("reviews")),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10;
        const cursor = args.cursor;

        let reviews;
        if (cursor) {
            reviews = await ctx.db
                .query("reviews")
                .filter((q) => q.neq(q.field("publishedAt"), null))
                .order("desc")
                .take(limit);
        } else {
            reviews = await ctx.db
                .query("reviews")
                .filter((q) => q.neq(q.field("publishedAt"), null))
                .order("desc")
                .take(limit);
        }

        return reviews;
    },
});
