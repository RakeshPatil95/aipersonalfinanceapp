'use client';

import { useSession } from 'next-auth/react'; // Import the useSession hook
import Card, { CardContent, CardProps } from "@/components/Card";
import MonthExpenseCard from "@/components/MonthlyExpenseCard";
import MonthlyBalanceCard from "@/components/MonthlyBalanceCard";
import PageTitle from "@/components/PageTitle";
import BarChart from "@/components/ui/BarChart";
import SalesCard, { SalesProps } from "@/components/ui/SalesCard";
import TotalSavingsCard from "@/components/TotalSavingsCard";
import GoalCard from '@/components/GoalCard';

export default function NewHomePage() {
  const { data: session, status } = useSession(); // Get session data
  const isLoading = status === "loading"; // Handle loading state

  const uesrSalesData: SalesProps[] = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      saleAmount: "+$1,999.00",
    },
    {
      name: "Jackson Lee",
      email: "isabella.nguyen@email.com",
      saleAmount: "+$1,999.00",
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      saleAmount: "+$39.00",
    },
    {
      name: "William Kim",
      email: "will@email.com",
      saleAmount: "+$299.00",
    },
    {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      saleAmount: "+$39.00",
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while session data is being fetched
  }

  if (!session?.user?.id) {
    return <div>Please sign in to view the dashboard.</div>; // Show a fallback message if no user is logged in
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Dashboard" />

      {/* Updated Section for 4 Cards in a Row */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <TotalSavingsCard userId={session.user.id} />
        <GoalCard userId={session.user.id}/>
        <MonthlyBalanceCard userId={session.user.id}/>
        <MonthExpenseCard userId={session.user.id}/>
      </section>

      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>
          <BarChart />
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recent Sales</p>
            <p className="text-sm text-gray-400">
              You made 265 sales this month.
            </p>
          </section>
          {uesrSalesData.map((d, i) => (
            <SalesCard
              key={i}
              email={d.email}
              name={d.name}
              saleAmount={d.saleAmount}
            />
          ))}
        </CardContent>
      </section>
    </div>
  );
}
