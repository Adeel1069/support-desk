import TicketsTable from "../components/tickets-table";
import Header from "../components/header";

const TicketsPage = () => {
  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="space-y-10">
        <Header title="My Tickets" />
        <TicketsTable />
      </div>
    </main>
  );
};

export default TicketsPage;
