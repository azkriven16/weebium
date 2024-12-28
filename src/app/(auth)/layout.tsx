import { PropsWithChildren } from "react";
import { Header } from "./_components/Header";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Header />
            {children}
        </div>
    );
}
