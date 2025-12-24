import { Brain, Eye, CheckCircle, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Reduce mental clutter",
    description: "Transform scattered notes into organized insights",
  },
  {
    icon: Eye,
    title: "See patterns across your week",
    description: "Discover themes and connections you might have missed",
  },
  {
    icon: CheckCircle,
    title: "Close open loops",
    description: "Identify incomplete tasks and lingering thoughts",
  },
  {
    icon: ArrowRight,
    title: "Start the next week with clarity",
    description: "Begin fresh with a clear understanding of what matters",
  },
];

export function WhyUseCraftWeek() {
  return (
    <section className="py-20 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground text-center mb-12">
          Why Use CraftWeek
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="bg-background rounded-xl p-6 shadow-soft animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
