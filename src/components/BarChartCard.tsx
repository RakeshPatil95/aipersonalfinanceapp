import BarChart from "@/components/ui/BarChart";
import { RecentSpends } from "./RecentSpends";
import { Card, CardContent } from "./ui/card";

interface BarChartCardProps {
    userId: string; // Accept userId as a prop
}

export default function BarChartCard({ userId }: BarChartCardProps) {
    return (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
                <CardContent className="p-6">
                <h2 className="font-semibold text-xl mb-2">Overview</h2>
                <BarChart userId={userId} />
                </CardContent>
            </Card>
            <RecentSpends />
        </section>
    );
}
