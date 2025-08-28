// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/store/Providers";

export const metadata: Metadata = {
  title: "Revenue Dashboard",
  description: "Mocked revenue chart with Redux Toolkit",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-[#0F172A]">
        <Providers>
          <main className="min-h-screen p-6 md:p-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
