import UsersTable from "../components/users-table";

const UsersPage = async () => {
  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <UsersTable />
      </div>
    </main>
  );
};

export default UsersPage;
