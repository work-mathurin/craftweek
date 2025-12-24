import { BrainResetTool } from "@/components/BrainResetTool";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyUseCraftWeek } from "@/components/WhyUseCraftWeek";
import { OutputExplanation } from "@/components/OutputExplanation";
import { Footer } from "@/components/Footer";
import { FileText, Calendar } from "lucide-react";

const Index = () => {
  return (
    <>
      {/* SEO */}
      <title>CraftWeek - Weekly Brain Reset for Craft</title>
      <meta
        name="description"
        content="Turn your Craft daily notes into a clear, structured weekly reflection. AI-powered insights from your week's thinking."
      />

      <main className="min-h-screen relative overflow-hidden">
        {/* Floating Icons */}
        <div className="absolute left-[10%] top-[30%] hidden lg:block animate-float">
          <div className="w-16 h-16 bg-card rounded-2xl shadow-card flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="absolute right-[10%] top-[25%] hidden lg:block animate-float-delayed">
          <div className="w-16 h-16 bg-card rounded-2xl shadow-card flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border bg-card text-sm text-muted-foreground mb-8 animate-fade-in">
              Weekly reflection tool
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-fade-in">
              Turn Daily Notes into{" "}
              <span className="text-primary">Weekly Clarity</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-xl mx-auto animate-fade-in">
              Get a structured summary from your Craft daily notes.
              <br />
              Saved directly to today's note.
            </p>

            {/* Tool */}
            <div className="animate-fade-in">
              <BrainResetTool />
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-10 text-sm text-muted-foreground animate-fade-in">
              <span>AI-powered summaries</span>
              <span className="text-border">•</span>
              <span>Saved to Craft</span>
              <span className="text-border">•</span>
              <span>7, 14, or 30 day periods</span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Why Use CraftWeek */}
        <WhyUseCraftWeek />

        {/* Output Explanation */}
        <OutputExplanation />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
};

export default Index;
