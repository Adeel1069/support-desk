import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const features = [
  {
    title: "Submit Tickets",
    desc: "Report issues with details and priority levels.",
    url: "/ticket.png",
  },
  {
    title: "Track Status",
    desc: "Stay updated on the progress of your requests.",
    url: "/ticket-status.png",
  },
  {
    title: "Agent Assignment",
    desc: "Tickets routed to the right support staff automatically.",
    url: "/ticket-assign.png",
  },
  {
    title: "Attachments",
    desc: "Add screenshots, PDFs, or logs for clarity.",
    url: "/ticket-attachment.png",
  },
];

const Features = () => {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="flex gap-4 items-center">
                <Image
                  width={40}
                  height={40}
                  src={feature.url}
                  alt="logo"
                  className="object-fit"
                  priority
                />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
