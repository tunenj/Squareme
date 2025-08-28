"use client";

import AccountDetails from "@/components/AccountDetails/AccountDetails";
import RevenueCard from "@/components/RevenueCard/RevenueCard";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <AccountDetails />
            <RevenueCard />
        </div>
    );
}