"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    ImageIcon,
    Sparkles,
    Save,
    ThumbsUp,
    Bookmark,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../../../../convex/_generated/dataModel";

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY_HERE");

export default function BookReviewer() {
    const { user } = useUser();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [mediaType, setMediaType] = useState("book");
    const [tags, setTags] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [currentReviewId, setCurrentReviewId] =
        useState<Id<"reviews"> | null>(null);

    const createReview = useMutation(api.reviews.createReview);
    const updateReview = useMutation(api.reviews.updateReview);
    const publishReview = useMutation(api.reviews.publishReview);
    const clapReview = useMutation(api.claps.clapReview);
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

    const editor = useEditor({
        extensions: [StarterKit, Image, Dropcursor],
        content: "<p>Start writing your review...</p>",
        editorProps: {
            attributes: {
                class: "prose prose-lg max-w-none focus:outline-none min-h-[500px]",
            },
        },
    });

    const addImage = () => {
        const url = window.prompt("Enter the URL of the image:");
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const generateAIReview = async () => {
        if (!title) {
            toast.error("Please enter a title first");
            return;
        }

        setIsGenerating(true);
        toast.loading("Generating AI review...");

        try {
            const currentContent = editor?.getHTML() || "";
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Generate a thoughtful review for the ${mediaType} titled "${title}" ${author ? `by ${author}` : ""}.
      If provided, incorporate insights from the following user review: "${currentContent}".
      The review should be informative, balanced, and highlight key aspects of the ${mediaType}.`;

            const result = await model.generateContent(prompt);
            const generatedReview = result.response.text();

            editor?.commands.setContent(generatedReview);
            toast.success("AI review generated successfully!");
        } catch (error) {
            console.error("Error generating AI review:", error);
            toast.error("Failed to generate AI review. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const saveReview = async () => {
        if (!title || !editor) {
            toast.error("Please enter a title and content before saving");
            return;
        }

        setIsSaving(true);
        try {
            const content = editor.getHTML();
            if (currentReviewId) {
                await updateReview({
                    id: currentReviewId,
                    title,
                    author,
                    content,
                    mediaType,
                    tags,
                });
            } else {
                const newReviewId = await createReview({
                    title,
                    author,
                    content,
                    mediaType,
                    tags,
                });
                setCurrentReviewId(newReviewId);
            }

            setLastSaved(new Date().toLocaleTimeString());
            toast.success("Review saved successfully!");
        } catch (error) {
            console.error("Error saving review:", error);
            toast.error("Failed to save review. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishReview = async () => {
        if (!currentReviewId) {
            toast.error("Please save the review before publishing");
            return;
        }

        setIsPublishing(true);
        try {
            await publishReview({ id: currentReviewId });
            toast.success("Review published successfully!");
        } catch (error) {
            console.error("Error publishing review:", error);
            toast.error("Failed to publish review. Please try again.");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleClap = async () => {
        if (!currentReviewId) {
            toast.error("Cannot clap for an unsaved review");
            return;
        }

        try {
            await clapReview({ reviewId: currentReviewId });
            toast.success("Clapped for the review!");
        } catch (error) {
            console.error("Error clapping for review:", error);
            toast.error("Failed to clap for the review. Please try again.");
        }
    };

    const handleBookmark = async () => {
        if (!currentReviewId) {
            toast.error("Cannot bookmark an unsaved review");
            return;
        }

        try {
            const isBookmarked = await toggleBookmark({
                reviewId: currentReviewId,
            });
            toast.success(
                isBookmarked ? "Review bookmarked!" : "Bookmark removed!"
            );
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            toast.error("Failed to bookmark the review. Please try again.");
        }
    };

    if (!editor || !user) {
        return null;
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div className="text-sm text-muted-foreground">
                    {lastSaved ? `Last saved at ${lastSaved}` : "Not saved yet"}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={saveReview}
                        disabled={isSaving}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                    <Button
                        size="sm"
                        onClick={handlePublishReview}
                        disabled={isPublishing || !currentReviewId}
                    >
                        Publish
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClap}
                        disabled={!currentReviewId}
                    >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Clap
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBookmark}
                        disabled={!currentReviewId}
                    >
                        <Bookmark className="w-4 h-4 mr-2" />
                        Bookmark
                    </Button>
                </div>
            </div>
            <div className="mb-8">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title of the book, manga, or novel"
                    className="w-full text-5xl font-bold mb-4 border-none outline-none bg-transparent placeholder:text-muted-foreground/50"
                />
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author (optional)"
                    className="w-full text-2xl text-muted-foreground border-none outline-none bg-transparent placeholder:text-muted-foreground/50"
                />
                <input
                    type="text"
                    value={tags.join(", ")}
                    onChange={(e) =>
                        setTags(
                            e.target.value.split(", ").map((tag) => tag.trim())
                        )
                    }
                    placeholder="Tags (comma-separated)"
                    className="w-full text-sm text-muted-foreground border-none outline-none bg-transparent placeholder:text-muted-foreground/50 mt-2"
                />
            </div>
            <div className="flex items-center space-x-2 border-b mb-8 pb-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-sm hover:bg-muted transition-colors ${
                        editor.isActive("bold") ? "bg-muted" : ""
                    }`}
                >
                    <Bold className="w-5 h-5" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-sm hover:bg-muted transition-colors ${
                        editor.isActive("italic") ? "bg-muted" : ""
                    }`}
                >
                    <Italic className="w-5 h-5" />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={`p-2 rounded-sm hover:bg-muted transition-colors ${
                        editor.isActive("bulletList") ? "bg-muted" : ""
                    }`}
                >
                    <List className="w-5 h-5" />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`p-2 rounded-sm hover:bg-muted transition-colors ${
                        editor.isActive("orderedList") ? "bg-muted" : ""
                    }`}
                >
                    <ListOrdered className="w-5 h-5" />
                </button>
                <button
                    onClick={addImage}
                    className="p-2 rounded-sm hover:bg-muted transition-colors"
                >
                    <ImageIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={generateAIReview}
                    disabled={isGenerating}
                    className="p-2 rounded-sm hover:bg-muted transition-colors ml-2"
                >
                    <Sparkles className="w-5 h-5" />
                </button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
