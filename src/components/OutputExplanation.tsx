import { FileText } from "lucide-react";

export function OutputExplanation() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-card rounded-3xl p-8 shadow-card text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Where does the result go?
          </h3>
          
          <p className="text-muted-foreground leading-relaxed">
            Your Weekly Brain Reset is saved directly inside today's Craft Daily Note, 
            so you can review, edit, and keep it alongside your existing workflow.
          </p>
        </div>
      </div>
    </section>
  );
}
