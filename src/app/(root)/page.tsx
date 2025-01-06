"use client";

import { UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import Hero from "./_components/Hero";
import Post from "./_components/Posts";

function App() {
    return (
        <main>
            <Unauthenticated>
                <Hero />
            </Unauthenticated>
            <Authenticated>
                <UserButton />
                <Post />
            </Authenticated>
        </main>
    );
}

export default App;
