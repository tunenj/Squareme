"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRevenue, selectRevenueForRange } from "@/store/revenueSlice";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Title,
    type ChartOptions,
    type ChartData,
    type TooltipItem,
    type Plugin,
    type Chart,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChevronDown } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

type RangeKey = "today" | "7d" | "30d";
type Point = { label: string; value: number };

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const formatShort = (v: number) => `${v / 1000}k`;

// Chart area border plugin
const chartAreaBorder: Plugin<"bar"> = {
    id: "chartAreaBorder",
    beforeDraw(chart: Chart<"bar">) {
        const { ctx, chartArea } = chart;
        ctx.save();
        ctx.strokeStyle = "#E2E8F0";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
        ctx.restore();
    },
};

function DataRangeSelector({
    value,
    onChange,
}: { value: RangeKey; onChange: (v: RangeKey) => void }) {
    const options: Array<{ key: RangeKey; label: string }> = [
        { key: "today", label: "Today" },
        { key: "7d", label: "Last 7 days" },
        { key: "30d", label: "Last 30 days" },
    ];

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 p-3">
                <span className="text-sm text-[#475569]">Showing data for</span>
                <div className="relative">
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value as RangeKey)}
                        className="appearance-none border border-[#CBD5E1] rounded-md px-3 py-1.5 pr-8 text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3976E8] w-full sm:w-auto"
                    >
                        {options.map((o) => (
                            <option key={o.key} value={o.key}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={16}
                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]"
                    />
                </div>
            </div>

            <div className="flex gap-2 rounded-xl bg-[#F1F5F9] p-1 self-start sm:self-auto overflow-x-auto">
                {options.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => onChange(t.key as RangeKey)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition whitespace-nowrap ${value === t.key
                            ? "bg-[#F0F9FF] text-[#0F172A] border border-[#BAE6FD] shadow-sm"
                            : "text-black"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function MiniBarChart({ data, height = 250 }: { data: Point[]; height?: number }) {
    const [barThickness, setBarThickness] = useState<number>(22);
    const [fontSize, setFontSize] = useState<number>(12);

    useEffect(() => {
        const updateResponsiveSettings = () => {
            const isMobile = window.innerWidth < 640;
            setBarThickness(isMobile ? 10 : 22);
            setFontSize(isMobile ? 10 : 12);
        };

        updateResponsiveSettings();
        window.addEventListener("resize", updateResponsiveSettings);
        return () => window.removeEventListener("resize", updateResponsiveSettings);
    }, []);

    const valueByLabel = new Map<string, number>(data.map((d) => [d.label, d.value]));
    const values: number[] = Array.from(MONTHS, (m) => valueByLabel.get(m) ?? 0);
    const labels: string[] = Array.from(MONTHS);

    const chartData: ChartData<"bar"> = {
        labels,
        datasets: [
            {
                label: "Revenue",
                data: values,
                backgroundColor: "#FFC145",
                borderRadius: 6,
                barThickness,
                borderSkipped: false,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (ctx: TooltipItem<"bar">) => `₦${formatShort(Number(ctx.parsed.y))}`,
                },
            },
        },
        scales: {
            x: {
                display: true,
                grid: { display: false },
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    font: {
                        size: fontSize
                    }
                },
            },
            y: {
                display: true,
                beginAtZero: true,
                min: 100000,
                max: 600000,
                ticks: {
                    stepSize: 100000,
                    callback: (val: number | string): string => formatShort(Number(val)),
                    font: {
                        size: fontSize
                    }
                },
                grid: { color: "rgba(148,163,184,0.2)" },
            },
        },
    };

    return (
        <Bar
            data={chartData}
            options={options}
            height={height}
            plugins={[chartAreaBorder]}
        />
    );
}

export default function RevenueCard() {
    const dispatch = useAppDispatch();
    const [active, setActive] = useState<RangeKey>("7d");
    const { status, error } = useAppSelector((s) => s.revenue);
    const data = useAppSelector((s) => selectRevenueForRange(s, active));

    useEffect(() => {
        dispatch(fetchRevenue());
    }, [dispatch]);

    return (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-8">
            {/* Mobile Header - Only visible on mobile */}
            <div className="flex justify-between items-center mb-4 sm:hidden">
                <h2 className="text-lg font-semibold text-[#0F172A]">Revenue</h2>
                <div className="flex items-center gap-2 bg-[#F1F5F9] rounded-lg px-3 py-1.5">
                    <span className="text-sm text-[#475569]">Weekly</span>
                    <ChevronDown size={16} className="text-[#64748B]" />
                </div>
            </div>

            <div className="hidden sm:block mb-4">
                <DataRangeSelector value={active} onChange={setActive} />
            </div>

            <div className="rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-sm">
                {/* Desktop-only text content */}
                <div className="hidden sm:flex flex-col space-y-1 sm:flex-row sm:justify-between">
                    <div>
                        <p className="text-sm text-[#475569]">
                            Revenue{" "}
                            <span className="text-emerald-600 font-medium">+0.00%</span>{" "}
                            <span className="text-[#94A3B8] text-xs">
                                vs Last {active === "today" ? "day" : active === "7d" ? "7 days" : "30 days"}
                            </span>
                        </p>
                        <p className="text-xs text-[#94A3B8] lg:mt-2">
                            <span className="text-2xl sm:text-3xl font-bold text-black tracking-tight mr-2">₦0.00</span>
                            in total value
                        </p>
                    </div>
                </div>

                {/* Enlarged chart container for mobile */}
                <div className="mt-0 sm:mt-6 h-[220px] sm:h-[220px] w-full">
                    <MiniBarChart data={data} />
                </div>

                {status === "loading" && <p className="mt-4 text-sm text-[#64748B]">Loading…</p>}
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}