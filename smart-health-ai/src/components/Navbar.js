import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-black text-white shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold">
                    Smart Health AI
                </h1>

                <div className="flex gap-6">
                    <Link href="/">Home</Link>

                    <Link href="/symptom-checker">
                        Symptom Checker
                    </Link>

                    <Link href="/history">
                        History
                    </Link>

                    <Link href="/about">
                        About
                    </Link>
                </div>
            </div>
        </nav>
    );
}