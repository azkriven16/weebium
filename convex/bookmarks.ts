import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const toggleBookmark = mutation({
    args: {
        reviewId: v.id("reviews"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;

        const existingBookmark = await ctx.db
            .query("bookmarks")
            .filter((q) => q.eq(q.field("reviewId"), args.reviewId))
            .filter((q) => q.eq(q.field("userId"), userId))
            .first();

        if (existingBookmark) {
            await ctx.db.delete(existingBookmark._id);
            return false; // Bookmark removed
        } else {
            await ctx.db.insert("bookmarks", {
                reviewId: args.reviewId,
                userId,
                createdAt: Date.now(),
            });
            return true; // Bookmark added
        }
    },
});

export const getBookmarkedReviews = query({
    args: {
        limit: v.optional(v.number()),
        cursor: v.optional(v.id("bookmarks")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;

        const limit = args.limit ?? 10;
        const cursor = args.cursor;

        let bookmarks;
        if (cursor) {
            bookmarks = await ctx.db
                .query("bookmarks")
                .filter((q) => q.eq(q.field("userId"), userId))
                .order("desc")
                .take(limit);
        } else {
            bookmarks = await ctx.db
                .query("bookmarks")
                .filter((q) => q.eq(q.field("userId"), userId))
                .order("desc")
                .take(limit);
        }

        const reviewIds = bookmarks.map((bookmark) => bookmark.reviewId);
        const reviews = await Promise.all(
            reviewIds.map((id) => ctx.db.get(id))
        );

        return reviews.filter(
            (review): review is Doc<"reviews"> => review !== null
        );
    },
});
