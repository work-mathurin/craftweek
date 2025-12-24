import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TokenInput } from "./TokenInput";
import { PeriodToggle } from "./PeriodToggle";
import { SuccessState } from "./SuccessState";
import { Link, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type State = "idle" | "loading" | "success";

interface SuccessData {
  notesProcessed: number;
}

export function BrainResetTool() {
  const [serverUrl, setServerUrl] = useState("");
  const [token, setToken] = useState("");
  const [period, setPeriod] = useState<number>(7);
  const [state, setState] = useState<State>("idle");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const handleGenerate = async () => {
    if (!serverUrl.trim()) {
      toast.error("Please enter your Craft server link");
      return;
    }
    if (!token.trim()) {
      toast.error("Please enter your Craft API token");
      return;
    }

    setState("loading");

    // Capture token and clear from state immediately for security
    const tokenToUse = token.trim();
    setToken("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-brain-reset", {
        body: { serverUrl: serverUrl.trim(), craftToken: tokenToUse, days: period },
      });

      if (error) {
        throw new Error(error.message || "Failed to generate brain reset");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setSuccessData({
        notesProcessed: data.notesProcessed,
      });
      setState("success");
      toast.success("Weekly Brain Reset generated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
      setState("idle");
    }
  };

  const handleReset = () => {
    setState("idle");
    setSuccessData(null);
  };

  if (state === "success" && successData) {
    return <SuccessState {...successData} onReset={handleReset} />;
  }

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-2xl mx-auto">
      {/* Inline Server URL + Button */}
      <div className="w-full flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            type="url"
            placeholder="Paste Craft server link"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            disabled={state === "loading"}
            className="h-14 px-6 text-base bg-card border-0 shadow-input rounded-full placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
        <Button
          onClick={handleGenerate}
          disabled={!serverUrl.trim() || !token.trim() || state === "loading"}
          size="lg"
          className="h-14 px-8 text-base font-medium rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-all duration-200 disabled:opacity-50"
        >
          {state === "loading" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Reset
            </>
          )}
        </Button>
      </div>

      {/* Token & Period in a subtle row */}
      <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center">
        <div className="w-full sm:w-72">
          <TokenInput
            value={token}
            onChange={setToken}
            disabled={state === "loading"}
          />
        </div>
        <PeriodToggle
          value={period}
          onChange={setPeriod}
          disabled={state === "loading"}
        />
      </div>

      {/* Loading hint */}
      {state === "loading" && (
        <p className="text-sm text-muted-foreground">
          Fetching notes and generating reflection...
        </p>
      )}
    </div>
  );
}
