import { getTickets } from "@/actions/ticket-action";
import TicketsTableClient from "../components/tickets-table-client";
import { getCategories } from "@/actions/category-actions";
import { getUsers } from "@/actions/user-actions";
import { Role } from "@/generated/prisma";
import { getCurrentUser } from "@/actions/auth-actions";

const TicketsPage = async () => {
  const { data: categories } = await getCategories();
  const { data: currentUser } = await getCurrentUser();
  const { data: users } = await getUsers({ filters: { role: Role.AGENT } });
  const initialData = await getTickets({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="space-y-10">
        <TicketsTableClient
          initialData={initialData}
          categories={categories || []}
          users={users || []}
          currentUser={currentUser || null}
        />
      </div>
    </main>
  );
};

export default TicketsPage;
