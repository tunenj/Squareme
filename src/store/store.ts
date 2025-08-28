import { configureStore } from "@reduxjs/toolkit";
import revenueReducer from "./revenueSlice";


export const store = configureStore({ reducer: { revenue: revenueReducer } });


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

