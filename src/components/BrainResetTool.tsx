import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TokenInput } from "./TokenInput";
import { PeriodToggle } from "./PeriodToggle";
import { GenerateButton } from "./GenerateButton";
import { SuccessState } from "./SuccessState";
import { Brain, Link } from "lucide-react";
import { Input } from "@/components/ui/input";

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

    try {
      const { data, error } = await supabase.functions.invoke("generate-brain-reset", {
        body: { serverUrl: serverUrl.trim(), craftToken: token.trim(), days: period },
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
      console.error("Error:", error);
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
    <div className="flex flex-col items-center gap-12">
      {/* Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow" />
        <div className="relative w-24 h-24 rounded-full bg-card flex items-center justify-center border border-border/50 animate-float">
          <Brain className="h-12 w-12 text-primary" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          Weekly Brain Reset
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          Transform your daily notes into a clear weekly reflection
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Craft Server Link
          </label>
          <div className="relative">
            <Link className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://connect.craft.do/links/..."
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              disabled={state === "loading"}
              className="pl-12 h-14 text-lg bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Craft API Token
          </label>
          <TokenInput
            value={token}
            onChange={setToken}
            disabled={state === "loading"}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground text-center block">
            Period
          </label>
          <PeriodToggle
            value={period}
            onChange={setPeriod}
            disabled={state === "loading"}
          />
        </div>
      </div>

      {/* Action */}
      <GenerateButton
        onClick={handleGenerate}
        isLoading={state === "loading"}
        disabled={!serverUrl.trim() || !token.trim()}
      />

      {/* Subtle hint */}
      {state === "loading" && (
        <p className="text-sm text-muted-foreground animate-pulse">
          Fetching notes and generating reflection...
        </p>
      )}
    </div>
  );
}
