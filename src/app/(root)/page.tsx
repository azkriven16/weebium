"use client";

import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Hero from "./_components/Hero";

function App() {
    return (
        <main>
            <Unauthenticated>
                <Hero />
            </Unauthenticated>
            <Authenticated>
                <UserButton />
                <Content />
            </Authenticated>
        </main>
    );
}

function Content() {
    const messages = useQuery(api.messages.getForCurrentUser);
    return <div>Authenticated content: {messages?.length}</div>;
}

export default App;
