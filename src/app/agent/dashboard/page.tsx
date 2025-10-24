import { getCurrentUser } from "@/actions/auth-actions";
import { getTicketCounts } from "@/actions/ticket-action";
import TicketsTable from "../components/tickets-table";
import TicketStats from "@/components/tickets-stats";

const AgentDashboard = async () => {
  const { data: user } = await getCurrentUser();
  const { data: counts } = await getTicketCounts();
  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Welcome back,{" "}
            <span className="text-blue-700">{user?.name || user?.email} </span>{" "}
            👋
          </h1>
        </div>
        <TicketStats counts={counts || null} />
        <TicketsTable isRecentTable />
      </div>
    </main>
  );
};

export default AgentDashboard;
