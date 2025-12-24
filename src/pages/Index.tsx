import { BrainResetTool } from "@/components/BrainResetTool";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyUseCraftWeek } from "@/components/WhyUseCraftWeek";
import { OutputExplanation } from "@/components/OutputExplanation";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <>
      {/* SEO */}
      <title>CraftWeek - Weekly Brain Reset for Craft</title>
      <meta
        name="description"
        content="Turn your Craft daily notes into a clear, structured weekly reflection. AI-powered insights from your week's thinking."
      />

      {/* Hero Section */}
      <main className="min-h-screen">
        <section className="py-20 px-6">
          <div className="max-w-xl mx-auto text-center">
            {/* Header */}
            <div className="mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                CraftWeek
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                From daily notes to weekly clarity
              </p>
              <p className="text-muted-foreground">
                Turn your Craft daily notes into a clear, structured weekly reflection.
              </p>
            </div>

            {/* Tool */}
            <BrainResetTool />
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
