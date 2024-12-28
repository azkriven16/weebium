import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Separator } from "./ui/separator";
import Link from "next/link";

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
                    <div className="flex items-center">
                        <Search className="text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search"
                            className="hidden md:block w-full border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring "
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="outline" className="hidden md:block">
                        Sign In
                    </Button>
                    <Separator orientation="vertical" className="h-10" />
                    <Button>Get Started</Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
