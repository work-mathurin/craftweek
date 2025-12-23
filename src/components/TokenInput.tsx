import { useState } from "react";
import { Eye, EyeOff, Key } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TokenInput({ value, onChange, disabled }: TokenInputProps) {
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="relative">
      <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type={showToken ? "text" : "password"}
        placeholder="Paste your Craft API token"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="pl-12 pr-12 h-14 text-lg bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/50"
      />
      <button
        type="button"
        onClick={() => setShowToken(!showToken)}
        disabled={disabled}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        {showToken ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
