"use client";

import { useEffect, useState } from "react";
import {
    Bar,
    BarChart as BarGraph,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

interface BarChartProps {
    userId: string;
}

export default function BarChart({ userId }: BarChartProps) {
    const [data, setData] = useState<{ name: string; total: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`/api/monthly-expenses?userId=${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch expenses data");
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [userId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (data.length === 0) {
        return <p>No expense data available.</p>;
    }

    return (
        <ResponsiveContainer width={"100%"} height={350}>
            <BarGraph data={data}>
                <XAxis
                    dataKey={"name"}
                    tickLine={false}
                    axisLine={false}
                    stroke="#888888"
                    fontSize={12}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                />
                <Bar dataKey={"total"} radius={[4, 4, 0, 0]} />
            </BarGraph>
        </ResponsiveContainer>
    );
}
