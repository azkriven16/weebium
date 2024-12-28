import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Bell, Search, SquarePen } from "lucide-react";
import Link from "next/link";
import { CiBellOn } from "react-icons/ci";

const Navbar = () => {
    return (
        <nav className={cn("bg-white shadow-sm py-4")}>
            <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-5">
                    <Link
                        className="text-2xl font-semibold text-gray-900 font-serif"
                        href="/"
                    >
                        weebium
                    </Link>
                    <div className="items-center hidden md:flex ">
                        <Search className="text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search"
                            className="w-full border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring shadow-none"
                        />
                    </div>
                </div>

                <SignedOut>
                    <div className="flex items-center space-x-4">
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
                </SignedOut>

                <SignedIn>
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
                </SignedIn>
            </div>
        </nav>
    );
};

export default Navbar;
