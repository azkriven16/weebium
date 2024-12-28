import { query } from "./_generated/server";

export const getBlogs = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("blogs").collect();
    },
});
