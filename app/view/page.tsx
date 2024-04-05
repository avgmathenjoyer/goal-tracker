"use client";
import View from "../../components/functional/viewComponent";
import { SessionProvider } from "next-auth/react";
export default function AuthenticatedView() {
    return (
        <SessionProvider>
            <View/>
        </SessionProvider>
    )
}