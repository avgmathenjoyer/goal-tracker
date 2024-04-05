"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function LoginButton({loggedIn}: {loggedIn: boolean}) {
    return (
      <>
        {loggedIn ? <Button onClick={() => signOut({callbackUrl: "http://localhost:3000/"})}>Logout</Button> : <Link href="/api/auth/signin" replace><Button>Login</Button></Link>}
      </>
    )
}