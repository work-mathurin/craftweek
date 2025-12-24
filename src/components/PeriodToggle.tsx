import { cn } from "@/lib/utils";

type PeriodValue = 1 | 7 | 14 | 30;

interface PeriodToggleProps {
  value: PeriodValue;
  onChange: (value: PeriodValue) => void;
  disabled?: boolean;
}

const periods: { value: PeriodValue; label: string }[] = [
  { value: 1, label: "24h" },
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
];

export function PeriodToggle({ value, onChange, disabled }: PeriodToggleProps) {
  return (
    <div className="flex items-center justify-center gap-1 p-1 bg-secondary/30 rounded-full">
      {periods.map((period) => (
        <button
          key={period.value}
          type="button"
          onClick={() => onChange(period.value)}
          disabled={disabled}
          className={cn(
            "px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
            value === period.value
              ? "bg-primary text-primary-foreground shadow-lg glow-primary"
              : "text-muted-foreground hover:text-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
