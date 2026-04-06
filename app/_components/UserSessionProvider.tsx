"use client";

import { SessionProvider } from "next-auth/react";
import UserSessionManager from "../../hooks/UserSessionManager";

export default function UserSessionProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <UserSessionManager />
      {children}
    </SessionProvider>
  );
}
