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
import { RecentSpends } from '@/components/RecentSpends';

export default function Dashboard() {
  const { data: session, status } = useSession(); // Get session data
  const isLoading = status === "loading"; // Handle loading state

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while session data is being fetched
  }

  if (!session?.user?.id) {
    return <div>Please sign in to view the dashboard.</div>; // Show a fallback message if no user is logged in
  }

  return (
    <div className="flex flex-col gap-5 w-full">

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
      <RecentSpends/>
      </section>
    </div>
  );
}
