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
      <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type={showToken ? "text" : "password"}
        placeholder="Paste API token"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-12 pl-11 pr-11 text-sm bg-card border-0 shadow-input rounded-full placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-primary/20"
      />
      <button
        type="button"
        onClick={() => setShowToken(!showToken)}
        disabled={disabled}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
