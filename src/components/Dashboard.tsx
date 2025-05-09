
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EncryptionStats from "./EncryptionStats";
import SecurityInfo from "./SecurityInfo";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        Track your encryption activity and monitor security metrics.
      </p>
      
      <EncryptionStats />
      
      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Security Information</h3>
        <SecurityInfo />
      </div>
    </div>
  );
};

export default Dashboard;
