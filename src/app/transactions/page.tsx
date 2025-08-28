"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


export type TxStatus = "Processed" | "Failed" | "Pending";
export type TxType = "Transfer" | "Withdrawal" | "Deposit" | "Request";
export interface Transaction {
    id: string;
    transactionId: string;
    amount: number;
    type: TxType;
    date: string;
    time: string;
    status: TxStatus;
}

// Mock data (20 items)
const MOCK_DATA: Transaction[] = Array.from({ length: 20 }).map((_, i) => ({
    id: String(i + 1),
    transactionId: "TR_8401857902",
    amount: [43644, 35471, 38948][i % 3],
    type: ["Transfer", "Withdrawal", "Deposit", "Request"][i % 4] as TxType,
    date: "2022-02-12",
    time: "10:30",
    status: ["Processed", "Failed"][i % 2] as TxStatus,
}));

// Utils
const formatNaira = (value: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
        value
    );
const formatDatePretty = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

// Status Badge
const StatusBadge: React.FC<{ status: TxStatus }> = ({ status }) => {
    const cfg = {
        Processed: {
            dot: "bg-emerald-500",
            pill: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
        },
        Failed: {
            dot: "bg-rose-500",
            pill: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
        },
        Pending: {
            dot: "bg-amber-500",
            pill: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
        },
    } as const;
    const c = cfg[status];
    return (
        <span
            className={`inline-flex items-center justify-center gap-2 min-w-[110px] px-3 py-1.5 rounded-full text-xs font-medium ${c.pill}`}
        >
            <span className={`h-2 w-2 rounded-full ${c.dot}`} />
            {status}
        </span>
    );
};

// Checkbox
const Checkbox: React.FC<{
    checked?: boolean;
    onChange?: (v: boolean) => void;
    "aria-label"?: string;
}> = ({ checked, onChange, ...rest }) => (
    <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-gray-600"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
    />
);
// Pagination
const Pagination: React.FC<{
    page: number;
    pages: number;
    onPageChange: (p: number) => void;
}> = ({ page, pages, onPageChange }) => {
    if (pages <= 1) return null;
    const canPrev = page > 1;
    const canNext = page < pages;
    return (
        <div className="flex items-center justify-end gap-2">
            <button
                className="btn-muted"
                onClick={() => onPageChange(1)}
                disabled={!canPrev}
            >
                «
            </button>
            <button
                className="btn-muted"
                onClick={() => onPageChange(page - 1)}
                disabled={!canPrev}
            >
                ‹
            </button>
            <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 p-1 text-sm">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`h-8 w-8 rounded-md leading-8 text-center ${p === page
                            ? "bg-white text-blue border border-blue-500"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
            <button
                className="btn-muted"
                onClick={() => onPageChange(page + 1)}
                disabled={!canNext}
            >
                ›
            </button>
            <button
                className="btn-muted"
                onClick={() => onPageChange(pages)}
                disabled={!canNext}
            >
                »
            </button>
        </div>
    );
};

// Main Component
export default function TransactionsTable() {
    const router = useRouter();

    const [page, setPage] = useState(1);
    const pageSize = 6;
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const data = useMemo(() => MOCK_DATA, []);
    const pages = Math.max(1, Math.ceil(data.length / pageSize));
    const pageData = data.slice((page - 1) * pageSize, page * pageSize);
    const allVisibleChecked = pageData.every((r) => selected[r.id]);
    const toggleAllVisible = (check: boolean) => {
        const next = { ...selected };
        pageData.forEach((r) => (next[r.id] = check));
        setSelected(next);
    };

    return (
        <div className="lg:pt-11 pt-10 space-y-4">
            {/* Back Arrow and Heading */}
            <div className="md:hidden flex items-center gap-3 text-lg font-semibold mb-4">
                <button
                    aria-label="Go Back to Dashboard"
                    onClick={() => router.push("/dashboard")}
                    className="inline-flex items-center justify-center p-1 rounded-md hover:bg-gray-100"
                >
                    <Image src="/icons/arrow.png" width={24} height={24} alt="" />
                </button>
                <span>Transactions</span>
            </div>

            {/* Top Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50">
                        All Accounts
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="opacity-70"
                        >
                            <path
                                d="M6 9l6 6 6-6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden text-sm text-gray-500 sm:block">
                        Select Date Range:
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm">
                        <Image src="/icons/calendar.png" width={20} height={20} alt="" />
                        <span>
                            {new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm font-medium text-black">
                        <Image src="/icons/upload-cloud.png" width={20} height={20} alt="" />
                        Export
                    </button>
                </div>
            </div>

            {/* Transactions Container */}
            <div className="bg-white">
                {/* Desktop Table */}
                <table className="min-w-full text-left text-sm hidden lg:table">
                    <thead className="bg-gray-50 text-[#84919A]">
                        <tr>
                            <th className="w-10 px-4 py-3">
                                <Checkbox
                                    checked={allVisibleChecked}
                                    onChange={toggleAllVisible}
                                    aria-label="Select all visible"
                                />
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#84919A] text-[12px] leading-4">
                                Amount
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#84919A] text-[12px] leading-4">
                                Transaction ID
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#84919A] text-[12px] leading-4">
                                Transaction Type
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#84919A] text-[12px] leading-4">
                                Date
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#84919A] text-[12px] leading-4">
                                Time
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#84919A] text-[12px] leading-4">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 border-2 border-gray-200">
                        {pageData.map((t) => (
                            <tr
                                key={t.id}
                                className="hover:bg-gray-50/60 rounded"
                            >
                                <td className="px-4 py-4">
                                    <Checkbox
                                        checked={!!selected[t.id]}
                                        onChange={(v) =>
                                            setSelected((s) => ({ ...s, [t.id]: v }))
                                        }
                                    />
                                </td>
                                <td className="px-4 py-4 font-normal text-black text-[14px] leading-[22px]">
                                    {formatNaira(t.amount)}
                                </td>
                                <td className="px-4 py-4 font-normal text-[#535379] text-[14px] leading-[22px]">
                                    {t.transactionId}
                                </td>
                                <td className="px-4 py-4 font-normal text-[#535379] text-[14px] leading-[22px]">
                                    {t.type}
                                </td>
                                <td className="px-4 py-4 font-normal text-[#535379] text-[14px] leading-[22px]">
                                    {formatDatePretty(t.date)}
                                </td>
                                <td className="px-4 py-4 font-normal text-[#535379] text-[14px] leading-[22px]">
                                    {t.time}AM
                                </td>
                                <td className="px-4 py-4">
                                    <StatusBadge status={t.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile Card List */}
                <div className="flex flex-col gap-4 lg:hidden">
                    {pageData.map((t) => (
                        <div
                            key={t.id}
                            className="border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                            <div className="flex justify-between mb-2">
                                <div className="font-semibold text-sm uppercase tracking-wide text-gray-600">
                                    Amount:
                                </div>
                                <div className="text-sm font-normal text-black">
                                    {formatNaira(t.amount)}
                                </div>
                            </div>
                            <div className="flex justify-between mb-2">
                                <div className="font-semibold text-sm uppercase tracking-wide text-gray-600">
                                    Transaction Type:
                                </div>
                                <div className="text-sm font-normal text-gray-700">{t.type}</div>
                            </div>
                            <div className="flex justify-between mb-2">
                                <div className="font-semibold text-sm uppercase tracking-wide text-gray-600">
                                    Date:
                                </div>
                                <div className="text-sm font-normal text-gray-700">
                                    {formatDatePretty(t.date)} {t.time}AM
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="font-semibold text-sm uppercase tracking-wide text-gray-600">
                                    Status:
                                </div>
                                <StatusBadge status={t.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
                <div>
                    Showing {pageData.length} of {data.length} results
                </div>
                <Pagination page={page} pages={pages} onPageChange={setPage} />
            </div>

            <style jsx global>{`
        .btn-muted {
          @apply inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white;
        }
      `}</style>
        </div>
    );
}
