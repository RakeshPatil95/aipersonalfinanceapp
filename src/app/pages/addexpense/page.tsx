'use client';
/** @format */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function AddExpense() {
  const [userId, setUserId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<string>("Food");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  const categories = ["Food", "Travel", "Rent", "Installment"];

  // Fetch userId from search params on client side
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setUserId(searchParams.get("userId"));
  }, []);

  useEffect(() => {
    let isMounted = true;
  
    const fetchExpenses = async () => {
      if (!userId) return;
  
      try {
        const res = await fetch(`/api/get-expenses?userId=${userId}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          const total = data.expenses.reduce(
            (sum: number, expense: { amount: number }) => sum + expense.amount,
            0
          );
          setTotalExpenses(total);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
  
    fetchExpenses();
  
    return () => {
      isMounted = false; // Prevent state updates after unmounting
    };
  }, [userId]);
  

  const addExpense = async () => {
    if (amount === "" || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const expenseData = {
      userId: Number(userId),
      amount: Number(amount),
      date: new Date(),
      description: isCustomCategory ? customCategory : category,
    };

    try {
      const res = await fetch("/api/add-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (res.ok) {
        setTotalExpenses((prev) => prev + Number(amount)); // Update total expenses state
        alert("Expense added successfully!");
        setAmount("");
        setCustomCategory("");
      } else {
        const errorText = await res.text();
        alert(`Failed to add expense: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setIsCustomCategory(false);
                }}
                className={category === cat ? "bg-blue-500" : "bg-gray-500"}
              >
                {cat}
              </Button>
            ))}
            <Button
              onClick={() => setIsCustomCategory(true)}
              className={isCustomCategory ? "bg-blue-500" : "bg-gray-500"}
            >
              Custom Category
            </Button>
          </div>
          {isCustomCategory && (
            <Input
              type="text"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button onClick={addExpense}>Add Expense</Button>
          <p className="mt-4">Total Expenses: ₹{totalExpenses}</p>
        </CardContent>
      </Card>
    </div>
  );
}
