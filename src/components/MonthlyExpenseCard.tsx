/** @format */

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MonthExpenseCardProps {
  userId: string; // Accept userId as a prop
}

export default function MonthExpenseCard({ userId }: MonthExpenseCardProps) {
  const [budgetLimit, setBudgetLimit] = useState<number>(0); // Track the budget limit
  const [isEditingBudget, setIsEditingBudget] = useState(false); // To toggle budget input field
  const [newBudgetLimit, setNewBudgetLimit] = useState<string>(""); // Track the new budget input
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track errors

  // Fetch the user's budget from the database
  const fetchBudgetLimit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/get-budget?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBudgetLimit(data.budgetLimit || 0); // Set the fetched budget or default to 0
      } else {
        const errorText = await res.text();
        setError(`Failed to fetch budget limit: ${errorText}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred while fetching the budget limit.");
    } finally {
      setLoading(false);
    }
  };

  // Update the budget in the database
  const updateBudget = async (newLimit: number) => {
    try {
      const res = await fetch("/api/update-budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, limit: newLimit }),
      });

      if (res.ok) {
        const data = await res.json();
        setBudgetLimit(data.budgetLimit); // Update the budget limit state
        setIsEditingBudget(false); // Close the input field
      } else {
        const errorText = await res.text();
        console.error("Error updating budget limit:", errorText);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // Fetch budget limit when the component mounts
  useEffect(() => {
    fetchBudgetLimit();
  }, [userId]);

  return (
    <div>
      <Card className="flex flex-col justify-between items-center p-4 w-full h-full border border-gray-200 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Budget Limit</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center gap-4 w-full bg-transparent">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p>Budget Limit: ₹{budgetLimit}</p>
          )}
          {!isEditingBudget ? (
            <Button onClick={() => setIsEditingBudget(true)}>
              Set Budget Limit
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Input
                type="number"
                placeholder="Enter budget limit"
                value={newBudgetLimit}
                onChange={(e) => setNewBudgetLimit(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md p-2"
              />
              <Button
                onClick={() => {
                  if (newBudgetLimit && !isNaN(Number(newBudgetLimit))) {
                    updateBudget(Number(newBudgetLimit));
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Submit
              </Button>
              <Button
                onClick={() => setIsEditingBudget(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
