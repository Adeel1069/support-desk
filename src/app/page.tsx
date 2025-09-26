import { prisma } from "@/lib/prisma";

const HomePage = async () => {
  const users = await prisma.user.findMany();
  console.info(users);
  return <h1>Welcome to Support Desk</h1>;
};

export default HomePage;
