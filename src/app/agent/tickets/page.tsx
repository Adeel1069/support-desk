import TicketsTable from "../components/tickets-table";

const TicketsPage = async () => {
  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tickets</h1>
        </div>
        <TicketsTable />
      </div>
    </main>
  );
};

export default TicketsPage;
