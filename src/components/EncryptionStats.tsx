
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, File, Percent, Activity } from "lucide-react";
import { generateRandomStats } from "../utils/aiAnalysisUtils";
import { SensitiveCategory } from "../utils/aiAnalysisUtils";

const EncryptionStats = () => {
  // For demo purposes, we'll generate some random stats
  const [stats, setStats] = useState({
    totalOperations: 0,
    filesEncrypted: 0,
    sensitiveContentPercentage: 0,
    mostCommonCategory: "" as SensitiveCategory | ""
  });

  useEffect(() => {
    const randomStats = generateRandomStats();
    setStats(randomStats);
  }, []);

  // Map category names for display
  const getCategoryDisplayName = (category: string): string => {
    const map: Record<string, string> = {
      financial: "Financial Information",
      identity: "Identity Information",
      professional: "Professional Data",
      personal: "Personal Information"
    };
    
    return map[category] || category;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Operations
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOperations}</div>
          <p className="text-xs text-muted-foreground">
            Encryption and decryption operations
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Files Encrypted
          </CardTitle>
          <File className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.filesEncrypted}</div>
          <p className="text-xs text-muted-foreground">
            Total files secured
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sensitive Content
          </CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.sensitiveContentPercentage}%</div>
          <p className="text-xs text-muted-foreground">
            Of content contained sensitive data
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Most Common Sensitivity
          </CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {stats.mostCommonCategory ? getCategoryDisplayName(stats.mostCommonCategory).split(" ")[0] : "None"}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.mostCommonCategory ? `${getCategoryDisplayName(stats.mostCommonCategory)} detected` : "No data detected"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EncryptionStats;
