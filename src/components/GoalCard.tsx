/** @format */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GoalCardProps {
  userId: string; // Accept userId as a prop
}

export default function GoalCard({ userId }: GoalCardProps) {
  const [goalAmount, setGoalAmount] = useState<number | null>(null); // State for goal amount
  const [goalDescription, setGoalDescription] = useState<string>(""); // State for goal description
  const [targetDate, setTargetDate] = useState<string>(""); // State for target date
  const [isSettingGoal, setIsSettingGoal] = useState(false); // To toggle goal input field
  const [isGoalSet, setIsGoalSet] = useState(false); // To check if goal is set successfully

  // Fetch the goal amount when the component mounts (e.g., from the API or state)
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch(`/api/get-goal?userId=${userId}`);
        const data = await res.json();
        if (data.goal) {
          setGoalAmount(data.goal.goalAmount); // Set the goal amount if it exists
          setGoalDescription(data.goal.goalDescription); // Set the goal description if it exists
          setTargetDate(data.goal.targetDate); // Set the target date if it exists
          setIsGoalSet(true); // Set goal is already set
        }
      } catch (error) {
        console.error("Error fetching goal:", error);
      }
    };

    fetchGoal();
  }, [userId]);

  // Function to handle API call to set or update the goal
  const setGoal = async () => {
    try {
      const payload = {
        userId: userId,
        goalAmount: goalAmount,
        goalDescription: goalDescription,
        targetDate: targetDate,
      };

      const res = await fetch("/api/set-goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(payload), // Send the payload in the body
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Goal set successfully:", data);
        setGoalAmount(data.amount); // Update the goal amount if goal is set
        setIsGoalSet(true); // Set goal successfully
        setIsSettingGoal(false); // Close the input fields
      } else {
        const errorText = await res.text();
        console.error("Error setting goal:", errorText);
        alert(`Failed to set goal: ${errorText}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert(`Unexpected error: ${error.message}`);
    }
  };

  return (
    <div>
      {/* Goal Setting Section */}
      <Card className="flex flex-col justify-between items-center p-4 w-full h-full border border-gray-200 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>Set Goal</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center gap-4">
          {/* Display current goal amount if set */}
          {goalAmount !== null && (
            <p>Current Goal Amount: ₹{goalAmount}</p>
          )}

          {/* Show form if the goal is not yet set */}
          {!isGoalSet ? (
            <>
              {!isSettingGoal ? (
                <Button onClick={() => setIsSettingGoal(true)}>
                  Set a New Goal
                </Button>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Goal Amount */}
                  <Input
                    type="number"
                    placeholder="Enter goal amount"
                    value={goalAmount || ""}
                    onChange={(e) => setGoalAmount(Number(e.target.value))}
                  />
                  {/* Goal Description */}
                  <Input
                    type="text"
                    placeholder="Goal description"
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                  />
                  {/* Target Date */}
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={setGoal}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Set Goal
                    </Button>
                    <Button
                      onClick={() => setIsSettingGoal(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Show button to update goal if already set */}
              <Button
                onClick={() => setIsSettingGoal(true)}
              >
                Update Goal
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
