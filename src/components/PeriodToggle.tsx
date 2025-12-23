import { cn } from "@/lib/utils";

interface PeriodToggleProps {
  value: 7 | 14;
  onChange: (value: 7 | 14) => void;
  disabled?: boolean;
}

export function PeriodToggle({ value, onChange, disabled }: PeriodToggleProps) {
  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-secondary/30 rounded-full">
      <button
        type="button"
        onClick={() => onChange(7)}
        disabled={disabled}
        className={cn(
          "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
          value === 7
            ? "bg-primary text-primary-foreground shadow-lg glow-primary"
            : "text-muted-foreground hover:text-foreground",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        7 days
      </button>
      <button
        type="button"
        onClick={() => onChange(14)}
        disabled={disabled}
        className={cn(
          "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
          value === 14
            ? "bg-primary text-primary-foreground shadow-lg glow-primary"
            : "text-muted-foreground hover:text-foreground",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        14 days
      </button>
    </div>
  );
}
