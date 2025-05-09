
import { Shield, Lock, Activity, FileUp } from "lucide-react";

const FeaturesBanner = () => {
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Encryption",
      description: "Secure your sensitive data with AES-256 encryption"
    },
    {
      icon: Activity,
      title: "AI Content Analysis",
      description: "Automatically detect sensitive information in your content"
    },
    {
      icon: FileUp,
      title: "File Encryption",
      description: "Encrypt and decrypt any file type with ease"
    },
    {
      icon: Lock,
      title: "Zero-Knowledge",
      description: "All processing happens locally on your device"
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mb-4">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBanner;
