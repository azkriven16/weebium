import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    posts: defineTable({
        name: v.string(),
        userId: v.string(),
    }).index("by_userId", ["userId"]),
});
