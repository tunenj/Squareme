import "@testing-library/jest-dom";
import { vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RevenueCard from "@/components/RevenueCard/RevenueCard";
import { Providers } from "@/store/Providers";



global.fetch = vi.fn(async () => ({
    ok: true, json: async () => ({
        today: [{ label: "Jan", value: 100 }],
        "7d": [
            { label: "Jan", value: 100 },
            { label: "Feb", value: 200 },
        ],
        "30d": [{ label: "Jan", value: 300 }],
    })
})) as unknown as typeof fetch;


function renderWithStore() {
    return render(
        <Providers>
            <RevenueCard />
        </Providers>
    );
}



it("renders and loads revenue", async () => {
    renderWithStore();
    await waitFor(() => expect(screen.getByText(/₦/)).toBeInTheDocument());
    expect(screen.getByRole("img", { name: /bar chart/i })).toBeInTheDocument();
});


it("switches ranges via tabs", async () => {
    renderWithStore();
    await waitFor(() => screen.getByText("Last 7 days"));
    fireEvent.click(screen.getByRole("button", { name: /today/i }));
    expect(screen.getByText(/vs Last day/)).toBeInTheDocument();
});