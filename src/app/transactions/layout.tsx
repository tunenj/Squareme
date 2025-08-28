// app/transactions/layout.tsx
"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import React from "react";

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] md:pl-64">
            {/* Sidebar is fixed inside the component */}
            <Sidebar />

            {/* Content column */}
            <div className="flex flex-col min-h-screen">
                <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
                    <div className="flex items-center px-4">
                        <Topbar />
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
