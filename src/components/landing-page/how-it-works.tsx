import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";

const working = [
  {
    step: "1️⃣",
    title: "Create an account",
    url: "/create-account.png",
  },
  {
    step: "2️⃣",
    title: "Submit your support request",
    url: "/ticket-response.png",
  },
  {
    step: "3️⃣",
    title: "Get updates & responses",
    url: "/updates.png",
  },
  {
    step: "4️⃣",
    title: "Close ticket when resolved",
    url: "/ticket-resolve.png",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {working.map((item, idx) => (
            <Card key={idx} className="text-center">
              <CardHeader className="flex flex-col justify-center items-center">
                <Image
                  width={100}
                  height={100}
                  src={item.url}
                  alt=""
                  priority
                />
              </CardHeader>
              <CardContent>
                <p className="font-medium text-center">{item.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
