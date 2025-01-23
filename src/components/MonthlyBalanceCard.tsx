/** @format */

import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";

interface TotalSavingsCardProps {
    userId: string; // Accept userId as a prop
  }
  

export default function MonthlyBalanceCard({userId}: {userId: string}) {

    const [salary, setSalary] = useState<number>(0);
    const [isEditingSalary, setIsEditingSalary] = useState(false); // To toggle salary input field
    const [newSalary, setNewSalary] = useState<string>(""); // Keep the state as a string to avoid '0';

    const updateSalary = async (newSalary: number) => {
        
        try {
            const res = await fetch("/api/update-salary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Ensure the content type is set
                },
                body: JSON.stringify({ userId: userId, salary: newSalary }), // Ensure it's a valid JSON string
            });
    
            // Check if the response is OK and has valid data
            if (res.ok) {
                const data = await res.json();
                console.log("Response data:", data); // Log the response data for debugging
                setSalary(data.salary);
                setIsEditingSalary(false); // Close the salary input field after successful update
            } else {
                // Handle non-200 responses
                const errorText = await res.text();
                console.error("Error updating salary:", errorText);
                alert(`Failed to update salary: ${errorText}`); // Optional: Show user a more friendly error message
            }
        } catch (error) {
            // Handle network errors
            console.error("Unexpected error:", error);
            alert(`Unexpected error: ${error.message}`); // Optional: Show user a more friendly error message
        }
    };
    

    return (
        <div>
           {/* Salary Section */}
           <Card className="flex flex-col justify-between items-center p-4 w-full h-full border border-gray-200 rounded-lg shadow-sm">
           <CardHeader>
        <CardTitle>Salary</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col justify-center items-center gap-4">
        <p>Current Salary: ₹{salary}</p>
        {/* Display input field or button depending on whether the user is editing salary */}
        {!isEditingSalary ? (
            <Button
                onClick={() => setIsEditingSalary(true)} // Open input field for salary
            >
                Add Salary
            </Button>
        ) : (
            <div className="flex gap-2">
                <Input
                    type="number"
                    placeholder="Enter salary"
                    value={newSalary} // Set the value as the state
                    onChange={(e) => setNewSalary(e.target.value)} // Keep it as a string
                />
                <Button
                    onClick={() => {
                        if (newSalary && !isNaN(Number(newSalary))) {
                            updateSalary(Number(newSalary)); // Update salary if valid
                        }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    Submit
                </Button>
                <Button
                    onClick={() => setIsEditingSalary(false)} // Close input field without submitting
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
