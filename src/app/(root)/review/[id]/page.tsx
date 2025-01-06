"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { use } from "react";

export default function ReviewPage({
    params,
}: {
    params: Promise<{ id: Id<"reviews"> }>;
}) {
    const { id } = use(params);
    const { user } = useUser();
    const review = useQuery(api.reviews.getReview, { id });
    const comments = useQuery(api.comments.getComments, { reviewId: id });
    const clapCount = useQuery(api.claps.getClapCount, { reviewId: id });
    const [newComment, setNewComment] = useState("");

    const clapReview = useMutation(api.claps.clapReview);
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const addComment = useMutation(api.comments.addComment);

    const handleClap = async () => {
        try {
            await clapReview({ reviewId: id });
            toast.success("Clapped for the review!");
        } catch (error) {
            console.error("Error clapping for review:", error);
            toast.error("Failed to clap for the review. Please try again.");
        }
    };

    const handleBookmark = async () => {
        try {
            const isBookmarked = await toggleBookmark({ reviewId: id });
            toast.success(
                isBookmarked ? "Review bookmarked!" : "Bookmark removed!"
            );
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            toast.error("Failed to bookmark the review. Please try again.");
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        try {
            await addComment({ reviewId: id, content: newComment });
            setNewComment("");
            toast.success("Comment added successfully!");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment. Please try again.");
        }
    };

    if (!review) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">{review.title}</h1>
            <div className="text-muted-foreground mb-4">
                By {review.author} |{" "}
                {new Date(review.publishedAt ?? 0).toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-4 mb-6">
                <Button variant="outline" onClick={handleClap}>
                    👏 {clapCount || 0}
                </Button>
                <Button variant="outline" onClick={handleBookmark}>
                    🔖 Bookmark
                </Button>
                <div>💬 {comments?.length || 0}</div>
            </div>
            <div
                className="prose max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: review.content }}
            />
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                {user ? (
                    <div className="mb-4">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="mb-2"
                        />
                        <Button onClick={handleAddComment}>Post Comment</Button>
                    </div>
                ) : (
                    <div className="mb-4 text-muted-foreground">
                        Please sign in to add a comment.
                    </div>
                )}
                {comments?.map((comment) => (
                    <div key={comment._id} className="border-t py-4">
                        <div className="font-semibold mb-1">
                            {comment.userId}
                        </div>
                        <div className="text-muted-foreground text-sm mb-2">
                            {new Date(comment.createdAt).toLocaleString()}
                        </div>
                        <div>{comment.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
