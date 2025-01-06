import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const addComment = mutation({
    args: {
        reviewId: v.id("reviews"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;

        const commentId = await ctx.db.insert("comments", {
            reviewId: args.reviewId,
            userId,
            content: args.content,
            createdAt: Date.now(),
        });

        return commentId;
    },
});

export const getComments = query({
    args: {
        reviewId: v.id("reviews"),
        limit: v.optional(v.number()),
        cursor: v.optional(v.id("comments")),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10;
        const cursor = args.cursor;

        let comments;
        if (cursor) {
            comments = await ctx.db
                .query("comments")
                .filter((q) => q.eq(q.field("reviewId"), args.reviewId))
                .order("desc")
                .take(limit);
        } else {
            comments = await ctx.db
                .query("comments")
                .filter((q) => q.eq(q.field("reviewId"), args.reviewId))
                .order("desc")
                .take(limit);
        }

        return comments;
    },
});
