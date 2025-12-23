import { BrainResetTool } from "@/components/BrainResetTool";

const Index = () => {
  return (
    <>
      {/* SEO */}
      <title>Weekly Brain Reset for Craft</title>
      <meta
        name="description"
        content="Turn your Craft daily notes into a clear weekly reflection. AI-powered insights from your week's thinking."
      />

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main content */}
      <main className="relative min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          <BrainResetTool />
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          Craft is the source. Craft is the destination.
        </p>
      </footer>
    </>
  );
};

export default Index;
