import Link from "next/link";

export const Header = () => {
    return (
        <header className="bg-white shadow-sm py-4">
            <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-5">
                    <Link
                        className="text-2xl font-semibold text-gray-900 font-serif"
                        href="/"
                    >
                        weebium
                    </Link>
                </div>
            </div>
        </header>
    );
};
