import { CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStateProps {
  notesProcessed: number;
  onReset: () => void;
}

export function SuccessState({ notesProcessed, onReset }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Your Weekly Brain Reset is ready!
        </h2>
        <p className="text-muted-foreground">
          Processed {notesProcessed} daily note{notesProcessed !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-soft max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">Check your daily note</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your reflection has been added to today's daily note in Craft. Open Craft and navigate to today's date to see your Brain Reset.
        </p>
      </div>

      <Button
        onClick={onReset}
        variant="outline"
        className="text-muted-foreground hover:text-foreground border-border"
      >
        Generate another
      </Button>
    </div>
  );
}
