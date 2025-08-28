"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useState } from "react";

const Topbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-white shadow py-3 flex items-center justify-between z-50 px-4 md:px-9">
                {/* Left Section (Hamburger on mobile) */}
                <div className="flex items-center gap-3">
                    {/* Hamburger (mobile only) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-md text-2xl ml-4 hover:bg-gray-100"
                        aria-label="Menu"
                    >
                        ☰
                    </button>

                    {/* Logo (desktop only) */}
                    <Link
                        href="/"
                        className="hidden md:flex items-center justify-center mb-2 lg:mb-0"
                    >
                        <Image
                            src="/images/logo.png"
                            alt="Avetium"
                            width={100}
                            height={24}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Logo (mobile only) */}
                <Link
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 md:hidden flex items-center mr-20"
                >
                    <Image
                        src="/images/logo.png"
                        alt="Avetium"
                        width={120}
                        height={32}
                        className="object-contain"
                    />
                </Link>

                {/* User & Notifications */}
                <div className="flex items-center gap-1 md:gap-6 mr-2">
                    <button
                        className="flex items-center hover:bg-gray-100 rounded transition"
                        aria-label="Notifications"
                    >
                        <Bell className="w-6 h-6 text-black" />
                    </button>
                    <div className="flex items-center space-x-1">
                        <Image
                            src="/icons/Frame.png"
                            alt="User"
                            width={40}
                            height={40}
                        />
                        <span className="text-gray-600 text-xs hidden lg:inline-block">&#x25BC;</span>
                    </div>
                </div>
            </header>

            {/* Sidebar (slides in on mobile) */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
            >
                <nav className="mt-16 flex flex-col gap-4 p-4">
                    <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Get Started</Link>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Dashboard</Link>
                    <Link href="/transactions" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Transactions</Link>
                    <Link href="/settings" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Settings</Link>
                </nav>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Topbar;
