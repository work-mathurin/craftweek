import { Link, Calendar, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Link,
    title: "Connect Craft",
    description: "Paste your Craft server link and API token",
  },
  {
    icon: Calendar,
    title: "Select a Period",
    description: "Choose 7, 14, or 30 days of daily notes",
  },
  {
    icon: Sparkles,
    title: "Get Weekly Clarity",
    description: "A structured summary appears in today's Daily Note",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground text-center mb-16">
          How CraftWeek Works
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-card shadow-card flex items-center justify-center mx-auto mb-5">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
