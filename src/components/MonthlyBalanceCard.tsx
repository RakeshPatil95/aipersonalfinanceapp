/** @format */

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MonthlyBalanceCardProps {
  userId: string; // Accept userId as a prop
}

export default function MonthlyBalanceCard({ userId }: MonthlyBalanceCardProps) {
  const [salary, setSalary] = useState<number>(0); // Track the salary
  const [isEditingSalary, setIsEditingSalary] = useState(false); // To toggle salary input field
  const [newSalary, setNewSalary] = useState<string>(""); // Track the new salary input
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track errors

  // Fetch the user's salary from the database
  const fetchSalary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/get-salary?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSalary(data.salary || 0); // Set the fetched salary or default to 0
      } else {
        const errorText = await res.text();
        setError(`Failed to fetch salary: ${errorText}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred while fetching salary.");
    } finally {
      setLoading(false);
    }
  };

  // Update the salary in the database
  const updateSalary = async (newSalary: number) => {
    try {
      const res = await fetch("/api/update-salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, salary: newSalary }),
      });

      if (res.ok) {
        const data = await res.json();
        setSalary(data.salary); // Update the salary state
        setIsEditingSalary(false); // Close the input field
      } else {
        const errorText = await res.text();
        console.error("Error updating salary:", errorText);
        alert(`Failed to update salary: ${errorText}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert(`Unexpected error: ${error.message}`);
    }
  };

  // Fetch salary when the component mounts
  useEffect(() => {
    fetchSalary();
  }, [userId]);

  return (
    <div>
      <Card className="flex flex-col justify-between items-center p-4 w-full h-full border border-gray-200 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Salary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center gap-4">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p>Current Salary: ₹{salary}</p>
          )}
          {!isEditingSalary ? (
            <Button onClick={() => setIsEditingSalary(true)}>Add Salary</Button>
          ) : (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter salary"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (newSalary && !isNaN(Number(newSalary))) {
                    updateSalary(Number(newSalary));
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Submit
              </Button>
              <Button
                onClick={() => setIsEditingSalary(false)}
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
