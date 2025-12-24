import { useState } from "react";
import { Eye, EyeOff, Link } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ServerLinkInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ServerLinkInput({ value, onChange, disabled }: ServerLinkInputProps) {
  const [showLink, setShowLink] = useState(true);

  return (
    <div className="relative">
      <Link className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type={showLink ? "text" : "password"}
        placeholder="https://connect.craft.do/links/..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="pl-12 pr-12 h-14 text-base bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/50"
      />
      <button
        type="button"
        onClick={() => setShowLink(!showLink)}
        disabled={disabled}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        {showLink ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
