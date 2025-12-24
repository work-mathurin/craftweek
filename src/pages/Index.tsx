import { BrainResetTool } from "@/components/BrainResetTool";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyUseCraftWeek } from "@/components/WhyUseCraftWeek";
import { OutputExplanation } from "@/components/OutputExplanation";
import { Footer } from "@/components/Footer";
import { FileText, Calendar, Sparkles, Brain, Lightbulb, CheckCircle2, Layers } from "lucide-react";

const CraftLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-primary">
    <path 
      d="M12 2L2 7L12 12L22 7L12 2Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2 17L12 22L22 17" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2 12L12 17L22 12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

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
        <div className="absolute left-[8%] top-[25%] hidden lg:block animate-float">
          <div className="w-16 h-16 bg-card rounded-2xl shadow-card flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="absolute right-[8%] top-[20%] hidden lg:block animate-float-delayed">
          <div className="w-16 h-16 bg-card rounded-2xl shadow-card flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="absolute left-[5%] top-[55%] hidden lg:block animate-float-delayed">
          <div className="w-14 h-14 bg-card rounded-2xl shadow-card flex items-center justify-center">
            <CraftLogo />
          </div>
        </div>
        <div className="absolute right-[6%] top-[50%] hidden lg:block animate-float">
          <div className="w-14 h-14 bg-card rounded-2xl shadow-card flex items-center justify-center">
            <Brain className="h-7 w-7 text-primary" />
          </div>
        </div>
        <div className="absolute left-[15%] top-[70%] hidden lg:block animate-float">
          <div className="w-12 h-12 bg-card rounded-xl shadow-card flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="absolute right-[12%] top-[65%] hidden lg:block animate-float-delayed">
          <div className="w-12 h-12 bg-card rounded-xl shadow-card flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="absolute left-[3%] top-[40%] hidden xl:block animate-float-delayed">
          <div className="w-10 h-10 bg-card rounded-xl shadow-card flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="absolute right-[3%] top-[38%] hidden xl:block animate-float">
          <div className="w-10 h-10 bg-card rounded-xl shadow-card flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary" />
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
