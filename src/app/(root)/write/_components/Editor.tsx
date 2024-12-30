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
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY_HERE");

interface Review {
    id: string;
    title: string;
    author: string;
    content: string;
    mediaType: string;
    publishedAt: string;
    lastSavedAt: string;
}

export default function BookReviewer() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [mediaType, setMediaType] = useState("book");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

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
            const review: Review = {
                id: Math.random().toString(36).substr(2, 9),
                title,
                author,
                content: editor.getHTML(),
                mediaType,
                publishedAt: "",
                lastSavedAt: new Date().toISOString(),
            };

            // Mock saving to database
            console.log("Saving review:", review);
            localStorage.setItem(`review-${review.id}`, JSON.stringify(review));

            setLastSaved(new Date().toLocaleTimeString());
            toast.success("Review saved successfully!");
        } catch (error) {
            console.error("Error saving review:", error);
            toast.error("Failed to save review. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const publishReview = async () => {
        if (!title || !editor) {
            toast.error("Please enter a title and content before publishing");
            return;
        }

        setIsPublishing(true);
        try {
            const review: Review = {
                id: Math.random().toString(36).substr(2, 9),
                title,
                author,
                content: editor.getHTML(),
                mediaType,
                publishedAt: new Date().toISOString(),
                lastSavedAt: new Date().toISOString(),
            };

            // Mock publishing to database
            console.log("Publishing review:", review);
            localStorage.setItem(
                `published-review-${review.id}`,
                JSON.stringify(review)
            );

            toast.success("Review published successfully!");
        } catch (error) {
            console.error("Error publishing review:", error);
            toast.error("Failed to publish review. Please try again.");
        } finally {
            setIsPublishing(false);
        }
    };

    if (!editor) {
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
                        onClick={publishReview}
                        disabled={isPublishing}
                    >
                        Publish
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
