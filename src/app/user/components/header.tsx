import { getCategories } from "@/actions/category-actions";
import { CreateTicket } from "./create-ticket";

const Header = async ({ title }: { title: string }) => {
  const { data: categories } = await getCategories();
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <CreateTicket categories={categories || []} editMode={false} />
    </div>
  );
};

export default Header;
