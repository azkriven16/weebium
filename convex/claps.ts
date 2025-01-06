import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const clapReview = mutation({
    args: {
        reviewId: v.id("reviews"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;

        const existingClap = await ctx.db
            .query("claps")
            .filter((q) => q.eq(q.field("reviewId"), args.reviewId))
            .filter((q) => q.eq(q.field("userId"), userId))
            .first();

        if (existingClap) {
            await ctx.db.patch(existingClap._id, {
                count: existingClap.count + 1,
            });
        } else {
            await ctx.db.insert("claps", {
                reviewId: args.reviewId,
                userId,
                count: 1,
            });
        }

        // Update the total claps on the review
        const review = await ctx.db.get(args.reviewId);
        if (review) {
            await ctx.db.patch(args.reviewId, {
                claps: (review.claps || 0) + 1,
            });
        }
    },
});

export const getClapCount = query({
    args: {
        reviewId: v.id("reviews"),
    },
    handler: async (ctx, args) => {
        const review = await ctx.db.get(args.reviewId);
        return review?.claps || 0;
    },
});
