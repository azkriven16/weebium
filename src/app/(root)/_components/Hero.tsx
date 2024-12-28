"use client";

import { ArrowDownRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
    return (
        <section className="py-10 mx-auto container px-4">
            <div className="container">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
                            Human stories & ideas
                        </h1>
                        <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                            A place to read, write, and deepen your
                            understanding
                        </p>
                        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                            <Button
                                asChild
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                <Link href="/sign-in">Start reading</Link>
                            </Button>
                        </div>
                    </div>
                    <img
                        src="https://shadcnblocks.com/images/block/placeholder-1.svg"
                        alt="placeholder hero"
                        className="max-h-96 w-full rounded-md object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
