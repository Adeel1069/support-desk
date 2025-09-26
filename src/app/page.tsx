import { getCurrentUser } from "@/actions/auth-actions";
import { currentUser } from "@clerk/nextjs/server";

const HomePage = async () => {
  const user = await currentUser();

  if (!user) {
    return <h1>Please login to continue</h1>;
  }

  const { success, data } = await getCurrentUser();
  if (success && data) return <h1>Welcome {data.name} to Support Desk</h1>;
};

export default HomePage;
