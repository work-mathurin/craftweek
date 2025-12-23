import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function GenerateButton({ onClick, isLoading, disabled }: GenerateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size="lg"
      className={cn(
        "relative h-16 px-10 text-lg font-medium rounded-2xl",
        "bg-primary hover:bg-primary/90",
        "transition-all duration-300",
        "glow-primary hover:glow-intense",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:glow-none"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-3 h-5 w-5" />
          Generate Weekly Brain Reset
        </>
      )}
    </Button>
  );
}
