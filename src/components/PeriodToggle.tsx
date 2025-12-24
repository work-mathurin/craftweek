import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PeriodToggleProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function PeriodToggle({ value, onChange, disabled }: PeriodToggleProps) {
  const [customValue, setCustomValue] = useState("");
  const isCustom = value !== 7 && value !== 14 && value !== 30;

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    const num = parseInt(val, 10);
    if (num >= 1 && num <= 30) {
      onChange(num);
    }
  };

  const handlePresetClick = (preset: number) => {
    setCustomValue("");
    onChange(preset);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1 p-1 bg-card rounded-full shadow-input">
        {[7, 14, 30].map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => handlePresetClick(days)}
            disabled={disabled}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              value === days && !isCustom
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {days}d
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setCustomValue(isCustom ? String(value) : "");
            if (!isCustom) onChange(1);
          }}
          disabled={disabled}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
            isCustom
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {isCustom ? `${value}d` : "Custom"}
        </button>
      </div>

      {isCustom && (
        <div className="flex items-center gap-2 animate-fade-in">
          <Input
            type="number"
            min={1}
            max={30}
            value={customValue || value}
            onChange={handleCustomChange}
            disabled={disabled}
            className="w-16 h-8 text-center text-sm bg-card border-0 shadow-input rounded-full"
            placeholder="1-30"
          />
          <span className="text-xs text-muted-foreground">days</span>
        </div>
      )}
    </div>
  );
}
