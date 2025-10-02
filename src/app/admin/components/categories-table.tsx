import { getCategories } from "@/actions/category-actions";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { CreateCategory } from "./create-category";
import DeleteCategoryButton from "./delete-category";

const CategoriesTable = async () => {
  const { data } = await getCategories();

  return (
    <div className="space-y-4">
      <Input placeholder="Search category..." className="max-w-sm" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>{category.updatedAt.toLocaleDateString()}</TableCell>
                <TableCell className="flex items-center">
                  <CreateCategory category={category} editMode={true} />
                  <DeleteCategoryButton category={category} />
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

export default CategoriesTable;
