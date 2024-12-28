"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Bell, Search, SquarePen } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="py-4">
            <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-5">
                    <Link
                        className="text-2xl font-semibold text-gray-900 font-serif"
                        href="/"
                    >
                        weebium
                    </Link>
                    <Authenticated>
                        <div className="items-center hidden md:flex">
                            <Search className="text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search"
                                className="w-full border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring shadow-none"
                            />
                        </div>
                    </Authenticated>
                </div>

                <Unauthenticated>
                    <div className="flex items-center space-x-4">
                        <div className="items-center hidden md:flex space-x-4 mr-5">
                            <Link
                                href="/about"
                                className="hover:underline text-sm"
                            >
                                Our Story
                            </Link>

                            <Link
                                href="/create"
                                className="hover:underline text-sm"
                            >
                                Write
                            </Link>
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            className="hidden md:block"
                        >
                            <Link href="/sign-in">Sign In</Link>
                        </Button>
                        <Separator orientation="vertical" className="h-10" />
                        <Button asChild>
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </div>
                </Unauthenticated>

                <Authenticated>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="block md:hidden"
                        >
                            <Search />
                        </Button>
                        <Button variant="ghost">
                            <SquarePen />{" "}
                            <span className="hidden md:inline">Write</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Bell />
                        </Button>
                        <UserButton />
                    </div>
                </Authenticated>
            </div>
        </nav>
    );
};

export default Navbar;
