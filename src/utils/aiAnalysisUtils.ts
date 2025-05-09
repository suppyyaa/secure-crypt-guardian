
// AI analysis patterns
const patterns = {
  financial: [
    'bank account',
    'credit card',
    'card number',
    'cvv',
    'expiration date',
    'routing number',
    'iban',
    'swift',
    'transaction',
    'wire transfer',
    'payment',
    'invoice',
    'loan',
    'mortgage',
    'deposit',
    'withdrawal',
    'financial',
    'investment',
    'trading',
    'crypto',
    'bitcoin',
    'money'
  ],
  identity: [
    'password',
    'ssn',
    'social security',
    'driver license',
    'passport',
    'id number',
    'identification',
    'authentication',
    'credentials',
    'login',
    'username',
    'user id',
    'account number',
    'birth date',
    'birthday',
    'birthplace'
  ],
  professional: [
    'confidential',
    'proprietary',
    'classified',
    'secret',
    'internal use',
    'not for distribution',
    'nda',
    'agreement',
    'contract',
    'intellectual property',
    'patent',
    'trademark',
    'copyright',
    'trade secret',
    'business plan',
    'strategy',
    'competitive',
    'merger',
    'acquisition'
  ],
  personal: [
    'address',
    'phone number',
    'email',
    'home',
    'family',
    'spouse',
    'child',
    'parent',
    'medical',
    'health',
    'diagnosis',
    'treatment',
    'therapy',
    'personal',
    'private',
    'sensitive',
    'location',
    'gps',
    'whereabouts'
  ]
};

export type SensitiveCategory = 'financial' | 'identity' | 'professional' | 'personal';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface AnalysisResult {
  riskLevel: RiskLevel;
  sensitiveContent: {
    [key in SensitiveCategory]: {
      found: boolean;
      count: number;
      terms: string[];
    }
  };
  summary: string;
  totalMatches: number;
  primaryCategory: SensitiveCategory | null;
}

// Analyze text for sensitive content
export const analyzeContent = (text: string): AnalysisResult => {
  // Initialize result object
  const result: AnalysisResult = {
    riskLevel: 'low',
    sensitiveContent: {
      financial: { found: false, count: 0, terms: [] },
      identity: { found: false, count: 0, terms: [] },
      professional: { found: false, count: 0, terms: [] },
      personal: { found: false, count: 0, terms: [] }
    },
    summary: '',
    totalMatches: 0,
    primaryCategory: null
  };
  
  if (!text || text.trim().length === 0) {
    result.summary = "No content to analyze";
    return result;
  }
  
  const textLower = text.toLowerCase();
  
  // Analyze each category
  Object.entries(patterns).forEach(([category, terms]) => {
    const categoryKey = category as SensitiveCategory;
    const foundTerms = terms.filter(term => textLower.includes(term.toLowerCase()));
    
    if (foundTerms.length > 0) {
      result.sensitiveContent[categoryKey].found = true;
      result.sensitiveContent[categoryKey].count = foundTerms.length;
      result.sensitiveContent[categoryKey].terms = foundTerms;
      result.totalMatches += foundTerms.length;
    }
  });
  
  // Determine primary category
  if (result.totalMatches > 0) {
    let maxCount = 0;
    Object.entries(result.sensitiveContent).forEach(([category, data]) => {
      if (data.count > maxCount) {
        maxCount = data.count;
        result.primaryCategory = category as SensitiveCategory;
      }
    });
  }
  
  // Calculate risk level
  if (result.totalMatches === 0) {
    result.riskLevel = 'low';
  } else if (result.totalMatches <= 2) {
    result.riskLevel = 'low';
  } else if (result.totalMatches <= 5) {
    result.riskLevel = 'medium';
  } else {
    result.riskLevel = 'high';
  }
  
  // Generate summary
  if (result.totalMatches === 0) {
    result.summary = "No sensitive information detected";
  } else {
    const categories = Object.entries(result.sensitiveContent)
      .filter(([_, data]) => data.found)
      .map(([category, _]) => category);
      
    result.summary = `Detected ${result.totalMatches} instances of potentially sensitive information related to ${categories.join(', ')}`;
  }
  
  return result;
};

// Generate a friendly explanation based on the analysis result
export const generateExplanation = (result: AnalysisResult): string => {
  if (result.totalMatches === 0) {
    return "No sensitive information was detected in the provided content.";
  }
  
  let explanation = `The analysis detected ${result.totalMatches} potential instances of sensitive information.\n\n`;
  
  if (result.primaryCategory) {
    const categoryMap = {
      financial: "financial information",
      identity: "identity-related information",
      professional: "professional or confidential business information",
      personal: "personal information"
    };
    
    explanation += `Most of the detected content appears to be ${categoryMap[result.primaryCategory]}.\n\n`;
  }
  
  Object.entries(result.sensitiveContent).forEach(([category, data]) => {
    if (data.found) {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      explanation += `${categoryName}: Found ${data.count} potential matches including terms like "${data.terms.slice(0, 3).join('", "')}"${data.terms.length > 3 ? '...' : ''}\n`;
    }
  });
  
  explanation += `\nRecommendation: `;
  
  if (result.riskLevel === 'high') {
    explanation += "Consider encrypting this content with a strong password as it contains multiple instances of potentially sensitive information.";
  } else if (result.riskLevel === 'medium') {
    explanation += "Consider encrypting this content as it may contain some sensitive information.";
  } else {
    explanation += "This content appears to contain minimal sensitive information, but encryption is still recommended for added security.";
  }
  
  return explanation;
};

// Generate random stats for the dashboard demo
export const generateRandomStats = () => {
  return {
    totalOperations: Math.floor(Math.random() * 100) + 50,
    filesEncrypted: Math.floor(Math.random() * 30) + 10,
    sensitiveContentPercentage: Math.floor(Math.random() * 65) + 10,
    mostCommonCategory: ['financial', 'identity', 'professional', 'personal'][
      Math.floor(Math.random() * 4)
    ] as SensitiveCategory
  };
};
