import { PropsWithChildren } from "react";
import Navbar from "./_components/Navbar";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            {children}
        </div>
    );
}
