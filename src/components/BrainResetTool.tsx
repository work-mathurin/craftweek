import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ServerLinkInput } from "./ServerLinkInput";
import { PeriodToggle } from "./PeriodToggle";
import { GenerateButton } from "./GenerateButton";
import { SuccessState } from "./SuccessState";
import { Brain, Key } from "lucide-react";
import { Input } from "@/components/ui/input";

type State = "idle" | "loading" | "success";
type PeriodValue = 1 | 7 | 14 | 30;

interface SuccessData {
  craftUrl: string;
  notesProcessed: number;
}

export function BrainResetTool() {
  const [serverLink, setServerLink] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [period, setPeriod] = useState<PeriodValue>(7);
  const [state, setState] = useState<State>("idle");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const handleGenerate = async () => {
    if (!serverLink.trim()) {
      toast.error("Please enter your Craft server link");
      return;
    }

    if (!apiToken.trim()) {
      toast.error("Please enter your Craft API token");
      return;
    }

    if (!serverLink.includes("connect.craft.do/links/")) {
      toast.error("Please enter a valid Craft Connect link");
      return;
    }

    setState("loading");

    try {
      const { data, error } = await supabase.functions.invoke("generate-brain-reset", {
        body: { 
          serverLink: serverLink.trim(), 
          apiToken: apiToken.trim(),
          days: period 
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to generate brain reset");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setSuccessData({
        craftUrl: data.craftUrl,
        notesProcessed: data.notesProcessed,
      });
      setState("success");
      toast.success("Brain Reset generated successfully");
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
          Transform your daily notes into a clear reflection
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Craft Server Link
          </label>
          <ServerLinkInput
            value={serverLink}
            onChange={setServerLink}
            disabled={state === "loading"}
          />
          <p className="text-xs text-muted-foreground/70">
            Create a Connect link in Craft → Share → Generate Server Link
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Craft API Token
          </label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Your Craft API token"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              disabled={state === "loading"}
              className="pl-12 h-14 text-base bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/50"
            />
          </div>
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
        disabled={!serverLink.trim() || !apiToken.trim()}
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
