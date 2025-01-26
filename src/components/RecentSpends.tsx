/** @format */
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { formatDate } from "@/lib/utils";

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
}

export function RecentSpends() {
  const { data: session } = useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/get-recent-expenses?userId=${session.user.id}`);
          const data = await response.json();
          setExpenses(data.expenses);
          setTotalSpent(data.totalSpent);
        } catch (error) {
          console.error("Error fetching expenses:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExpenses();
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <section className="mb-6">
          <h2 className="font-semibold text-xl mb-2">Recent Expenses</h2>
          <p className="text-xl font-bold text-red-500">
            Total Spent: ₹{totalSpent.toLocaleString()}
          </p>
        </section>
        
        <div className="flex flex-col space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center p-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-medium">{expense.description}</span>
                <span className="text-sm text-gray-500">
                  {formatDate(new Date(expense.date))}
                </span>
              </div>
              <span className="text-lg font-semibold text-red-500">
                -₹{expense.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
