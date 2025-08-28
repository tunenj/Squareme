import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type RangeKey = "today" | "7d" | "30d";

export interface RevenuePoint { label: string; value: number }
interface RevenueState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error?: string;
    data: Record<RangeKey, RevenuePoint[]>;
}

const initialState: RevenueState = {
    status: "idle",
    data: { today: [], "7d": [], "30d": [] },
};

export const fetchRevenue = createAsyncThunk("revenue/fetch", async () => {
    const res = await fetch("/api/revenue");
    if (!res.ok) throw new Error("Failed to load revenue");
    return (await res.json()) as RevenueState["data"];
});

const slice = createSlice({
    name: "revenue",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchRevenue.pending, (s) => {
            s.status = "loading";
            s.error = undefined;
        })
            .addCase(fetchRevenue.fulfilled, (s, a) => {
                s.status = "succeeded";
                s.data = a.payload;
            })
            .addCase(fetchRevenue.rejected, (s, a) => {
                s.status = "failed";
                s.error = a.error.message;
            });
    },
});

export default slice.reducer;

export const selectRevenueForRange = createSelector(
    [(state: RootState) => state.revenue.data, (_: RootState, key: RangeKey) => key],
    (data, key) => data[key] ?? []
);