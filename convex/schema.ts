import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        userId: v.string(), // Clerk user ID
        name: v.string(),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
    }).index("by_userId", ["userId"]),
    reviews: defineTable({
        title: v.string(),
        author: v.string(),
        content: v.string(),
        mediaType: v.string(),
        publishedAt: v.optional(v.number()), // Unix timestamp
        lastSavedAt: v.number(), // Unix timestamp
        userId: v.string(), // Clerk user ID
        claps: v.number(),
        tags: v.array(v.string()),
    })
        .index("by_userId", ["userId"])
        .index("by_publishedAt", ["publishedAt"])
        .index("by_claps", ["claps"]),
        comments: defineTable({
            reviewId: v.id("reviews"),
            userId: v.string(), // Clerk user ID
            content: v.string(),
            createdAt: v.number(), // Unix timestamp
          })
            .index("by_reviewId", ["reviewId"])
            .index("by_userId", ["userId"]),
        
          claps: defineTable({
            reviewId: v.id("reviews"),
            userId: v.string(), // Clerk user ID
            count: v.number(),
          })
            .index("by_reviewId", ["reviewId"])
            .index("by_userId", ["userId"]),
        
          bookmarks: defineTable({
            reviewId: v.id("reviews"),
            userId: v.string(), // Clerk user ID
            createdAt: v.number(), // Unix timestamp
          })
            .index("by_userId", ["userId"])
            .index("by_reviewId", ["reviewId"]),
});
