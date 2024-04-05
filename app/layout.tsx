import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { config } from "@/auth";
import Link from "next/link";
import { LoginButton } from "../components/functional/loginButton";

const inter = Inter({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-sans",
});

async function Navbar() {
    const session = await getServerSession(config);
    return (
      <nav className="flex flex-row flex-nowrap justify-between items-center h-8 m-2">
        <h1 className="text-3xl font-extrabold">Goal tracker</h1>

        <div>
          <Link href="/" className="mx-5" replace>Home page</Link>
          <LoginButton loggedIn={!!session}/>
        </div>    
      </nav>
    )
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`min-h-screen min-w-screen ${inter.className}`}>
                <Navbar />
                <main className="w-full h-full">{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
