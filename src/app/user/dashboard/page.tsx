import { Button } from "@/components/ui/button";
import RecentTickets from "../components/recent-tickets";
import Stats from "../components/stats";
import Link from "next/link";

const UserDashboard = () => {
  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome back, Adeel 👋</h1>
          <Button>
            <Link href="/user/tickets">New Ticket</Link>
          </Button>
        </div>
        <Stats />
        <RecentTickets />
      </div>
    </main>
  );
};

export default UserDashboard;
