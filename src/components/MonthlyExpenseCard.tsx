/** @format */

import React from "react";
import { cn } from "@/lib/utils";
import { CardProps } from "./Card";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect, useState} from "react";

interface TotalSavingsCardProps {
    userId: string; // Accept userId as a prop
  }
  

export default function MonthExpenseCard({userId}: {userId: string}) {

    const [budgetLimit, setBudgetLimit] = useState<number>(0);
    const [isEditingBudget, setIsEditingBudget] = useState(false); // To toggle budget input field
    const [newBudgetLimit, setNewBudgetLimit] = useState<string>(""); // Keep the state as a string to avoid '0'

    const updateBudget = async (newLimit: number) => {
        console.log("Payload being sent:", { userId, salary: newLimit }); // Log the payload
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
                setBudgetLimit(data.budgetLimit);
                setIsEditingBudget(false); // Close the budget input field after a successful update
            } else {
                const errorText = await res.text();
                console.error("Error updating budget limit:", errorText);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };
    

    return (
        <div>
            <Card className="flex flex-col justify-between items-center p-4 w-full h-full border border-gray-200 rounded-lg shadow-sm">
    <CardHeader>
        <CardTitle>Budget Limit</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col justify-center items-center gap-4 w-full bg-transparent">
        <p>Budget Limit: ₹{budgetLimit}</p>
        {!isEditingBudget ? (
            <Button
                onClick={() => setIsEditingBudget(true)}
            >
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
