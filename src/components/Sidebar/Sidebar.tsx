"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


const Sidebar: React.FC = () => {
    const path = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Get Started", path: "/", icon: "/icons/globe.png" },
        { name: "Dashboard", path: "/dashboard", icon: "/icons/element-1.png" },
        { name: "Accounts", path: "/#", icon: "/icons/empty-wallet.png" },
        { name: "Transfers", path: "/#", icon: "/icons/coins-swap.png" },
        { name: "Transactions", path: "/transactions", icon: "/icons/document.png" },
        { name: "Settings", path: "/#", icon: "/icons/setting-2.png" },
    ];

    return (
        <>
            {/* Mobile overlay (under sidebar, above page) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-40 h-full w-64 bg-white text-[#04004D] flex flex-col border-r border-gray-200
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
            >
                {/* Spacer for topbar/logo height */}
                <div className="h-26" />

                <nav className="flex flex-col gap-2 font-medium overflow-y-auto pb-6">
                    {navItems.map((item) => {
                        const isActive = path === item.path;

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-3 h-11 w-full px-4 transition
                  ${isActive ? "bg-[#3976E8] text-white" : "hover:bg-gray-100 text-[#04004D]"}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {/* Icon colored via CSS mask to guarantee exact colors */}
                                <span
                                    aria-hidden
                                    className={`h-6 w-6 shrink-0 ${isActive ? "bg-white" : "bg-[#04004D]"}`}
                                    style={{
                                        WebkitMaskImage: `url(${item.icon})`,
                                        maskImage: `url(${item.icon})`,
                                        WebkitMaskRepeat: "no-repeat",
                                        maskRepeat: "no-repeat",
                                        WebkitMaskPosition: "center",
                                        maskPosition: "center",
                                        WebkitMaskSize: "contain",
                                        maskSize: "contain",
                                    }}
                                />
                                <span className="text-sm leading-[150%]">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
