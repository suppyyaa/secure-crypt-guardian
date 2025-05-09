
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import EncryptDecrypt from "../components/EncryptDecrypt";
import Dashboard from "../components/Dashboard";
import FeaturesBanner from "../components/FeaturesBanner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("encrypt");

  return (
    <div className="min-h-screen flex flex-col dark">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="crypto-gradient p-2 rounded-md">
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold">SecureCrypt</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Advanced Client-Side Encryption
            </div>
          </div>
        </div>
      </header>
      
      {/* Features Banner */}
      <div className="bg-muted">
        <div className="container mx-auto">
          <FeaturesBanner />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto py-8 px-6">
        <Tabs 
          defaultValue="encrypt" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
            <TabsTrigger value="encrypt">Encrypt & Decrypt</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="encrypt" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Encrypt & Decrypt</h2>
              <p className="text-muted-foreground">
                Secure your sensitive information with advanced encryption.
              </p>
            </div>
            <EncryptDecrypt />
          </TabsContent>
          
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">SecureCrypt</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All encryption happens locally in your browser. Your data never leaves your device.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
