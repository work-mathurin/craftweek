import { CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStateProps {
  notesProcessed: number;
  onReset: () => void;
}

export function SuccessState({ notesProcessed, onReset }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow" />
        <div className="relative w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Your Weekly Brain Reset is ready!
        </h2>
        <p className="text-muted-foreground">
          Processed {notesProcessed} daily note{notesProcessed !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50 max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
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
        className="text-muted-foreground hover:text-foreground"
      >
        Generate another
      </Button>
    </div>
  );
}
