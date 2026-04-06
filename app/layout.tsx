import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/storeProvider";
import UserSessionProvider from "./_components/UserSessionProvider";
import { Toaster } from "sonner";
import { Header } from "./_components/header-books";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CartProvider } from "./_components/cart/cart-provider";
import { Sidebar } from "./_components/side-bar";
import InnerBody from "./Body";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LibraryPro — Modern Library Management",
    template: "%s | LibraryPro",
  },
  description:
    "Streamline your library with catalog management, member tracking, circulation control, and analytics. Trusted by 5,000+ libraries worldwide.",
  keywords: ["library management", "books", "catalog", "borrowing", "reading"],
  authors: [{ name: "LibraryPro" }],
  openGraph: {
    title: "LibraryPro — Modern Library Management",
    description:
      "Streamline cataloging, borrowing, and returns for libraries of all sizes.",
    type: "website",
    locale: "en_US",
    siteName: "LibraryPro",
  },
  twitter: {
    card: "summary_large_image",
    title: "LibraryPro — Modern Library Management",
    description:
      "Streamline cataloging, borrowing, and returns for libraries of all sizes.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased relative`}>
        <StoreProvider>
          <UserSessionProvider>
            <SidebarProvider>
              <CartProvider>
                <InnerBody>
                  <Sidebar />
                  <div className="flex containerEdited justify-start items-center flex-col">
                    <div className="sticky top-0 z-20 w-full">
                      <Header />
                    </div>
                    <div className="w-full containerEdited">{children}</div>
                  </div>
                </InnerBody>
              </CartProvider>
            </SidebarProvider>
          </UserSessionProvider>
        </StoreProvider>

        {/* Sonner toast — single source of truth for notifications */}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
