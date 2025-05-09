
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Lock, Unlock, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEncryption } from "@/hooks/useEncryption";
import PasswordStrength from "./PasswordStrength";
import AIAnalysis from "./AIAnalysis";
import FileUpload from "./FileUpload";

const EncryptDecrypt = () => {
  const { toast } = useToast();
  const encryption = useEncryption();
  const { 
    state, 
    setInputText, 
    setPassword, 
    setFile, 
    setTextMode,
    setAdvancedOptions,
    encrypt, 
    decrypt 
  } = encryption;
  
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  
  // Handle mode switch (Text or File)
  const handleModeChange = (mode: "text" | "file") => {
    setInputMode(mode);
    setTextMode(mode === "text");
  };
  
  // Handle copying to clipboard
  const handleCopyToClipboard = () => {
    if (state.outputText) {
      navigator.clipboard.writeText(state.outputText);
      toast({
        title: "Copied to clipboard",
        description: "The encrypted text has been copied to your clipboard."
      });
    }
  };
  
  // Handle download of encrypted/decrypted file
  const handleDownload = () => {
    if (state.outputFile) {
      const url = URL.createObjectURL(state.outputFile.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = state.outputFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "File downloaded",
        description: `File "${state.outputFile.name}" has been downloaded.`
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>
            Enter text or upload a file to encrypt or decrypt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text or File Toggle */}
          <Tabs
            defaultValue="text"
            value={inputMode}
            onValueChange={(value) => handleModeChange(value as "text" | "file")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="file">File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">Enter Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="Enter text to encrypt or paste encrypted text to decrypt"
                  className="input-area min-h-32"
                  value={state.inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="file" className="pt-4">
              <FileUpload
                onFileSelect={setFile}
                selectedFile={state.file}
              />
            </TabsContent>
          </Tabs>
          
          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your encryption/decryption password"
              value={state.password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength password={state.password} />
          </div>
          
          {/* Advanced Options */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced-options">
              <AccordionTrigger className="text-sm">
                Advanced Options
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {/* Iterations Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="iterations">Key Derivation Iterations</Label>
                      <span className="text-xs text-muted-foreground">
                        {state.advancedOptions.iterations?.toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      id="iterations"
                      min={10000}
                      max={1000000}
                      step={10000}
                      value={[state.advancedOptions.iterations || 100000]}
                      onValueChange={(value) => setAdvancedOptions({ iterations: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher values increase security but may slow down encryption/decryption.
                    </p>
                  </div>
                  
                  {/* Key Size Options */}
                  <div className="space-y-2">
                    <Label>Encryption Key Size</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={state.advancedOptions.keySize === 256 / 32 ? "default" : "outline"}
                        onClick={() => setAdvancedOptions({ keySize: 256 / 32 })}
                      >
                        256-bit (Recommended)
                      </Button>
                      <Button
                        type="button"
                        variant={state.advancedOptions.keySize === 128 / 32 ? "default" : "outline"}
                        onClick={() => setAdvancedOptions({ keySize: 128 / 32 })}
                      >
                        128-bit
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* AI Analysis (for text mode only) */}
            {inputMode === "text" && state.inputText && (
              <AccordionItem value="ai-analysis">
                <AccordionTrigger className="text-sm" onClick={() => setShowAIAnalysis(true)}>
                  AI Content Analysis
                </AccordionTrigger>
                <AccordionContent>
                  {showAIAnalysis && (
                    <AIAnalysis content={state.inputText} />
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={encrypt}
              disabled={state.isProcessing || (!state.inputText && !state.file) || !state.password}
              className="flex-1 md:flex-none"
            >
              <Lock className="mr-2 h-4 w-4" />
              Encrypt
            </Button>
            
            <Button
              onClick={decrypt}
              variant="secondary"
              disabled={state.isProcessing || (!state.inputText && !state.file) || !state.password}
              className="flex-1 md:flex-none"
            >
              <Unlock className="mr-2 h-4 w-4" />
              Decrypt
            </Button>
          </div>
          
          {/* Error display */}
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Output Section - only show when there's output */}
      {(state.outputText || state.outputFile) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {state.operationType === "encrypt" ? "Encrypted Output" : "Decrypted Output"}
            </CardTitle>
            <CardDescription>
              {state.operationType === "encrypt" 
                ? "Your content has been encrypted successfully" 
                : "Your content has been decrypted successfully"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.isTextMode ? (
              <>
                <Textarea
                  readOnly
                  value={state.outputText}
                  className="input-area min-h-32"
                />
                <Button onClick={handleCopyToClipboard}>
                  Copy to Clipboard
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <p className="font-medium">
                    {state.outputFile?.name || "File ready for download"}
                  </p>
                </div>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EncryptDecrypt;
