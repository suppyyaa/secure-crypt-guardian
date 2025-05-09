
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { analyzeContent, generateExplanation, AnalysisResult, RiskLevel } from "../utils/aiAnalysisUtils";

interface AIAnalysisProps {
  content: string;
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

const AIAnalysis = ({ content, onAnalysisComplete }: AIAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const analysisResult = analyzeContent(content);
      setResult(analysisResult);
      setIsAnalyzing(false);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
    }, 800); // Simulated delay for analysis
  };
  
  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case "high": return <ShieldX className="h-5 w-5 text-sensitive-high" />;
      case "medium": return <AlertCircle className="h-5 w-5 text-sensitive-medium" />;
      case "low": return <ShieldCheck className="h-5 w-5 text-sensitive-low" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };
  
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "high": return "border-sensitive-high/20 bg-sensitive-high/10";
      case "medium": return "border-sensitive-medium/20 bg-sensitive-medium/10";
      case "low": return "border-sensitive-low/20 bg-sensitive-low/10";
      default: return "";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Content Analysis</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAnalyze} 
          disabled={!content || isAnalyzing}
          className="text-xs h-8"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Content"}
        </Button>
      </div>
      
      {result && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={result.riskLevel === "low" ? "outline" : "destructive"} className="flex gap-1 items-center">
              {getRiskIcon(result.riskLevel)}
              <span className="capitalize">{result.riskLevel} Risk</span>
            </Badge>
            
            {result.primaryCategory && (
              <Badge variant="secondary" className="capitalize">
                {result.primaryCategory} content detected
              </Badge>
            )}
            
            {result.totalMatches > 0 && (
              <Badge variant="outline">
                {result.totalMatches} potential matches
              </Badge>
            )}
          </div>
          
          <Alert className={getRiskColor(result.riskLevel)}>
            <AlertTitle className="flex items-center gap-2">
              {getRiskIcon(result.riskLevel)}
              <span>AI Analysis Result</span>
            </AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              <div className="whitespace-pre-wrap">
                {generateExplanation(result)}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
