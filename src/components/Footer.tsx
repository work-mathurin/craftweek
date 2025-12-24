export function Footer() {
  return (
    <footer className="py-12 px-6 text-center">
      <p className="text-sm text-muted-foreground">
        Craft is the source. Craft is the destination.
      </p>
      <a
        href="https://developer.craft.do"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground/60 hover:text-primary transition-colors mt-2 inline-block"
      >
        Built with Craft API
      </a>
    </footer>
  );
}
