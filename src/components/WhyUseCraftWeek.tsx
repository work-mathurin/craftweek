import { Brain, Eye, CheckCircle, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Reduce mental clutter",
  },
  {
    icon: Eye,
    title: "See patterns across your week",
  },
  {
    icon: CheckCircle,
    title: "Close open loops",
  },
  {
    icon: ArrowRight,
    title: "Start the next week with clarity",
  },
];

export function WhyUseCraftWeek() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground text-center mb-12">
          Why Use CraftWeek
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="flex items-center gap-3 bg-card rounded-full px-5 py-3 shadow-soft animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <benefit.icon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground">{benefit.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
