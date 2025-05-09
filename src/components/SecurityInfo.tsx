
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertCircle } from "lucide-react";

const SecurityInfo = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <CardTitle className="text-lg">Security Information</CardTitle>
          <CardDescription>How your data is protected</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            Zero-Knowledge Encryption
          </h4>
          <p className="text-muted-foreground">
            All encryption and decryption occurs entirely on your device. Your data and passwords never leave your computer.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            Password-Based Security
          </h4>
          <p className="text-muted-foreground">
            Files and text are encrypted with AES-256 using your password to derive an encryption key via PBKDF2 with 100,000+ iterations.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            Random Salts and IVs
          </h4>
          <p className="text-muted-foreground">
            Each encryption uses a unique random salt and initialization vector, ensuring the same content encrypted with the same password produces different results.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            Format Preservation
          </h4>
          <p className="text-muted-foreground">
            File decryption preserves the original file name and type, ensuring seamless content recovery.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityInfo;
