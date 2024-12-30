import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Post = () => {
    return (
        <Card className="max-w-2xl mx-auto my-8">
            <CardHeader className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src="/api/placeholder/40/40"
                            alt="Author"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-gray-500">
                            Dec 28, 2024 · 5 min read
                        </p>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">
                        Building a Modern Web Application
                    </h2>
                    <p className="text-gray-500 mt-2">
                        A comprehensive guide to creating scalable applications
                        using Next.js and Convex
                    </p>
                </div>
            </CardHeader>

            <CardContent className="prose prose-gray max-w-none">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </CardContent>

            <CardFooter className="border-t pt-4">
                <div className="flex justify-between items-center w-full">
                    <div className="flex space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                            <span>👏</span>
                            <span className="text-sm">142</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                            <span>💬</span>
                            <span className="text-sm">12</span>
                        </button>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700">
                        <span>🔖</span>
                    </button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default Post;
