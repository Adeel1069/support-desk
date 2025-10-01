import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
const Stats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Open Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">3</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">2</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Closed Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">7</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
