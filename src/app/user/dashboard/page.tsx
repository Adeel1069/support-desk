import { getCurrentUser } from "@/actions/auth-actions";
import RecentTickets from "../components/recent-tickets";
import Stats from "../components/stats";

const UserDashboard = async () => {
  const { data: user } = await getCurrentUser();
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
        <Stats />
        <RecentTickets />
      </div>
    </main>
  );
};

export default UserDashboard;
