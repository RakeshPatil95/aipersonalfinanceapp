'use client';

import BarChartCard from "@/components/BarChartCard";
import GoalCard from '@/components/GoalCard';
import MonthlyBalanceCard from "@/components/MonthlyBalanceCard";
import MonthExpenseCard from "@/components/MonthlyExpenseCard";
import TotalSavingsCard from "@/components/TotalSavingsCard";
import { useSession } from 'next-auth/react'; // Import the useSession hook

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
      <BarChartCard userId={session.user.id}/>
    </div>
  );
}
