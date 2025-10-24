import { TicketsCount } from "@/actions/ticket-action";
import { Card, CardContent } from "@/components/ui/card";
import {
  TicketIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
} from "lucide-react";

const TicketStats = ({ counts }: { counts: TicketsCount | null }) => {
  const stats = [
    {
      title: "Open Tickets",
      value: counts?.open ?? "-",
      icon: TicketIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      title: "In Progress",
      value: counts?.inProgress ?? "-",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
    },
    {
      title: "Resolved",
      value: counts?.resolved ?? "-",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      title: "Closed",
      value: counts?.closed ?? "-",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
    },
    {
      title: "Archived",
      value: counts?.archived ?? "-",
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-100",
    },
    // {
    //   title: "Total Tickets",
    //   value: counts?.total ?? "-",
    //   icon: TicketCheck,
    //   color: "text-indigo-600",
    //   bgColor: "bg-indigo-50",
    //   iconBg: "bg-indigo-100",
    // },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Ticket Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`${stat?.bgColor} px-5 py-4 border-none shadow-md hover:shadow-lg transition-shadow`}
            >
              <CardContent className="p-0">
                <div className="flex justify-between items-center">
                  <p className="text-md font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <div className={`${stat.iconBg} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TicketStats;
