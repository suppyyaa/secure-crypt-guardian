
import { calculatePasswordStrength } from "../utils/encryptionUtils";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const strength = calculatePasswordStrength(password);
  
  // Determine color and label based on strength
  const getStrengthInfo = () => {
    if (strength >= 80) return { color: "bg-sensitive-low", label: "Strong" };
    if (strength >= 50) return { color: "bg-sensitive-medium", label: "Medium" };
    return { color: "bg-sensitive-high", label: "Weak" };
  };
  
  const { color, label } = getStrengthInfo();
  
  return (
    <div className="space-y-2 mt-2">
      <div className="text-xs text-muted-foreground flex justify-between">
        <span>Password Strength</span>
        <span>{label}</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrength;
