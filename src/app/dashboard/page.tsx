"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ExpenseForm = {
  amount: number;
  description: string;
};

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [salary, setSalary] = useState<number>(0);
  const [budgetLimit, setBudgetLimit] = useState<number>(0);
  const [isEditingSalary, setIsEditingSalary] = useState(false); // To toggle salary input field
  const [newSalary, setNewSalary] = useState<string>(""); // Keep the state as a string to avoid '0'
  const [isEditingBudget, setIsEditingBudget] = useState(false); // To toggle budget input field
  const [newBudgetLimit, setNewBudgetLimit] = useState<string>(""); // Keep the state as a string to avoid '0'
  const { register, handleSubmit, reset } = useForm<ExpenseForm>();

  // Fetch user data (name, salary, budget limit) on mount
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/user-data"); // API that returns the current salary and budget limit
      const data = await res.json();
      setUserName(data.name);
      setSalary(data.salary);
      setBudgetLimit(data.budgetLimit);
    }
    fetchData();
  }, []);

  // Handle sign-out
  const handleSignOut = async () => {
    await fetch("/signout", { method: "POST" });
    window.location.href = "/signin"; // Redirect to the signin page
  };

  const updateSalary = async (newSalary: number) => {
    console.log("Payload being sent:", { salary: newSalary }); // Log the payload
  
    try {
      const res = await fetch("/api/update-salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Make sure this is set
        },
        body: JSON.stringify({ salary: newSalary }), // Make sure this is a valid JSON string
      });
  
      if (res.ok) {
        const data = await res.json();
        setSalary(data.salary);
        setIsEditingSalary(false); // Close the salary input field after successful update
      } else {
        const errorText = await res.text();
        console.error("Error updating salary:", errorText);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const updateBudget = async (newLimit: number) => {
    const res = await fetch("/api/update-budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ limit: newLimit }),
    });
    if (res.ok) {
      const data = await res.json();
      setBudgetLimit(data.budgetLimit);
      setIsEditingBudget(false); // Close the budget input field after successful update
    }
  };

  // Add expense
  const onSubmit: SubmitHandler<ExpenseForm> = async (values) => {
    const res = await fetch("/api/add-expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      reset();
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
        <h1 className="text-lg font-semibold">Welcome, {userName}</h1>
        <div className="flex gap-4 items-center">
          {/* Placeholder for Essential Options */}
          <Button variant="ghost">Home</Button>
          <Button variant="ghost">Profile</Button>
          <Button variant="ghost">Settings</Button>
          {/* Sign-out Button */}
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Section: Salary, Add Expense, and Budget */}
      <div className="flex justify-between items-center gap-6">
        {/* Salary Section */}
        <Card className="w-[20%]">
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

        {/* Add Expense Section */}
        <Card className="w-[40%]">
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                type="number"
                placeholder="Expense Amount"
                {...register("amount", { valueAsNumber: true })}
              />
              <Input
                type="text"
                placeholder="Description"
                {...register("description")}
              />
              <Button type="submit">Add Expense</Button>
            </form>
          </CardContent>
        </Card>

        {/* Budget Section */}
        <Card className="w-[20%]">
          <CardHeader>
            <CardTitle>Budget Limit</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center gap-4">
            <p>Budget Limit: ₹{budgetLimit}</p>
            {/* Display input field or button depending on whether the user is editing budget */}
            {!isEditingBudget ? (
              <Button
                onClick={() => setIsEditingBudget(true)} // Open input field for budget limit
              >
                Set Budget Limit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter budget limit"
                  value={newBudgetLimit} // Set the value as the state
                  onChange={(e) => setNewBudgetLimit(e.target.value)} // Keep it as a string
                />
                <Button
                  onClick={() => {
                    if (newBudgetLimit && !isNaN(Number(newBudgetLimit))) {
                      updateBudget(Number(newBudgetLimit)); // Update budget limit if valid
                    }
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Submit
                </Button>
                <Button
                  onClick={() => setIsEditingBudget(false)} // Close input field without submitting
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
