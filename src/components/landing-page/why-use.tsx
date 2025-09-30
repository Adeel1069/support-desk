import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const usage = [
  {
    title: "Fast, transparent communication",
    description:
      "Stay informed with real-time updates and seamless support conversations.",
  },
  {
    title: "Easy-to-use interface",
    description:
      "Designed with simplicity in mind so anyone can raise or manage tickets easily.",
  },
  {
    title: "Secure login with Clerk",
    description:
      "Clerk ensures secure authentication and safe data handling for all users.",
  },
  {
    title: "Scalable for teams & companies",
    description:
      "Perfect for individuals, growing teams, or enterprise-level organizations.",
  },
];

const WhyUse = () => {
  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Use Support Desk?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {usage.map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg font-semibold">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 text-center">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUse;
