/** @format */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal"; // Assuming you have a modal component

interface GoalCardProps {
  userId: string; // Accept userId as a prop
}

export default function GoalCard({ userId }: GoalCardProps) {
  const [goalAmount, setGoalAmount] = useState<number | null>(null); // State for goal amount
  const [goalDescription, setGoalDescription] = useState<string>(""); // State for goal description
  const [targetDate, setTargetDate] = useState<string>(""); // State for target date
  const [isGoalSet, setIsGoalSet] = useState(false); // To check if goal is set successfully
  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle the modal visibility

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch(`/api/get-goal?userId=${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch goal data");
        }
        const data = await res.json();
        console.log(data+'rakesh sdofkh')
        if (data) {
          setGoalAmount(data.goalAmount);
          setGoalDescription(data.goalDescription);
          setTargetDate(data.targetDate);
          setIsGoalSet(true);
        } else {
          // Handle case where goal is not found
          setGoalAmount(null);
          setGoalDescription("");
          setTargetDate("");
          setIsGoalSet(false);
        }
      } catch (error) {
        console.error("Error fetching goal:", error);
        setIsGoalSet(false); // Optionally reset goal state on error
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
        setIsModalOpen(false); // Close the modal
      } else {
        const errorText = await res.text();
        console.error("Error setting goal:", errorText);
        alert(`Failed to set goal: ${errorText}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert(`Unexpected error: ${error}`);
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
          {goalAmount !== null && <p>Current Goal Amount: ₹{goalAmount}</p>}

          {/* Show button to set or update goal */}
          <Button
            onClick={() => setIsModalOpen(true)}
          >
            {isGoalSet ? "Update Goal" : "Set a New Goal"}
          </Button>
        </CardContent>
      </Card>

      {/* Modal for Goal Input */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-lg font-semibold">
              {isGoalSet ? "Update Goal" : "Set Goal"}
            </h2>
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
              >
                Save Goal
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
