import { NextResponse } from "next/server";


export async function GET() {
    // Mock data derived from the design (values are illustrative)
    const months = [
        { label: "Jan", value: 280000 },
        { label: "Feb", value: 450000 },
        { label: "Mar", value: 360000 },
        { label: "Apr", value: 280000 },
        { label: "May", value: 120000 },
        { label: "Jun", value: 180000 },
        { label: "Jul", value: 170000 },
        { label: "Aug", value: 190000 },
        { label: "Sep", value: 160000 },
        { label: "Oct", value: 170000 },
        { label: "Nov", value: 220000 },
        { label: "Dec", value: 0 },
    ];


    const payload = {
        today: months.slice(0, 1),
        "7d": months, // reuse months for demo
        "30d": months,
    } as const;


    return NextResponse.json(payload);
}