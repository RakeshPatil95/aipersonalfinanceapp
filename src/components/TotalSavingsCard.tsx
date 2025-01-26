/** @format */

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TotalSavingsCardProps {
  userId: string; // Accept userId as a prop
}

export default function TotalSavingsCard({ userId }: TotalSavingsCardProps) {
  const [savings, setSavings] = useState<number | null>(null); // Track total savings
  const [loading, setLoading] = useState<boolean>(true); // Track API call state
  const [error, setError] = useState<string | null>(null); // Track errors

  // Fetch total savings from the API
  const fetchSavings = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/fetch-savings?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSavings(data.savings); // Set the fetched savings value
      } else {
        const errorText = await res.text();
        setError(`Error fetching savings: ${errorText}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred while fetching savings.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch savings on component mount
  useEffect(() => {
    fetchSavings();
  }, [userId]);

  return (
    <div>
      <Card className="flex flex-col justify-between items-center p-4 w-full h-full border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="text-center">
          <CardTitle>Total Savings</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-8">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p
              className={`text-4xl md:text-5xl font-bold ${
                savings !== null && savings >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ₹{savings !== null ? savings.toLocaleString() : "N/A"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
