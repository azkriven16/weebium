"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function ReviewList() {
    const reviews = useQuery(api.reviews.listReviews, { limit: 10 });
    const clapReview = useMutation(api.claps.clapReview);
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const [isClapping, setIsClapping] = useState<Record<string, boolean>>({});
    const [isBookmarking, setIsBookmarking] = useState<Record<string, boolean>>(
        {}
    );

    if (!reviews) {
        return <div>Loading reviews...</div>;
    }

    const handleClap = async (reviewId: Id<"reviews">) => {
        setIsClapping((prev) => ({ ...prev, [reviewId]: true }));
        try {
            await clapReview({ reviewId });
            toast.success("Clapped for the review!");
        } catch (error) {
            console.error("Error clapping for review:", error);
            toast.error("Failed to clap for the review. Please try again.");
        } finally {
            setIsClapping((prev) => ({ ...prev, [reviewId]: false }));
        }
    };

    const handleBookmark = async (reviewId: Id<"reviews">) => {
        setIsBookmarking((prev) => ({ ...prev, [reviewId]: true }));
        try {
            const isBookmarked = await toggleBookmark({ reviewId });
            toast.success(
                isBookmarked ? "Review bookmarked!" : "Bookmark removed!"
            );
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            toast.error("Failed to bookmark the review. Please try again.");
        } finally {
            setIsBookmarking((prev) => ({ ...prev, [reviewId]: false }));
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold mb-6">Latest Reviews</h2>
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="border rounded-lg p-4 shadow-sm"
                    >
                        <h3 className="text-xl font-semibold mb-2">
                            {review.title}
                        </h3>
                        <p className="text-muted-foreground mb-2">
                            By {review.author}
                        </p>
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-sm text-muted-foreground">
                                {new Date(
                                    review.publishedAt ?? 0
                                ).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {review.mediaType}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                👏 {review.claps}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                            {review.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleClap(review._id)}
                                disabled={isClapping[review._id]}
                            >
                                👏{" "}
                                {isClapping[review._id]
                                    ? "Clapping..."
                                    : "Clap"}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBookmark(review._id)}
                                disabled={isBookmarking[review._id]}
                            >
                                🔖{" "}
                                {isBookmarking[review._id]
                                    ? "Bookmarking..."
                                    : "Bookmark"}
                            </Button>
                            <Link href={`/review/${review._id}`}>
                                <Button variant="link" size="sm">
                                    💬 Read more
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
