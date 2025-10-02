import CategoriesTable from "../components/categories-table";
import { CreateCategory } from "../components/create-category";

const CategoriesPage = async () => {
  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categories</h1>
          <CreateCategory editMode={false} />
        </div>
        <CategoriesTable />
      </div>
    </main>
  );
};

export default CategoriesPage;
