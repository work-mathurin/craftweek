import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TokenInput } from "./TokenInput";
import { PeriodToggle } from "./PeriodToggle";
import { GenerateButton } from "./GenerateButton";
import { SuccessState } from "./SuccessState";
import { Link } from "lucide-react";
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
    <div className="flex flex-col items-center gap-8">
      {/* Form Card */}
      <div className="w-full bg-card rounded-2xl p-8 shadow-card">
        <div className="space-y-6">
          {/* Server URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Craft Server Link
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://connect.craft.do/links/..."
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                disabled={state === "loading"}
                className="pl-10 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Token Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Craft API Token
            </label>
            <TokenInput
              value={token}
              onChange={setToken}
              disabled={state === "loading"}
            />
          </div>

          {/* Period Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground text-center block">
              Period
            </label>
            <PeriodToggle
              value={period}
              onChange={setPeriod}
              disabled={state === "loading"}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <GenerateButton
        onClick={handleGenerate}
        isLoading={state === "loading"}
        disabled={!serverUrl.trim() || !token.trim()}
      />

      {/* Loading hint */}
      {state === "loading" && (
        <p className="text-sm text-muted-foreground">
          Fetching notes and generating reflection...
        </p>
      )}
    </div>
  );
}
