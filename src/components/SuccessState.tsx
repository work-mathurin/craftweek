import { ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStateProps {
  craftUrl: string;
  notesProcessed: number;
  onReset: () => void;
}

export function SuccessState({ craftUrl, notesProcessed, onReset }: SuccessStateProps) {
  const handleOpenCraft = () => {
    window.open(craftUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow" />
        <div className="relative w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Your Weekly Brain Reset is ready
        </h2>
        <p className="text-muted-foreground">
          Processed {notesProcessed} daily note{notesProcessed !== 1 ? 's' : ''}
        </p>
      </div>

      <Button
        onClick={handleOpenCraft}
        size="lg"
        className="h-16 px-10 text-lg font-medium rounded-2xl bg-primary hover:bg-primary/90 glow-primary hover:glow-intense transition-all duration-300"
      >
        <ExternalLink className="mr-3 h-5 w-5" />
        Open in Craft
      </Button>

      <button
        onClick={onReset}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Generate another
      </button>
    </div>
  );
}
