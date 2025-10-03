import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import { getUsers } from "@/actions/user-actions";
import EditUser from "./edit-user";
import { auth } from "@clerk/nextjs/server";

const UsersTable = async () => {
  const { data: users } = await getUsers();
  const { userId } = await auth();

  return (
    <div className="space-y-4">
      <Input placeholder="Search users..." className="max-w-sm" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id.slice(0, 13)}...</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell className="flex items-center">
                  {userId === user.clerkId ? (
                    <></>
                  ) : (
                    <EditUser user={user} key={user.role} />
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-28">
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
